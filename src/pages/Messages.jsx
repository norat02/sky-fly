import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Edit,
  Settings as SettingsIcon,
  Search,
  MessageCircle,
  Bookmark,
  Plus,
} from 'lucide-react';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import Avatar from '@/components/Avatar';
import ConversationItem from '@/components/messages/ConversationItem';
import NewChatModal from '@/components/messages/NewChatModal';
import StoriesTray from '@/components/stories/StoriesTray';
import { ensureProfile, getLocalProfile } from '@/lib/chat-utils';
import { db } from '@/api/base44Client';

export default function Messages() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [convos, setConvos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'direct' | 'groups' | 'unread'

  const load = useCallback(async () => {
    const me = getLocalProfile();
    if (!me) return;
    try {
      const myParts = await db.entities.RoomParticipant.filter({ participant_id: me.profile_id });
      const built = await Promise.all(
        myParts.map(async (mp) => {
          const [rooms, participants] = await Promise.all([
            db.entities.ChatRoom.filter({ room_id: mp.room_id }),
            db.entities.RoomParticipant.filter({ room_id: mp.room_id }),
          ]);
          const room = rooms[0];
          if (!room || room.status === 'ended') return null;
          const others = participants.filter((p) => p.participant_id !== me.profile_id);
          const isGroup = participants.length > 2 || (room.max_participants || 2) > 2;
          let display;
          if (isGroup) {
            display = { name: room.room_name || 'Group chat', isGroup: true, count: participants.length };
          } else {
            const other = others[0] || {};
            display = {
              name: other.name || 'Anonymous',
              color: other.avatar_color,
              avatar_url: other.avatar_url,
              isGroup: false,
            };
          }
          return { room, display };
        })
      );
      const valid = built
        .filter(Boolean)
        .sort((a, b) => (b.room.last_message_at || '').localeCompare(a.room.last_message_at || ''));
      setConvos(valid);
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    ensureProfile()
      .then((p) => {
        setProfile(p);
        load();
      })
      .catch(() => setLoading(false));
  }, [load]);

  useEffect(() => {
    if (!profile) return;
    const unsubRoom = db.entities.ChatRoom.subscribe((event) => {
      const data = event.data;
      if (!data || !data.room_id) return;
      if (event.type === 'create') {
        load();
      } else if (event.type === 'update') {
        setConvos((prev) => {
          if (!prev.find((c) => c.room.room_id === data.room_id)) {
            load();
            return prev;
          }
          return prev
            .map((c) => (c.room.room_id === data.room_id ? { ...c, room: data } : c))
            .sort((a, b) => (b.room.last_message_at || '').localeCompare(a.room.last_message_at || ''));
        });
      }
    });
    const unsubPart = db.entities.RoomParticipant.subscribe((event) => {
      if (event.data && event.data.participant_id === profile.profile_id) load();
    });
    return () => {
      unsubRoom();
      unsubPart();
    };
  }, [profile, load]);

  // Open Telegram-style "Saved Messages" personal cloud vault
  const openSavedMessages = () => {
    const savedRoomId = `saved_${profile?.profile_id || 'me'}`;
    navigate(`/chat/${savedRoomId}`);
  };

  // Filter conversations
  const filtered = convos.filter((c) => {
    const matchesQuery = c.display.name.toLowerCase().includes(query.toLowerCase());
    if (!matchesQuery) return false;

    if (activeTab === 'direct') return !c.display.isGroup;
    if (activeTab === 'groups') return c.display.isGroup;
    if (activeTab === 'unread') return c.room.last_message_preview && !c.room.last_message_seen;
    return true;
  });

  return (
    <div className="page-shell relative">
      <BackgroundOrbs />
      <div className="page-container max-w-6xl">
        {/* Top Header */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <button onClick={() => navigate('/profile')} className="group flex shrink-0 items-center gap-2.5 rounded-2xl p-1.5 -ml-1.5 hover:bg-card/60">
            <Avatar
              name={profile?.display_name}
              color={profile?.avatar_color}
              avatarUrl={profile?.avatar_url}
              size={42}
            />
            <div className="text-left hidden sm:block">
              <p className="text-sm font-heading font-bold leading-tight">{profile?.display_name}</p>
              <p className="text-xs text-muted-foreground font-body leading-tight">@{profile?.username}</p>
            </div>
          </button>

          <div className="mr-auto min-w-0"><p className="eyebrow mb-0.5">Your inbox</p><h1 className="truncate text-xl font-heading font-bold tracking-tight sm:text-2xl">Good to see you</h1></div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowNew(true)}
              className="sketch-fill rounded-xl p-2.5 text-primary-foreground shadow-sm hover:-translate-y-0.5"
              title="New Chat"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="rounded-xl border border-foreground/10 p-2.5 text-foreground hover:bg-card/60"
              title="Settings"
            >
              <SettingsIcon size={18} />
            </button>
          </div>
        </div>

        {/* Stories / Status Tray */}
        <StoriesTray />

        {/* Telegram Saved Messages Cloud Vault Banner */}
        <div
          onClick={openSavedMessages}
          className="group mb-5 flex cursor-pointer items-center justify-between rounded-2xl border border-accent/15 bg-accent/[0.06] p-3.5 transition-all hover:-translate-y-0.5 hover:bg-accent/[0.1] sm:p-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent transition-transform group-hover:scale-105">
              <Bookmark size={20} className="fill-current" />
            </div>
            <div>
              <p className="text-sm font-heading font-bold text-foreground">Saved Messages</p>
              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                Your private cloud notebook for drafts, media, and voice notes
              </p>
            </div>
          </div>
          <span className="hidden rounded-full bg-card/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground sm:block">
            Vault
          </span>
        </div>

        {/* Search Bar */}
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-foreground/10 bg-card/65 px-3.5 py-3 shadow-sm">
          <Search size={16} className="text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats, contacts, and groups..."
            className="flex-1 bg-transparent outline-none text-xs font-body placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Filter Tabs (Telegram & WhatsApp Style) */}
        <div className="mb-5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Chats' },
            { id: 'direct', label: 'Direct' },
            { id: 'groups', label: 'Groups' },
            { id: 'unread', label: 'Unread' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-heading font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-foreground/10 bg-card/50 text-muted-foreground hover:border-foreground/20 hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chat List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-foreground/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center sm:p-12">
            <MessageCircle size={40} className="text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="text-base font-heading font-bold">No chats found</h3>
            <p className="text-xs text-muted-foreground font-body mt-1 max-w-sm mx-auto mb-4">
              Start a direct conversation, secret ephemeral chat, or group sketchbook with friends!
            </p>
            <button
              onClick={() => setShowNew(true)}
              className="px-5 py-2.5 sketch-fill text-primary-foreground text-xs font-heading font-bold rounded-2xl inline-flex items-center gap-1.5 shadow-md"
            >
              <Plus size={14} /> Start New Chat
            </button>
          </div>
        ) : (
          <motion.div layout className="glass-card overflow-hidden rounded-2xl divide-y divide-foreground/[0.08]">
            {filtered.map((c) => (
              <ConversationItem key={c.room.room_id} convo={c} myName={profile?.display_name} />
            ))}
          </motion.div>
        )}
      </div>

      {showNew && <NewChatModal onClose={() => setShowNew(false)} />}
    </div>
  );
}
