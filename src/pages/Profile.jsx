import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Settings as SettingsIcon,
  MessageCircle,
  Camera,
  Bookmark,
  Sparkles,
  Phone,
  Share2,
  Edit2,
  Check,
} from 'lucide-react';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import Avatar from '@/components/Avatar';
import {
  ensureProfile,
  generateRoomId,
  updateProfile,
} from '@/lib/chat-utils';
import { db } from '@/api/base44Client';
import { LANGUAGES, languageLabel } from '@/lib/languages';

const COLOR_OPTIONS = [
  '#3b82f6',
  '#ec4899',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ef4444',
  '#06b6d4',
  '#84cc16',
  '#d97706',
  '#6366f1',
];

export default function Profile() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Edit fields
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editColor, setEditColor] = useState('#3b82f6');
  const [editLang, setEditLang] = useState('en');
  const [editAutoTranslate, setEditAutoTranslate] = useState(true);

  const isOwn = !profileId || (me && (profileId === me.id || profileId === me.profile_id));

  const loadProfileData = useCallback(async () => {
    try {
      const local = await ensureProfile();
      setMe(local);
      const id = profileId || local?.id || local?.profile_id;

      let t = await db.entities.Profile.get(id);
      if (!t) {
        const matches = await db.entities.Profile.filter({ id });
        t = matches[0] || local;
      }
      setTarget(t);

      if (t) {
        setEditName(t.display_name || t.username || '');
        setEditBio(t.bio || '');
        setEditColor(t.avatar_color || '#3b82f6');
        setEditLang(t.language || 'en');
        setEditAutoTranslate(t.auto_translate ?? true);
      }
    } catch (err) {
      console.warn('Profile load error:', err);
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const handleSaveProfile = async () => {
    try {
      const updated = {
        display_name: editName.trim() || target.username,
        bio: editBio.trim(),
        avatar_color: editColor,
        language: editLang,
        auto_translate: editAutoTranslate,
      };
      await updateProfile(updated);
      setTarget((prev) => ({ ...prev, ...updated }));
      setIsEditing(false);
      toast.success('Messenger profile saved');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleStartDirectChat = async () => {
    const myId = me?.id || me?.profile_id;
    const targetId = target?.id || target?.profile_id;
    if (!myId || !targetId) return;

    try {
      const roomId = generateRoomId();
      await db.entities.ChatRoom.create({
        room_id: roomId,
        owner_id: myId,
        room_name: `@${target.username}`,
        is_group: false,
        status: 'active',
      });

      await db.entities.RoomParticipant.create({
        room_id: roomId,
        user_id: myId,
        participant_id: myId,
        name: me.display_name,
        nickname: me.display_name,
        avatar_color: me.avatar_color,
        avatar_url: me.avatar_url || '',
        online: true,
      });

      await db.entities.RoomParticipant.create({
        room_id: roomId,
        user_id: targetId,
        participant_id: targetId,
        name: target.display_name,
        nickname: target.display_name,
        avatar_color: target.avatar_color,
        avatar_url: target.avatar_url || '',
        online: false,
      });

      navigate(`/chat/${roomId}`);
    } catch {
      toast.error('Failed to open chat');
    }
  };

  const handleShareProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Profile contact link copied!');
    }
  };

  if (loading || !target) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundOrbs />
        <div className="w-8 h-8 border-4 border-foreground/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-shell relative">
      <BackgroundOrbs />
      <div className="page-container max-w-6xl">
        {/* Top Header */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-xl font-heading font-bold">
            {isOwn ? 'My Profile' : `@${target.username}`}
          </h1>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShareProfile}
              className="rounded-xl border border-foreground/10 p-2.5 text-foreground hover:bg-card/60"
              title="Share Contact"
            >
              <Share2 size={17} />
            </button>
            {isOwn && (
              <button
                onClick={() => navigate('/settings')}
                className="rounded-xl border border-foreground/10 p-2.5 text-foreground hover:bg-card/60"
                title="Settings"
              >
                <SettingsIcon size={17} />
              </button>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="glass-card mb-6 rounded-2xl p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative">
              <div className="p-1 rounded-full bg-gradient-to-tr from-primary to-amber-500">
                <Avatar
                  name={target.display_name || target.username}
                  color={isEditing ? editColor : target.avatar_color}
                  avatarUrl={target.avatar_url}
                  size={84}
                />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              <h2 className="text-lg font-heading font-bold truncate">
                {target.display_name || target.username}
              </h2>
              <p className="text-xs text-muted-foreground font-mono mb-2">@{target.username}</p>

              {target.bio ? (
                <p className="text-xs text-foreground/90 font-body leading-relaxed whitespace-pre-wrap">
                  {target.bio}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground italic font-body">No bio written yet</p>
              )}

              {/* Status Badge */}
              <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-heading font-bold text-green-500 px-2.5 py-0.5 rounded-full bg-green-500/10 sketch-border">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online on Whisper
                </span>
                <span className="text-[11px] text-muted-foreground font-body">
                  🌐 {languageLabel(target.language || 'en')}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-5 pt-4 border-t border-foreground/10 flex gap-2">
            {isOwn ? (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex-1 py-2.5 sketch-fill text-primary-foreground rounded-2xl text-xs font-heading font-bold flex items-center justify-center gap-1.5 shadow-md"
              >
                <Edit2 size={15} /> {isEditing ? 'Close Editor' : 'Edit Profile & Avatar'}
              </button>
            ) : (
              <button
                onClick={handleStartDirectChat}
                className="flex-1 py-2.5 sketch-fill text-primary-foreground rounded-2xl text-xs font-heading font-bold flex items-center justify-center gap-1.5 shadow-md"
              >
                <MessageCircle size={16} /> Send Direct Message
              </button>
            )}
          </div>
        </div>

        {/* Profile Editor Modal / Inline */}
        {isEditing && isOwn && (
          <div className="glass-card mb-6 space-y-4 rounded-2xl p-5">
            <h3 className="text-sm font-heading font-bold flex items-center gap-2">
              <Camera size={16} className="text-primary" /> Edit Sketch Profile
            </h3>

            {/* Display Name */}
            <div>
              <label className="text-xs text-muted-foreground font-body block mb-1">Display Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-body bg-card/40 sketch-border"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="text-xs text-muted-foreground font-body block mb-1">Bio</label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={2}
                placeholder="A bit about yourself..."
                className="w-full px-3 py-2 rounded-xl glass-input text-xs font-body bg-card/40 sketch-border resize-none"
              />
            </div>

            {/* Avatar Color Picker */}
            <div>
              <label className="text-xs text-muted-foreground font-body block mb-1.5">Avatar Ink Color</label>
              <div className="flex gap-2 flex-wrap">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setEditColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      editColor === c ? 'scale-125 ring-2 ring-foreground' : 'hover:scale-110'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Preferred Language */}
            <div>
              <label className="text-xs text-muted-foreground font-body block mb-1">
                Preferred Chat Language
              </label>
              <select
                value={editLang}
                onChange={(e) => setEditLang(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-body bg-card/40 sketch-border"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-xs font-heading font-bold hover:bg-card/40 sketch-border"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-5 py-2 rounded-xl sketch-fill text-xs font-heading font-bold text-primary-foreground flex items-center gap-1.5"
              >
                <Check size={14} /> Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Messenger Features Menu */}
        <div className="glass-card overflow-hidden rounded-2xl divide-y divide-foreground/[0.08]">
          <div
            onClick={() => navigate(`/chat/saved_${target?.profile_id || target?.id}`)}
            className="p-4 flex items-center justify-between hover:bg-card/40 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-500 sketch-border">
                <Bookmark size={18} />
              </div>
              <div>
                <p className="text-xs font-heading font-bold">Saved Messages & Media Vault</p>
                <p className="text-[11px] text-muted-foreground font-body">
                  Personal cloud storage for sketches, voice notes & files
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-muted-foreground font-bold">Open</span>
          </div>

          <div
            onClick={() => navigate('/calls')}
            className="p-4 flex items-center justify-between hover:bg-card/40 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-green-500/15 text-green-500 sketch-border">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs font-heading font-bold">Calls & Voice Chat Log</p>
                <p className="text-[11px] text-muted-foreground font-body">
                  Recent voice and video call records
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-muted-foreground font-bold">View</span>
          </div>

          <div
            onClick={() => navigate('/channels')}
            className="p-4 flex items-center justify-between hover:bg-card/40 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-500/15 text-blue-500 sketch-border">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-xs font-heading font-bold">Broadcast Channels</p>
                <p className="text-[11px] text-muted-foreground font-body">
                  Public channels, sketches, and art communities
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-muted-foreground font-bold">Browse</span>
          </div>

          <div
            onClick={() => navigate('/settings')}
            className="p-4 flex items-center justify-between hover:bg-card/40 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-500/15 text-purple-500 sketch-border">
                <SettingsIcon size={18} />
              </div>
              <div>
                <p className="text-xs font-heading font-bold">Settings & Privacy</p>
                <p className="text-[11px] text-muted-foreground font-body">
                  Vanish mode, notifications, language translation & sounds
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-muted-foreground font-bold">Manage</span>
          </div>
        </div>
      </div>
    </div>
  );
}
