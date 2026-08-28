import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, Check, Camera, AtSign, Loader2, User } from 'lucide-react';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import Avatar from '@/components/Avatar';

import {
  ensureProfile,
  updateProfile,
  sanitizeUsername,
  generateAvatarColor,
} from '@/lib/chat-utils';
import { db } from '@/api/base44Client';
import { LANGUAGES } from '@/lib/languages';

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #30cfd0, #330867)',
  'linear-gradient(135deg, #a8edea, #fed6e3)',
  'linear-gradient(135deg, #ff9a9e, #fecfef)',
  'linear-gradient(135deg, #fcb045, #fd1d1d, #833ab4)',
  'linear-gradient(135deg, #5ee7df, #b490ca)',
  'linear-gradient(135deg, #89f7fe, #66a6ff)',
  'linear-gradient(135deg, #c471f5, #fa71cd)',
];

export default function ProfileEdit() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarColor, setAvatarColor] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [useImage, setUseImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [checking, setChecking] = useState(false);
  const [lang, setLang] = useState('en');
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    ensureProfile().then((p) => {
      setProfile(p);
      setUsername(p.username || '');
      setDisplayName(p.display_name || '');
      setBio(p.bio || '');
      setAvatarColor(p.avatar_color || generateAvatarColor());
      setAvatarUrl(p.avatar_url || '');
      setUseImage(!!p.avatar_url);
      setLang(p.language || 'en');
      setAuto(p.auto_translate !== false);
    });
  }, []);

  useEffect(() => {
    const clean = sanitizeUsername(username);
    if (!profile || clean === profile.username) {
      setUsernameTaken(false);
      return;
    }
    setChecking(true);
    const t = setTimeout(async () => {
      try {
        const matches = await db.entities.Profile.filter({ username: clean });
        setUsernameTaken(matches.some((m) => m.profile_id !== profile.profile_id));
      } catch {
        setUsernameTaken(false);
      }
      setChecking(false);
    }, 500);
    return () => clearTimeout(t);
  }, [username, profile]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image too large (max 5MB)');
      return;
    }
    setUploading(true);
    try {
      const res = await db.integrations.Core.UploadFile({ file });
      setAvatarUrl(res.file_url);
      setUseImage(true);
    } catch {
      toast.error('Upload failed');
    }
    setUploading(false);
  };

  const handleSave = async () => {
    const clean = sanitizeUsername(username);
    if (clean.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }
    if (usernameTaken) {
      toast.error('That username is taken');
      return;
    }
    setSaving(true);
    try {
      const updated = await updateProfile({
        username: clean,
        display_name: displayName.trim() || profile.display_name,
        bio: bio.trim(),
        avatar_color: avatarColor,
        avatar_url: useImage ? avatarUrl : '',
        language: lang,
        auto_translate: auto,
      });
      setProfile(updated);
      toast.success('Profile saved');
      navigate('/profile');
    } catch {
      toast.error('Failed to save profile');
    }
    setSaving(false);
  };

  if (!profile) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <BackgroundOrbs />
        <div className="w-10 h-10 border-4 border-foreground/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const cleanUsername = sanitizeUsername(username);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8 relative">
      <BackgroundOrbs />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card p-6 md:p-8 w-full max-w-md"
      >
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/profile')} className="p-2 rounded-xl hover:bg-card/40 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-heading font-bold">Edit Profile</h1>
        </div>

        <p className="text-xs text-muted-foreground font-body mb-6">
          Your anonymous identity — no signup. It stays on this device and follows you everywhere.
        </p>

        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <Avatar
              name={displayName || profile.display_name}
              color={avatarColor}
              avatarUrl={useImage ? avatarUrl : undefined}
              size={96}
            />
            <label className="absolute bottom-0 right-0 p-2 rounded-full sketch-fill cursor-pointer shadow-lg">
              <Camera size={16} />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
            {uploading && (
              <div className="absolute inset-0 rounded-full bg-background/60 flex items-center justify-center">
                <Loader2 size={20} className="animate-spin" />
              </div>
            )}
          </div>
          {useImage && avatarUrl && (
            <button
              onClick={() => {
                setUseImage(false);
                setAvatarUrl('');
              }}
              className="mt-2 text-xs text-muted-foreground hover:text-destructive font-body"
            >
              Remove photo
            </button>
          )}
        </div>

        {!useImage && (
          <div className="mb-5">
            <label className="text-xs text-muted-foreground mb-2 block font-body">Avatar color</label>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_GRADIENTS.map((g) => (
                <button
                  key={g}
                  onClick={() => setAvatarColor(g)}
                  className={`h-9 rounded-full transition-transform ${
                    avatarColor === g
                      ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ background: g }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="text-xs text-muted-foreground mb-1.5 block font-body flex items-center gap-1">
            <AtSign size={12} /> Username
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="bluefox_42"
              maxLength={20}
              className="w-full pl-7 pr-3 py-2.5 glass-input text-sm font-body lowercase"
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className={`text-[11px] font-body ${usernameTaken ? 'text-destructive' : 'text-muted-foreground'}`}>
              {checking ? 'checking…' : usernameTaken ? 'taken — try another' : cleanUsername.length >= 3 ? 'available' : '3–20 chars, letters / numbers / _'}
            </p>
            {!checking && !usernameTaken && cleanUsername.length >= 3 && (
              <Check size={12} className="text-green-500" />
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs text-muted-foreground mb-1.5 block font-body flex items-center gap-1">
            <User size={12} /> Display name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Blue Fox"
            maxLength={30}
            className="w-full px-3 py-2.5 glass-input text-sm font-body"
          />
        </div>

        <div className="mb-6">
          <label className="text-xs text-muted-foreground mb-1.5 block font-body">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell people a little about you…"
            maxLength={150}
            rows={3}
            className="w-full px-3 py-2.5 glass-input text-sm font-body resize-none"
          />
          <p className="text-[11px] text-muted-foreground font-body text-right mt-0.5">{bio.length}/150</p>
        </div>

        <div className="mb-4">
          <label className="text-xs text-muted-foreground mb-1.5 block font-body">Preferred language for received messages</label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="w-full px-3 py-2.5 glass-input text-sm font-body bg-card/30"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.flag} {l.label} · {l.native}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-body font-medium">Translate received messages</p>
            <p className="text-xs text-muted-foreground">Show every incoming message in your preferred language</p>
          </div>
          <button
            type="button"
            onClick={() => setAuto(!auto)}
            className={`relative w-11 h-6 rounded-full border-2 transition-colors shrink-0 ${
              auto ? 'bg-primary border-primary' : 'border-foreground'
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform ${
                auto ? 'translate-x-6 bg-primary-foreground' : 'translate-x-0.5 bg-foreground'
              }`}
            />
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || checking || usernameTaken || cleanUsername.length < 3}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 sketch-fill font-heading font-bold disabled:opacity-40"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
          Save Profile
        </button>
      </motion.div>
    </div>
  );
}