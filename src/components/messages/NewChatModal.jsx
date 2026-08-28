import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  X,
  User,
  Users,
  Link2,
  Plus,
  Search,
  Loader2,
  Check,
  Shield,
  Radio,
  Bookmark,
  Lock,
} from 'lucide-react';

import {
  generateRoomId,
  getLocalProfile,
  setLocalParticipant,
  sanitizeUsername,
} from '@/lib/chat-utils';
import { db } from '@/api/base44Client';

export default function NewChatModal({ onClose }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('direct'); // 'direct' | 'group' | 'secret' | 'join'
  const [username, setUsername] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState([]);
  const [memberInput, setMemberInput] = useState('');
  const [joinLink, setJoinLink] = useState('');
  const [busy, setBusy] = useState(false);
  const [createdRoomId, setCreatedRoomId] = useState(null);

  const me = getLocalProfile();

  const searchUser = async (value) => {
    const clean = sanitizeUsername(value);
    if (clean.length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const matches = await db.entities.Profile.filter({ username: clean });
      setResults(matches.filter((m) => m.profile_id !== me?.profile_id).slice(0, 6));
    } catch {
      setResults([]);
    }
    setSearching(false);
  };

  const startDirect = async (other, isSecret = false) => {
    if (!me) return;
    setBusy(true);
    try {
      const roomId = generateRoomId();
      await db.entities.ChatRoom.create({
        room_id: roomId,
        owner_id: me.profile_id,
        room_name: isSecret ? `🔒 Secret: @${other.username}` : `@${other.username}`,
        max_participants: 2,
        allow_file_sharing: true,
        allow_new_joins: false,
        typing_preview_visible: !isSecret,
        message_notifications: true,
        status: 'active',
        last_message_preview: isSecret ? '🔒 Secret encrypted chat' : '',
        last_message_at: '',
      });

      await db.entities.RoomParticipant.create({
        room_id: roomId,
        participant_id: me.profile_id,
        user_id: me.profile_id,
        name: me.display_name,
        nickname: me.display_name,
        avatar_color: me.avatar_color,
        avatar_url: me.avatar_url || '',
        online: true,
        typing: false,
        typing_text: '',
        is_owner: true,
      });

      await db.entities.RoomParticipant.create({
        room_id: roomId,
        participant_id: other.profile_id,
        user_id: other.profile_id,
        name: other.display_name,
        nickname: other.display_name,
        avatar_color: other.avatar_color,
        avatar_url: other.avatar_url || '',
        online: false,
        typing: false,
        typing_text: '',
        is_owner: false,
      });

      setLocalParticipant(roomId, {
        id: me.profile_id,
        name: me.display_name,
        color: me.avatar_color,
        avatar_url: me.avatar_url,
        username: me.username,
      });

      await db.entities.Notification.create({
        recipient_id: other.profile_id,
        actor_id: me.profile_id,
        actor_name: me.username,
        actor_avatar_color: me.avatar_color,
        actor_avatar_url: me.avatar_url || '',
        type: 'message',
        text: isSecret
          ? 'invited you to an end-to-end secret chat.'
          : 'started a conversation with you.',
        target_id: roomId,
      }).catch(() => {});

      toast.success(isSecret ? '🔒 Secret Chat initiated' : 'Conversation started');
      navigate(`/chat/${roomId}`);
    } catch {
      toast.error('Failed to start chat');
    }
    setBusy(false);
  };

  const addMember = async () => {
    const u = sanitizeUsername(memberInput);
    if (!u) return;
    if (members.find((m) => m.username === u)) {
      toast.error('Already added');
      return;
    }
    try {
      const matches = await db.entities.Profile.filter({ username: u });
      const found = matches.find((m) => m.profile_id !== me?.profile_id);
      if (!found) {
        toast.error('User not found');
        return;
      }
      setMembers((prev) => [...prev, found]);
      setMemberInput('');
    } catch {
      toast.error('Search failed');
    }
  };

  const createGroup = async () => {
    if (!me) return;
    setBusy(true);
    try {
      const roomId = generateRoomId();
      await db.entities.ChatRoom.create({
        room_id: roomId,
        owner_id: me.profile_id,
        room_name: groupName.trim() || 'Sketchbook Group',
        max_participants: 50,
        allow_file_sharing: true,
        allow_new_joins: true,
        typing_preview_visible: true,
        message_notifications: true,
        status: 'active',
        last_message_preview: '',
        last_message_at: '',
      });

      await db.entities.RoomParticipant.create({
        room_id: roomId,
        participant_id: me.profile_id,
        user_id: me.profile_id,
        name: me.display_name,
        nickname: me.display_name,
        avatar_color: me.avatar_color,
        avatar_url: me.avatar_url || '',
        online: true,
        typing: false,
        typing_text: '',
        is_owner: true,
      });

      await Promise.all(
        members.map((m) =>
          db.entities.RoomParticipant.create({
            room_id: roomId,
            participant_id: m.profile_id,
            user_id: m.profile_id,
            name: m.display_name,
            nickname: m.display_name,
            avatar_color: m.avatar_color,
            avatar_url: m.avatar_url || '',
            online: false,
            typing: false,
            typing_text: '',
            is_owner: false,
          })
        )
      );

      setLocalParticipant(roomId, {
        id: me.profile_id,
        name: me.display_name,
        color: me.avatar_color,
        avatar_url: me.avatar_url,
        username: me.username,
      });

      setCreatedRoomId(roomId);
    } catch {
      toast.error('Failed to create group');
    }
    setBusy(false);
  };

  const joinRoom = () => {
    let id = joinLink.trim();
    if (!id) return;
    if (id.includes('/chat/')) id = id.split('/chat/')[1].split(/[/?#]/)[0];
    if (id) {
      if (me) {
        setLocalParticipant(id, {
          id: me.profile_id,
          name: me.display_name,
          color: me.avatar_color,
          avatar_url: me.avatar_url,
          username: me.username,
        });
      }
      navigate(`/chat/${id}`);
    }
  };

  const groupLink = createdRoomId ? `${window.location.origin}/chat/${createdRoomId}` : '';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(groupLink);
      toast.success('Link copied');
    } catch {
      toast.error('Could not copy');
    }
  };

  const tabs = [
    ['direct', 'Direct', User],
    ['group', 'Group', Users],
    ['secret', 'Secret Chat', Shield],
    ['join', 'Join', Link2],
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.92, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card w-full max-w-md p-5 max-h-[85vh] overflow-y-auto scrollbar-thin rounded-3xl sketch-border bg-card/95"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-bold">Start Conversation</h2>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-card/40 sketch-border">
              <X size={18} />
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => {
                onClose();
                navigate(`/chat/saved_${me?.profile_id || 'me'}`);
              }}
              className="p-2.5 rounded-2xl bg-amber-500/15 sketch-border flex items-center gap-2 hover:bg-amber-500/25 transition-all text-left"
            >
              <Bookmark size={16} className="text-amber-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-heading font-bold text-foreground">Saved Notes</p>
                <p className="text-[10px] text-muted-foreground font-body">Personal vault</p>
              </div>
            </button>

            <button
              onClick={() => {
                onClose();
                navigate('/channels');
              }}
              className="p-2.5 rounded-2xl bg-blue-500/15 sketch-border flex items-center gap-2 hover:bg-blue-500/25 transition-all text-left"
            >
              <Radio size={16} className="text-blue-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-heading font-bold text-foreground">Public Channels</p>
                <p className="text-[10px] text-muted-foreground font-body">Broadcasts & art</p>
              </div>
            </button>
          </div>

          <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
            {tabs.map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => {
                  setTab(key);
                  setCreatedRoomId(null);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-2xl text-xs font-heading font-bold transition-all whitespace-nowrap ${
                  tab === key ? 'sketch-fill text-primary-foreground' : 'sketch-border bg-card/30'
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {/* Direct or Secret Search */}
          {(tab === 'direct' || tab === 'secret') && (
            <div>
              {tab === 'secret' && (
                <div className="mb-3 p-3 rounded-2xl bg-purple-500/15 sketch-border text-xs text-purple-300 font-body space-y-1">
                  <div className="flex items-center gap-1.5 font-heading font-bold text-purple-200">
                    <Lock size={14} /> Telegram-Style Secret Chat
                  </div>
                  <p className="text-[11px] text-purple-300/80">
                    End-to-end encrypted, no typing previews, and messages disappear with self-destruct timers.
                  </p>
                </div>
              )}

              <p className="text-xs text-muted-foreground font-body mb-2">Search contact by @username</p>
              <div className="flex items-center gap-2 px-3 py-2 sketch-border rounded-xl bg-card/30 mb-3">
                <Search size={16} className="text-muted-foreground" />
                <input
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    searchUser(e.target.value);
                  }}
                  placeholder="e.g. artist_mia"
                  className="flex-1 bg-transparent outline-none text-xs font-body lowercase"
                />
              </div>

              {searching && <p className="text-xs text-muted-foreground text-center py-2">Searching…</p>}

              <div className="space-y-1.5 max-h-52 overflow-y-auto">
                {results.map((r) => (
                  <button
                    key={r.profile_id}
                    onClick={() => startDirect(r, tab === 'secret')}
                    disabled={busy}
                    className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-card/40 sketch-border transition-colors text-left"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold shrink-0"
                      style={{ background: r.avatar_color || '#3b82f6' }}
                    >
                      {(r.display_name || '?').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-heading font-bold truncate">{r.display_name}</p>
                      <p className="text-[11px] text-muted-foreground font-mono truncate">@{r.username}</p>
                    </div>
                    <span className="text-[11px] font-heading font-bold px-2.5 py-1 rounded-xl sketch-fill text-primary-foreground">
                      Chat
                    </span>
                  </button>
                ))}
                {!searching && username && results.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-3 font-body">No users found</p>
                )}
              </div>
            </div>
          )}

          {/* Group Chat Creator */}
          {tab === 'group' && (
            createdRoomId ? (
              <div className="text-center py-2">
                <div className="w-14 h-14 rounded-full sketch-fill mx-auto flex items-center justify-center mb-3 text-primary-foreground">
                  <Check size={28} />
                </div>
                <p className="text-sm font-heading font-bold mb-1">Group created!</p>
                <p className="text-xs text-muted-foreground font-body mb-4">
                  Share this invitation link — anyone who opens it can join and sketch with you.
                </p>
                <div className="flex items-center gap-2 px-3 py-2 sketch-border rounded-xl bg-card/30 mb-3">
                  <Link2 size={14} className="text-muted-foreground shrink-0" />
                  <input
                    readOnly
                    value={groupLink}
                    onClick={(e) => e.target.select()}
                    className="flex-1 bg-transparent outline-none text-xs font-mono truncate"
                  />
                  <button onClick={copyLink} className="text-xs font-heading font-bold text-primary shrink-0">
                    Copy
                  </button>
                </div>
                <button
                  onClick={() => navigate(`/chat/${createdRoomId}`)}
                  className="w-full py-2.5 sketch-fill rounded-xl text-xs font-heading font-bold text-primary-foreground"
                >
                  Open Chat
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground font-body mb-1 block">Group Name</label>
                  <input
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g. Inky Artists Guild"
                    maxLength={30}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs font-body sketch-border"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-body mb-1 block">
                    Add Members by @username
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={memberInput}
                      onChange={(e) => setMemberInput(e.target.value.toLowerCase())}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addMember();
                        }
                      }}
                      placeholder="username"
                      className="flex-1 px-3 py-2 rounded-xl glass-input text-xs font-body lowercase sketch-border"
                    />
                    <button onClick={addMember} className="px-3.5 sketch-fill rounded-xl text-primary-foreground">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                {members.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {members.map((m) => (
                      <span
                        key={m.profile_id}
                        className="flex items-center gap-1 px-2.5 py-1 sketch-border rounded-full text-xs font-mono"
                      >
                        @{m.username}
                        <button
                          onClick={() => setMembers((prev) => prev.filter((x) => x.profile_id !== m.profile_id))}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <button
                  onClick={createGroup}
                  disabled={busy}
                  className="w-full py-2.5 sketch-fill font-heading font-bold text-xs text-primary-foreground disabled:opacity-40 flex items-center justify-center gap-2 rounded-2xl shadow-md"
                >
                  {busy ? <Loader2 size={16} className="animate-spin" /> : null}
                  Create Group Chat
                </button>
              </div>
            )
          )}

          {/* Join Chat Link */}
          {tab === 'join' && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground font-body">
                Paste a room link or ID to join an existing conversation.
              </p>
              <input
                value={joinLink}
                onChange={(e) => setJoinLink(e.target.value)}
                placeholder="Paste room link or code"
                className="w-full px-3 py-2 rounded-xl glass-input text-xs font-body sketch-border"
              />
              <button
                onClick={joinRoom}
                disabled={!joinLink.trim()}
                className="w-full py-2.5 sketch-fill font-heading font-bold text-xs text-primary-foreground rounded-2xl disabled:opacity-40"
              >
                Join Chat
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
