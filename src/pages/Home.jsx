import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shield, Zap, Lock, Settings, Users, ChevronDown, Pencil } from 'lucide-react';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import ThemeToggle from '@/components/ThemeToggle';
import { Image } from '@/components/ui/image';
import SavedRooms from '@/components/SavedRooms';
import Avatar from '@/components/Avatar';
import {
  generateRoomId,
  generateParticipantId,
  generateNickname,
  generateAvatarColor,
  ensureProfile,
  getLocalProfile,
  updateProfile,
  setLocalParticipant,
  setRoomSettings,
} from '@/lib/chat-utils';

const MAX_OPTIONS = [2, 5, 10, 25, 50];

const HERO_IMG = 'https://media.db.com/images/public/6a52400c850310aa9301674e/bc69eca05_generated_image.png';
const LEANING_IMG = 'https://media.db.com/images/public/6a52400c850310aa9301674e/4d047077c_generated_image.png';
const PEEKING_IMG = 'https://media.db.com/images/public/6a52400c850310aa9301674e/5f00e1c71_generated_image.png';

export default function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [joinLink, setJoinLink] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(2);
  const [allowFileSharing, setAllowFileSharing] = useState(true);
  const [typingPreview, setTypingPreview] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    ensureProfile()
      .then((p) => {
        setProfile(p);
        if (p?.display_name) setName((cur) => cur || p.display_name);
      })
      .catch(() => setProfile(getLocalProfile()));
  }, []);

  const initParticipant = (roomId) => {
    const p = getLocalProfile();
    const participant = {
      id: p?.profile_id || generateParticipantId(),
      name: name.trim() || p?.display_name || generateNickname(),
      color: p?.avatar_color || generateAvatarColor(),
      avatar_url: p?.avatar_url || '',
      username: p?.username || '',
    };
    setLocalParticipant(roomId, participant);
    if (name.trim() && name.trim() !== p?.display_name) {
      updateProfile({ display_name: name.trim() }).catch(() => {});
    }
    return participant;
  };

  const createRoom = () => {
    const roomId = generateRoomId();
    const participant = initParticipant(roomId);
    setRoomSettings(roomId, {
      owner_id: participant.id,
      room_name: roomName.trim(),
      max_participants: maxParticipants,
      allow_file_sharing: allowFileSharing,
      allow_new_joins: true,
      typing_preview_visible: typingPreview,
      message_notifications: true,
    });
    navigate(`/chat/${roomId}`);
  };

  const joinRoom = (e) => {
    e.preventDefault();
    let id = joinLink.trim();
    if (!id) return;
    if (id.includes('/chat/')) {
      id = id.split('/chat/')[1].split(/[/?#]/)[0];
    }
    if (id) {
      initParticipant(id);
      navigate(`/chat/${id}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8 relative">
      <BackgroundOrbs />
      <ThemeToggle />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass-card p-6 md:p-10 w-full max-w-lg"
      >
        {/* Title */}
        <div className="text-center mb-6">
          <svg width="48" height="44" viewBox="0 0 48 44" fill="none" className="mx-auto mb-2">
            <path
              d="M14 30 C7 30 3 26 3 20 C3 13 8 9 14 9 C15 4 20 2 26 2 C33 2 38 6 39 11 C44 11 47 15 47 20 C47 25 43 29 38 29 L16 29 Z"
              fill="hsl(var(--primary))"
              stroke="hsl(var(--foreground))"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <circle cx="18" cy="38" r="3.5" fill="hsl(var(--primary))" stroke="hsl(var(--foreground))" strokeWidth="2"/>
            <circle cx="11" cy="42" r="2" fill="hsl(var(--primary))" stroke="hsl(var(--foreground))" strokeWidth="1.5"/>
          </svg>
          <h1 className="text-4xl font-heading font-bold text-primary tracking-tight">Whisper</h1>
        </div>

        {/* Hero illustration with speech bubble */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3 mb-8">
          <div className="relative max-w-[220px]">
            <div className="sketch-border bg-card/50 px-4 py-3 rounded-2xl">
              <p className="text-sm font-body leading-relaxed text-foreground">
                Anonymous, instant, real-time chat. No signup required.
              </p>
            </div>
            <svg
              className="absolute top-1/2 -translate-y-1/2 -right-2"
              width="14"
              height="16"
              viewBox="0 0 14 16"
              fill="none"
            >
              <path
                d="M0 0 L14 8 L0 16 Z"
                fill="hsl(var(--card))"
                stroke="hsl(var(--foreground))"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="w-28 md:w-40 shrink-0">
            <Image
              src={HERO_IMG}
              alt="Person chatting on phone"
              fittingType="fit"
              className="w-full"
            />
          </div>
        </div>

        {/* Profile identity */}
        {profile && (
          <Link
            to="/profile"
            className="flex items-center gap-3 p-3 mb-4 sketch-border rounded-xl bg-card/40 hover:bg-card/60 transition-colors group"
          >
            <Avatar
              name={profile.display_name}
              color={profile.avatar_color}
              avatarUrl={profile.avatar_url}
              size={42}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body font-medium truncate">
                {profile.display_name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                @{profile.username}
              </p>
            </div>
            <Pencil
              size={16}
              className="text-muted-foreground group-hover:text-primary transition-colors shrink-0"
            />
          </Link>
        )}

        {/* Name input */}
        <div className="mb-4">
          <label className="text-xs text-muted-foreground mb-1.5 block font-body">
            Display name <span className="opacity-50">(optional)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="BlueFox"
            maxLength={20}
            className="w-full px-2 py-2.5 glass-input text-sm font-body placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Room Options */}
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="w-full flex items-center justify-between px-4 py-2.5 sketch-border rounded-xl bg-card/40 hover:bg-card/60 transition-colors text-sm font-body mb-3"
        >
          <span className="flex items-center gap-2">
            <Settings size={16} /> Room Options
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform ${showOptions ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mb-4"
            >
              <div className="space-y-4 p-4 sketch-dashed">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block font-body">
                    Room name <span className="opacity-50">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="My Secret Room"
                    maxLength={30}
                    className="w-full px-3 py-2 glass-input text-sm font-body"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block font-body flex items-center gap-1.5">
                    <Users size={12} /> Max participants
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {MAX_OPTIONS.map((n) => (
                      <button
                        key={n}
                        onClick={() => setMaxParticipants(n)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-body transition-colors ${
                          maxParticipants === n
                            ? 'sketch-fill'
                            : 'sketch-border bg-card/30 hover:bg-card/50'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <ToggleRow label="Allow file sharing" value={allowFileSharing} onChange={setAllowFileSharing} />
                <ToggleRow label="Show typing preview" desc="Others can see what you type" value={typingPreview} onChange={setTypingPreview} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Room section with leaning character */}
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            onClick={createRoom}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 sketch-fill text-base font-heading font-bold"
          >
            Create New Room <ArrowRight size={20} />
          </motion.button>
          <div className="w-20 md:w-24 shrink-0 hidden sm:block">
            <Image src={LEANING_IMG} alt="Leaning character" fittingType="fit" className="w-full" />
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-0 border-t-2 border-dashed border-foreground/30" />
          <span className="text-xs text-muted-foreground font-body">or join existing</span>
          <div className="flex-1 h-0 border-t-2 border-dashed border-foreground/30" />
        </div>

        {/* Join section */}
        <div className="flex items-end gap-2 mb-6">
          <div className="w-14 shrink-0 hidden sm:block">
            <Image src={PEEKING_IMG} alt="Peeking character" fittingType="fit" className="w-full" />
          </div>
          <form onSubmit={joinRoom} className="flex-1 flex gap-2">
            <input
              type="text"
              value={joinLink}
              onChange={(e) => setJoinLink(e.target.value)}
              placeholder="Paste room link or ID"
              className="flex-1 px-3 py-2.5 sketch-border rounded-xl bg-card/30 text-sm font-body placeholder:text-muted-foreground/50 focus:bg-card/50 transition-colors"
            />
            <button
              type="submit"
              disabled={!joinLink.trim()}
              className="px-5 py-2.5 sketch-fill rounded-xl text-sm font-heading font-bold disabled:opacity-40"
            >
              Join
            </button>
          </form>
        </div>

        {/* Saved Rooms */}
        <SavedRooms onJoin={(id) => { initParticipant(id); navigate(`/chat/${id}`); }} />

        {/* Footer */}
        <div className="pt-6 border-t-2 border-dashed border-foreground/20 grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <Shield size={18} className="text-foreground/70" />
            <p className="text-[11px] text-muted-foreground font-body">No signup</p>
          </div>
          <div className="flex flex-col items-center gap-1.5 border-x-2 border-dashed border-foreground/20">
            <Zap size={18} className="text-foreground/70" />
            <p className="text-[11px] text-muted-foreground font-body">Real-time</p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Lock size={18} className="text-foreground/70" />
            <p className="text-[11px] text-muted-foreground font-body">Anonymous</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-body">{label}</p>
        {desc && <p className="text-xs text-muted-foreground font-body">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 border-2 ${
          value ? 'bg-primary border-primary' : 'bg-transparent border-foreground'
        }`}
      >
        <motion.div
          animate={{ x: value ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={`absolute top-0.5 w-4 h-4 rounded-full shadow-md ${value ? 'bg-primary-foreground' : 'bg-foreground'}`}
        />
      </button>
    </div>
  );
}