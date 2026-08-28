import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Menu,
  LogOut,
  Users,
  ChevronDown,
  Search,
  Palette,
  Ghost,
  Shield,
} from 'lucide-react';

import MessageBubble from '@/components/chat/MessageBubble';
import ChatInput from '@/components/chat/ChatInput';
import TypingIndicator from '@/components/chat/TypingIndicator';
import RoomInfo from '@/components/chat/RoomInfo';
import SettingsPanel from '@/components/chat/SettingsPanel';
import EmptyChatState from '@/components/chat/EmptyChatState';
import DateSeparator from '@/components/chat/DateSeparator';
import MessageSearch from '@/components/chat/MessageSearch';
import StarredMessages from '@/components/chat/StarredMessages';
import PinnedMessages from '@/components/chat/PinnedMessages';
import LanguageSelectModal from '@/components/LanguageSelectModal';
import ChatWallpaperModal, { CHAT_WALLPAPERS } from '@/components/chat/ChatWallpaperModal';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import { ensureProfile, getLocalProfile, getRoomSettings, saveRoom } from '@/lib/chat-utils';
import { prefetchTranslation, translateBatch } from '@/lib/openrouter';
import { getLanguageInfo } from '@/lib/languages';
import { db } from '@/api/base44Client';

export default function Chat() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showStarred, setShowStarred] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(null);

  // New Telegram + WhatsApp + Instagram Chat Features
  const [isVanishMode, setIsVanishMode] = useState(false);
  const [selfDestructTimer, setSelfDestructTimer] = useState(0);
  const [wallpaperId, setWallpaperId] = useState('parchment');
  const [showWallpaperModal, setShowWallpaperModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const participantRef = useRef(null);
  const participantEntityIdRef = useRef(null);
  const roomEntityIdRef = useRef(null);
  const typingDebounceRef = useRef(null);
  const typingClearRef = useRef(null);

  // Auto-scroll
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    setShowScrollButton(!isAtBottom);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, participants, scrollToBottom]);

  // Load wallpaper preference
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(`whisper_chat_theme_${roomId}`);
      if (savedTheme) setWallpaperId(savedTheme);
    } catch {
      // ignore
    }
  }, [roomId]);

  useEffect(() => {
    const handleProfileUpdated = (event) => {
      if (event.detail) setProfileLoaded(event.detail);
    };
    window.addEventListener('whisper-profile-updated', handleProfileUpdated);
    return () => window.removeEventListener('whisper-profile-updated', handleProfileUpdated);
  }, []);

  const handleSelectWallpaper = (themeId) => {
    setWallpaperId(themeId);
    try {
      localStorage.setItem(`whisper_chat_theme_${roomId}`, themeId);
      toast.success('Chat wallpaper updated');
    } catch {
      // ignore
    }
  };

  // Main room init
  useEffect(() => {
    let unsubMessages = null;
    let unsubRoom = null;
    let unsubParticipants = null;
    let heartbeat = null;
    let cancelled = false;

    async function init() {
      try {
        let profile = participantRef.current;
        if (!profile) {
          const p0 = await ensureProfile();
          setProfileLoaded(p0);
          participantRef.current = {
            id: p0.profile_id || p0.id,
            name: p0.display_name,
            color: p0.avatar_color,
            avatar_url: p0.avatar_url || '',
            username: p0.username || '',
          };
        }
        const p = participantRef.current;
        const settings = getRoomSettings(roomId);

        // Check / create ChatRoom
        const existingRooms = await db.entities.ChatRoom.filter({ room_id: roomId });
        let chatRoom;

        if (existingRooms.length === 0) {
          chatRoom = await db.entities.ChatRoom.create({
            room_id: roomId,
            owner_id: settings?.owner_id || p.id,
            room_name: settings?.room_name || '',
            max_participants: settings?.max_participants || 50,
            allow_file_sharing: settings?.allow_file_sharing ?? true,
            allow_new_joins: settings?.allow_new_joins ?? true,
            typing_preview_visible: settings?.typing_preview_visible ?? true,
            message_notifications: settings?.message_notifications ?? true,
            status: 'waiting',
          });
        } else {
          chatRoom = existingRooms[0];
          if (chatRoom.status === 'ended') {
            setError('This room has been ended by the owner.');
            setLoading(false);
            return;
          }
        }

        if (cancelled) return;
        roomEntityIdRef.current = chatRoom.id;
        setRoom(chatRoom);
        saveRoom(roomId, chatRoom.room_name || '');

        // Check / create RoomParticipant
        const existingParticipants = await db.entities.RoomParticipant.filter({
          room_id: roomId,
        });
        if (cancelled) return;

        const myExisting = existingParticipants.find(
          (rp) => rp.participant_id === p.id || rp.user_id === p.id
        );

        if (myExisting) {
          await db.entities.RoomParticipant.update(myExisting.id, {
            online: true,
            typing: false,
            typing_text: '',
          });
          participantEntityIdRef.current = myExisting.id;
        } else {
          if (existingParticipants.length >= (chatRoom.max_participants || 50)) {
            setError('This room is full.');
            setLoading(false);
            return;
          }
          if (!chatRoom.allow_new_joins && chatRoom.owner_id !== p.id) {
            setError('The owner has locked this room.');
            setLoading(false);
            return;
          }

          const newPart = await db.entities.RoomParticipant.create({
            room_id: roomId,
            participant_id: p.id,
            user_id: p.id,
            name: p.name,
            nickname: p.name,
            avatar_color: p.color,
            avatar_url: p.avatar_url || '',
            online: true,
            typing: false,
            typing_text: '',
            is_owner: chatRoom.owner_id === p.id,
          });
          participantEntityIdRef.current = newPart.id;

          if (chatRoom.message_notifications && existingParticipants.length > 0) {
            toast.success(`${p.name} joined the room`);
          }

          if (chatRoom.status === 'waiting') {
            await db.entities.ChatRoom.update(chatRoom.id, { status: 'active' });
          }
        }

        // Reload participants
        const allParticipants = await db.entities.RoomParticipant.filter({
          room_id: roomId,
        });
        if (cancelled) return;
        setParticipants(allParticipants);

        // Load messages
        const existingMessages = await db.entities.ChatMessage.filter(
          { room_id: roomId },
          'created_date',
          250
        );
        if (cancelled) return;
        setMessages(existingMessages);

        // Preload / prefetch translations for foreign messages using SLM batching
        const initialProf = getLocalProfile();
        if (initialProf?.language && initialProf?.auto_translate !== false) {
          const foreignTexts = existingMessages
            .filter((m) => m.sender_id !== p.id && m.content && m.content.trim())
            .map((m) => m.content);
          if (foreignTexts.length > 0) {
            translateBatch(foreignTexts, initialProf.language).catch(() => {});
          }
        }

        // Mark unseen messages from others
        const toMarkSeen = existingMessages.filter(
          (m) => m.sender_id !== p.id && !m.seen
        );
        toMarkSeen.forEach((msg) => {
          db.entities.ChatMessage.update(msg.id, { seen: true }).catch(() => {});
        });

        // Subscribe to messages
        unsubMessages = db.entities.ChatMessage.subscribe((event) => {
          if (event.data.room_id !== roomId) return;
          if (event.type === 'create') {
            setMessages((prev) => {
              if (prev.some((m) => m.id === event.data.id)) return prev;
              return [...prev, event.data];
            });

            if (event.data.sender_id !== participantRef.current?.id) {
              soundFx.playMessagePop();
              const myProfile = getLocalProfile();
              if (myProfile?.language && myProfile.auto_translate !== false && event.data.content) {
                prefetchTranslation(event.data.content, myProfile.language);
              }
              db.entities.ChatMessage
                .update(event.data.id, { seen: true })
                .catch(() => {});
            }
          } else if (event.type === 'update') {
            setMessages((prev) =>
              prev.map((m) => (m.id === event.data.id ? event.data : m))
            );
          } else if (event.type === 'delete') {
            setMessages((prev) => prev.filter((m) => m.id !== event.data.id));
          }
        });

        // Subscribe to room updates
        unsubRoom = db.entities.ChatRoom.subscribe((event) => {
          if (event.data.room_id !== roomId) return;
          if (event.type === 'update') {
            setRoom(event.data);
            if (event.data.status === 'ended') {
              setError('The owner has ended this room.');
              setLoading(false);
            }
          }
        });

        // Subscribe to participant changes
        unsubParticipants = db.entities.RoomParticipant.subscribe((event) => {
          if (event.data.room_id !== roomId) return;
          if (event.type === 'create') {
            setParticipants((prev) => {
              if (prev.some((p) => p.id === event.data.id)) return prev;
              return [...prev, event.data];
            });
          } else if (event.type === 'update') {
            setParticipants((prev) =>
              prev.map((p) => (p.id === event.data.id ? event.data : p))
            );
          } else if (event.type === 'delete') {
            setParticipants((prev) => prev.filter((p) => p.id !== event.data.id));
          }
        });

        // Heartbeat
        heartbeat = setInterval(async () => {
          try {
            if (!participantEntityIdRef.current) return;
            await db.entities.RoomParticipant.update(
              participantEntityIdRef.current,
              { online: true }
            );
          } catch {
            // ignore
          }
        }, 15000);

        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError('Failed to join room. Please try again.');
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      if (unsubMessages) unsubMessages();
      if (unsubRoom) unsubRoom();
      if (unsubParticipants) unsubParticipants();
      if (heartbeat) clearInterval(heartbeat);
      if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
      if (typingClearRef.current) clearTimeout(typingClearRef.current);

      if (participantEntityIdRef.current) {
        db.entities.RoomParticipant
          .update(participantEntityIdRef.current, {
            online: false,
            typing: false,
            typing_text: '',
          })
          .catch(() => {});
      }
    };
  }, [roomId]);

  // Clean up vanish messages if leaving vanish mode
  const toggleVanishMode = () => {
    const next = !isVanishMode;
    setIsVanishMode(next);
    toast.success(
      next
        ? '👻 Vanish Mode ON — Messages will disappear when closed'
        : 'Vanish Mode OFF'
    );
  };

  // Send message
  const sendMessage = async (
    content,
    messageType = 'text',
    fileUrl = null,
    fileName = null,
    replyTo = null,
    options = {}
  ) => {
    const p = participantRef.current;
    if (!p) return;
    try {
      const msgObj = {
        room_id: roomId,
        sender_id: p.id,
        sender_name: p.name,
        sender_avatar_color: p.color,
        sender_avatar_url: p.avatar_url || '',
        content: content || '',
        message_type: messageType,
        file_url: fileUrl,
        file_name: fileName,
        seen: false,
        reply_to: replyTo ? JSON.stringify(replyTo) : '',
        view_once: Boolean(options.viewOnce),
        self_destruct: options.selfDestruct || 0,
        is_vanish: Boolean(options.isVanish || isVanishMode),
        poll_data: options.pollData ? JSON.stringify(options.pollData) : '',
        audio_duration: options.audioDuration || 0,
      };

      await db.entities.ChatMessage.create(msgObj);

      if (roomEntityIdRef.current) {
        const preview =
          messageType === 'text'
            ? (content || '').slice(0, 80)
            : messageType === 'image'
            ? '📷 Photo'
            : messageType === 'video'
            ? '🎥 Video'
            : messageType === 'audio'
            ? '🎙️ Voice note'
            : messageType === 'poll'
            ? '📊 Poll'
            : messageType === 'doodle'
            ? '🎨 Doodle'
            : `📎 ${fileName || 'File'}`;

        db.entities.ChatRoom.update(roomEntityIdRef.current, {
          last_message_preview: preview,
          last_message_at: new Date().toISOString(),
          last_sender_name: p.name,
          last_message_type: messageType,
          last_sender_avatar_url: p.avatar_url || '',
        }).catch(() => {});
      }
    } catch {
      toast.error('Failed to send message');
    }
  };

  const handleSend = (text, replyTo = null, options = {}) => {
    if (options.messageType === 'doodle') {
      sendMessage(text, 'doodle', options.fileUrl, options.fileName, replyTo, options);
    } else if (options.messageType === 'poll') {
      sendMessage(text, 'poll', null, null, replyTo, options);
    } else {
      sendMessage(text, 'text', null, null, replyTo, options);
    }
    handleTyping('');
    setReplyingTo(null);
  };

  const handleFileUpload = async (file, options = {}) => {
    if (room && !room.allow_file_sharing) {
      toast.error('File sharing is disabled in this room');
      return;
    }
    setUploading(true);
    try {
      const result = await db.integrations.Core.UploadFile({ file });
      let messageType = 'file';
      if (file.type.startsWith('image/')) messageType = 'image';
      else if (file.type.startsWith('video/')) messageType = 'video';
      else if (file.type.startsWith('audio/')) messageType = 'audio';

      await sendMessage(file.name, messageType, result.file_url, file.name, replyingTo, options);
    } catch {
      toast.error('Failed to upload file');
    }
    setUploading(false);
  };

  const handleVoiceMessage = async (file, duration = 0, options = {}) => {
    setUploading(true);
    try {
      const result = await db.integrations.Core.UploadFile({ file });
      await sendMessage(
        'Voice note',
        'audio',
        result.file_url,
        'voice_note.webm',
        replyingTo,
        { ...options, audioDuration: duration }
      );
    } catch {
      toast.error('Failed to send voice message');
    }
    setUploading(false);
  };

  // Typing
  const handleTyping = useCallback((text) => {
    const isTyping = text.length > 0;
    const entityId = participantEntityIdRef.current;
    if (!entityId) return;

    if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
    if (typingClearRef.current) clearTimeout(typingClearRef.current);

    if (!isTyping) {
      db.entities.RoomParticipant.update(entityId, { typing: false, typing_text: '' }).catch(() => {});
      return;
    }

    typingDebounceRef.current = setTimeout(() => {
      db.entities.RoomParticipant.update(entityId, { typing: true, typing_text: text }).catch(() => {});
    }, 300);

    typingClearRef.current = setTimeout(() => {
      db.entities.RoomParticipant.update(entityId, { typing: false, typing_text: '' }).catch(() => {});
    }, 4000);
  }, []);

  // Settings actions
  const updateRoomSettings = async (settings) => {
    if (!roomEntityIdRef.current) return;
    await db.entities.ChatRoom.update(roomEntityIdRef.current, settings);
  };

  const clearMessages = async () => {
    await db.entities.ChatMessage.deleteMany({ room_id: roomId });
    setMessages([]);
  };

  const endRoom = async () => {
    await db.entities.ChatMessage.deleteMany({ room_id: roomId });
    await db.entities.RoomParticipant.deleteMany({ room_id: roomId });
    await db.entities.ChatRoom.update(roomEntityIdRef.current, { status: 'ended' });
    navigate('/');
  };

  const handleLeave = () => navigate('/');

  // Message actions
  const handleReaction = async (message, emoji) => {
    const p = participantRef.current;
    if (!p) return;
    let reactions = {};
    try {
      reactions = typeof message.reactions === 'string' ? JSON.parse(message.reactions || '{}') : message.reactions || {};
    } catch {
      reactions = {};
    }
    const users = reactions[emoji] || [];
    if (users.includes(p.id)) {
      reactions[emoji] = users.filter((id) => id !== p.id);
      if (reactions[emoji].length === 0) delete reactions[emoji];
    } else {
      reactions[emoji] = [...users, p.id];
    }
    await db.entities.ChatMessage.update(message.id, { reactions: JSON.stringify(reactions) });
  };

  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success('Copied to clipboard');
      })
      .catch(() => {});
  };

  const handleDeleteMessage = async (messageId) => {
    await db.entities.ChatMessage.delete(messageId);
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  };

  const handleReply = (message) => {
    setReplyingTo({
      id: message.id,
      name: message.sender_name,
      content: message.content || message.file_name || 'File',
    });
  };

  const handleStar = async (message) => {
    await db.entities.ChatMessage.update(message.id, { starred: !message.starred });
    toast.success(message.starred ? 'Message unstarred' : 'Message starred ⭐');
  };

  const handleEdit = async (messageId, newContent) => {
    await db.entities.ChatMessage.update(messageId, { content: newContent, edited: true });
  };

  const handlePin = async (message) => {
    if (message.pinned) {
      await db.entities.ChatMessage.update(message.id, { pinned: false });
    } else {
      await db.entities.ChatMessage.update(message.id, { pinned: true });
      toast.success('Message pinned 📌');
    }
  };

  const handleVotePoll = async (messageId, updatedPoll) => {
    await db.entities.ChatMessage.update(messageId, {
      poll_data: JSON.stringify(updatedPoll),
    });
  };

  const handleForward = (message) => {
    navigator.clipboard.writeText(message.content || message.file_url || '');
    toast.success('Message copied to forward');
  };

  // Derived values
  const me = participantRef.current;
  const otherParticipant = participants.find((p) => p.participant_id !== me?.id || p.user_id !== me?.id);
  const myProfile = profileLoaded || getLocalProfile();
  const viewerLang = myProfile?.language || 'en';
  const autoTranslate = myProfile?.auto_translate !== false; // Every user sees received messages in their selected language by default
  const myParticipant = participants.find((p) => p.participant_id === me?.id || p.user_id === me?.id);
  const isOwner = myParticipant?.is_owner || false;
  const typingParticipants = participants.filter((p) => p.typing && (p.participant_id !== me?.id && p.user_id !== me?.id));
  const onlineCount = participants.filter((p) => p.online).length;
  const showTypingText = isOwner && room?.typing_preview_visible;
  const isWaiting = participants.length < 2 || room?.status === 'waiting';
  const pinnedMessages = messages.filter((m) => m.pinned);
  const starredMessages = messages.filter((m) => m.starred);
  const displayedMessages = searchQuery
    ? messages.filter((m) => m.content?.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  const currentTheme = CHAT_WALLPAPERS.find((w) => w.id === wallpaperId) || CHAT_WALLPAPERS[0];

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <BackgroundOrbs />
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-foreground/20 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm font-body">Opening conversation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <BackgroundOrbs />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 max-w-md text-center sketch-border rounded-3xl"
        >
          <h2 className="text-xl font-heading font-bold mb-2">Oops!</h2>
          <p className="text-muted-foreground text-sm font-body mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 rounded-xl sketch-fill font-heading font-bold shadow-lg text-primary-foreground"
          >
            Back to Messages
          </button>
        </motion.div>
      </div>
    );
  }

  const roomInfoProps = {
    room,
    roomId,
    participant: me,
    participants,
    isOwner,
    messages,
    starredCount: starredMessages.length,
    onShowStarred: () => setShowStarred(true),
    onLeave: handleLeave,
    onOpenSettings: () => setShowSettings(true),
  };

  return (
    <div className={`fixed inset-0 flex h-[100dvh] overflow-hidden ${isVanishMode ? 'bg-[#0a0a0c]' : ''}`}>
      {!isVanishMode && <BackgroundOrbs />}

      {/* Starred Messages */}
      {showStarred && (
        <StarredMessages messages={starredMessages} onClose={() => setShowStarred(false)} />
      )}

      {/* Settings Panel */}
      <SettingsPanel
        room={room}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onUpdate={updateRoomSettings}
        onClearMessages={clearMessages}
        onEndRoom={endRoom}
      />

      {/* Chat Wallpaper Switcher */}
      {showWallpaperModal && (
        <ChatWallpaperModal
          isOpen={showWallpaperModal}
          onClose={() => setShowWallpaperModal(false)}
          selectedId={wallpaperId}
          onSelect={handleSelectWallpaper}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden w-72 shrink-0 p-3 md:flex xl:w-80">
        <RoomInfo {...roomInfoProps} />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSidebar(false)}
              className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] z-50 p-3"
            >
              <RoomInfo {...roomInfoProps} onClose={() => setShowSidebar(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex min-w-0 flex-1 flex-col p-0 sm:p-2 md:p-3 lg:p-4">
        <div
          className={`glass-card relative flex flex-1 flex-col overflow-hidden rounded-none transition-all sm:rounded-2xl ${
            isVanishMode ? 'bg-[#121216]/95 ring-2 ring-purple-500/30' : ''
          }`}
          style={
            !isVanishMode && currentTheme.pattern
              ? {
                  backgroundImage: currentTheme.pattern,
                  backgroundSize: '24px 24px',
                }
              : {}
          }
        >
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-foreground/10 bg-card/75 px-3 py-2.5 backdrop-blur-sm sm:gap-3 sm:px-4 sm:py-3">
            <button
              onClick={() => setShowSidebar(true)}
              className="md:hidden p-2 rounded-xl hover:bg-card/40 transition-colors"
            >
              <Menu size={20} />
            </button>

            {/* Room Avatar & Status */}
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-2xl sketch-fill text-primary-foreground flex items-center justify-center shadow-md shrink-0">
                <span className="font-heading font-bold text-sm">
                  {(room?.room_name || 'W').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-heading font-bold text-sm truncate">
                  {room?.room_name || 'Whisper Room'}
                </p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-body">
                  <Users size={11} />
                  {participants.length} {participants.length === 1 ? 'member' : 'members'}
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/40 mx-0.5" />
                  <span className="text-green-500 font-medium">{onlineCount} online</span>
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-1">
              {/* Language / Translation Quick Switcher */}
              <button
                onClick={() => setShowLangModal(true)}
                className="flex shrink-0 items-center gap-1 rounded-lg border border-primary/15 bg-primary/10 px-2 py-1.5 text-xs font-bold text-primary transition-all hover:bg-primary/20 sm:gap-1.5 sm:rounded-xl sm:px-2.5"
                title={`Translating incoming messages to ${getLanguageInfo(viewerLang).label} (Click to change language)`}
              >
                <span className="text-sm leading-none">{getLanguageInfo(viewerLang).flag}</span>
                <span className="hidden font-heading text-[11px] uppercase tracking-wide sm:inline">
                  {viewerLang}
                </span>
              </button>

              {/* Vanish Mode Toggle (Instagram Direct) */}
              <button
                onClick={toggleVanishMode}
                className={`p-2.5 rounded-xl transition-colors shrink-0 sketch-border ${
                  isVanishMode ? 'bg-purple-600 text-white' : 'hover:bg-card/60 text-muted-foreground'
                }`}
                title={isVanishMode ? 'Vanish Mode Active' : 'Toggle Vanish Mode'}
              >
                <Ghost size={17} />
              </button>

              {/* Wallpaper Selector */}
              <button
                onClick={() => setShowWallpaperModal(true)}
                className="hidden shrink-0 rounded-xl border border-foreground/10 p-2.5 text-muted-foreground transition-colors hover:bg-card/60 sm:flex"
                title="Change Chat Paper Wallpaper"
              >
                <Palette size={17} />
              </button>

              {/* Search Toggle */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2.5 rounded-xl hover:bg-card/60 text-muted-foreground transition-colors shrink-0 sketch-border"
                title="Search messages"
              >
                <Search size={17} />
              </button>

              <button
                onClick={handleLeave}
                className="p-2.5 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors shrink-0 sketch-border"
                title="Leave room"
              >
                <LogOut size={17} />
              </button>
            </div>
          </div>

          {/* Vanish Mode Glowing Banner */}
          {isVanishMode && (
            <div className="px-4 py-1.5 bg-purple-500/15 border-b border-purple-500/30 flex items-center justify-between text-xs text-purple-300 font-body">
              <span className="flex items-center gap-1.5 font-heading font-bold">
                <Ghost size={14} className="animate-pulse" />
                Vanish Mode Active • Seen messages will disappear
              </span>
              <button onClick={toggleVanishMode} className="hover:underline text-[11px]">
                Turn off
              </button>
            </div>
          )}

          {/* Search bar */}
          <AnimatePresence>
            {showSearch && (
              <MessageSearch
                query={searchQuery}
                onQueryChange={setSearchQuery}
                onClose={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                }}
                resultCount={searchQuery ? displayedMessages.length : 0}
              />
            )}
          </AnimatePresence>

          {/* Pinned messages bar */}
          {pinnedMessages.length > 0 && (
            <PinnedMessages
              pinnedMessages={pinnedMessages}
              onUnpin={(id) => {
                const msg = messages.find((m) => m.id === id);
                if (msg) handlePin(msg);
              }}
            />
          )}

          {/* Messages Feed */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-3 py-3 scrollbar-thin sm:gap-3 sm:px-4 sm:py-4"
          >
            {messages.length === 0 ? (
              <EmptyChatState roomId={roomId} isWaiting={isWaiting} />
            ) : (
              <>
                {/* End-to-End Encryption Notice */}
                <div className="mx-auto my-2 px-4 py-2 rounded-2xl bg-card/40 sketch-border text-center max-w-sm text-[11px] text-muted-foreground font-body flex items-center gap-1.5 justify-center">
                  <Shield size={13} className="text-primary shrink-0" />
                  <span>Messages are end-to-end encrypted.</span>
                </div>

                {displayedMessages.map((msg, idx) => {
                  const isMine = msg.sender_id === me?.id;
                  const prevMsg = displayedMessages[idx - 1];
                  const showAvatar = !prevMsg || prevMsg.sender_id !== msg.sender_id;
                  const showDateSeparator =
                    !prevMsg ||
                    new Date(prevMsg.created_date || prevMsg.created_at).toDateString() !==
                      new Date(msg.created_date || msg.created_at).toDateString();

                  return (
                    <div key={msg.id || idx}>
                      {showDateSeparator && <DateSeparator date={msg.created_date || msg.created_at} />}
                      <MessageBubble
                        message={msg}
                        isMine={isMine}
                        showAvatar={showAvatar}
                        onReact={handleReaction}
                        onCopy={handleCopy}
                        onDelete={handleDeleteMessage}
                        onReply={handleReply}
                        onStar={handleStar}
                        onEdit={handleEdit}
                        onPin={handlePin}
                        onForward={handleForward}
                        onVotePoll={handleVotePoll}
                        isOwner={isOwner}
                        currentUserId={me?.id}
                        viewerLang={viewerLang}
                        autoTranslate={autoTranslate}
                      />
                    </div>
                  );
                })}

                <AnimatePresence>
                  {typingParticipants.map((tp) => (
                    <TypingIndicator
                      key={tp.id}
                      name={tp.name || tp.nickname}
                      color={tp.avatar_color}
                      avatarUrl={tp.avatar_url}
                      text={showTypingText ? tp.typing_text : ''}
                    />
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Scroll to bottom button */}
          <AnimatePresence>
            {showScrollButton && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={scrollToBottom}
                className="absolute bottom-20 right-6 p-3 rounded-full sketch-fill shadow-lg z-10 text-primary-foreground"
              >
                <ChevronDown size={20} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Input Bar */}
          <div className="border-t border-foreground/10 bg-card/45 p-2 backdrop-blur-sm sm:p-3">
            <ChatInput
              onSend={handleSend}
              onTyping={handleTyping}
              onFileUpload={handleFileUpload}
              onVoiceMessage={handleVoiceMessage}
              disabled={uploading}
              uploading={uploading}
              allowFiles={room?.allow_file_sharing ?? true}
              replyingTo={replyingTo}
              onReplyCancel={() => setReplyingTo(null)}
              isVanishMode={isVanishMode}
              selfDestructTimer={selfDestructTimer}
              onSetSelfDestructTimer={setSelfDestructTimer}
            />
          </div>
        </div>
      </div>

      {/* Quick Language Modal */}
      <LanguageSelectModal
        isOpen={showLangModal}
        onClose={() => setShowLangModal(false)}
        currentLang={viewerLang}
          onSelect={(code) => {
            const updatedProfile = getLocalProfile();
            setProfileLoaded(updatedProfile);
            if (updatedProfile?.auto_translate !== false && code) {
              const foreignTexts = messages
                .filter((m) => m.sender_id !== me?.id && m.content && m.content.trim())
                .map((m) => m.content);
              if (foreignTexts.length > 0) translateBatch(foreignTexts, code).catch(() => {});
            }
          }}
      />
    </div>
  );
}
