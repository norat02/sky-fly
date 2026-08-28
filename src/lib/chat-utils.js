import { db } from '@/api/base44Client';

export const DEFAULT_LANGUAGE = 'en';
export const DEFAULT_AUTO_TRANSLATE = true;

function normalizeLanguageProfile(profile) {
  if (!profile) return profile;
  return {
    ...profile,
    language: profile.language || DEFAULT_LANGUAGE,
    auto_translate: profile.auto_translate !== false,
  };
}

const ADJECTIVES = [
  'Blue', 'Silver', 'Ocean', 'Crimson', 'Golden', 'Emerald', 'Violet', 'Cosmic',
  'Mystic', 'Lunar', 'Solar', 'Frost', 'Amber', 'Jade', 'Onyx', 'Ruby',
  'Pearl', 'Sage', 'Storm', 'Dawn', 'Coral', 'Cobalt', 'Ivory', 'Indigo',
  'Copper', 'Cedar', 'Mint', 'Lavender', 'Amber', 'Velvet',
];

const NOUNS = [
  'Fox', 'Wolf', 'Bird', 'Falcon', 'Lynx', 'Bear', 'Hawk', 'Deer',
  'Owl', 'Crane', 'Seal', 'Otter', 'Raven', 'Heron', 'Puma', 'Koala',
  'Swan', 'Wren', 'Stag', 'Kite', 'Dove', 'Finch', 'Lark', 'Moth',
  'Orca', 'Lamb', 'Stork', 'Drake', 'Eagle', 'Hare',
];

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #30cfd0, #330867)',
  'linear-gradient(135deg, #a8edea, #fed6e3)',
  'linear-gradient(135deg, #ff9a9e, #fecfef)',
  'linear-gradient(135deg, #ffecd2, #fcb69f)',
  'linear-gradient(135deg, #84fab0, #8fd3f4)',
  'linear-gradient(135deg, #c471f5, #fa71cd)',
  'linear-gradient(135deg, #fcb045, #fd1d1d, #833ab4)',
  'linear-gradient(135deg, #5ee7df, #b490ca)',
  'linear-gradient(135deg, #d299c2, #fef9d7)',
  'linear-gradient(135deg, #89f7fe, #66a6ff)',
  'linear-gradient(135deg, #fddb92, #d1fdff)',
];

export function generateRoomId() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function generateParticipantId() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function generateNickname() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return adj + noun;
}

export function generateAvatarColor() {
  return AVATAR_GRADIENTS[Math.floor(Math.random() * AVATAR_GRADIENTS.length)];
}

export function getRoomSettings(roomId) {
  try {
    const data = localStorage.getItem(`whisper_room_settings_${roomId}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setRoomSettings(roomId, settings) {
  try {
    localStorage.setItem(`whisper_room_settings_${roomId}`, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function clearRoomSettings(roomId) {
  try {
    localStorage.removeItem(`whisper_room_settings_${roomId}`);
  } catch {
    // ignore
  }
}

export function getLocalParticipant(roomId) {
  try {
    const data = localStorage.getItem(`whisper_participant_${roomId}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setLocalParticipant(roomId, participant) {
  try {
    localStorage.setItem(`whisper_participant_${roomId}`, JSON.stringify(participant));
  } catch {
    // ignore
  }
}

export function formatTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function getInitials(name) {
  if (!name) return '?';
  if (name.length <= 2) return name.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// Saved rooms
export function getSavedRooms() {
  try {
    const data = localStorage.getItem('whisper_saved_rooms');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveRoom(roomId, roomName = '') {
  try {
    const rooms = getSavedRooms();
    if (!rooms.find((r) => r.room_id === roomId)) {
      rooms.push({ room_id: roomId, room_name: roomName, saved_at: Date.now() });
      localStorage.setItem('whisper_saved_rooms', JSON.stringify(rooms));
    }
  } catch {
    // ignore
  }
}

export function removeSavedRoom(roomId) {
  try {
    const rooms = getSavedRooms();
    const filtered = rooms.filter((r) => r.room_id !== roomId);
    localStorage.setItem('whisper_saved_rooms', JSON.stringify(filtered));
  } catch {
    // ignore
  }
}

// ===== Profile (Instagram-style anonymous identity) =====

const HANDLE_ADJ = [
  'blue', 'silver', 'ocean', 'crimson', 'golden', 'emerald', 'violet', 'cosmic',
  'mystic', 'lunar', 'solar', 'frost', 'amber', 'jade', 'onyx', 'ruby',
  'pearl', 'sage', 'storm', 'dawn', 'coral', 'cobalt', 'ivory', 'indigo',
  'copper', 'cedar', 'mint', 'velvet', 'neon', 'quiet',
];
const HANDLE_NOUN = [
  'fox', 'wolf', 'bird', 'falcon', 'lynx', 'bear', 'hawk', 'deer',
  'owl', 'crane', 'seal', 'otter', 'raven', 'heron', 'puma', 'koala',
  'swan', 'wren', 'stag', 'dove', 'finch', 'lark', 'moth', 'orca',
  'lamb', 'stork', 'drake', 'eagle', 'hare', 'ghost',
];

export function generateUsername() {
  const adj = HANDLE_ADJ[Math.floor(Math.random() * HANDLE_ADJ.length)];
  const noun = HANDLE_NOUN[Math.floor(Math.random() * HANDLE_NOUN.length)];
  const num = Math.floor(Math.random() * 9000 + 100);
  return `${adj}_${noun}_${num}`;
}

export function sanitizeUsername(raw) {
  let u = (raw || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_]/g, '')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '');
  if (u.length < 3) u = (u + 'ghost').slice(0, 20);
  return u.slice(0, 20);
}

export function getLocalProfile() {
  try {
    const data = localStorage.getItem('whisper_profile');
    return data ? normalizeLanguageProfile(JSON.parse(data)) : null;
  } catch {
    return null;
  }
}

export function setLocalProfile(profile) {
  try {
    localStorage.setItem('whisper_profile', JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export async function ensureProfile() {
  // If logged in, use the profile linked to this account
  let user = null;
  try {
    user = await db.auth.me();
  } catch {
    user = null;
  }

  if (user && user.id) {
    try {
      // 1. Try finding profile by user id
      let p = await db.entities.Profile.get(user.id);
      if (!p) {
        const matches = await db.entities.Profile.filter({ user_id: user.id });
        if (matches.length > 0) p = matches[0];
      }

      if (p) {
        const profile = {
          id: p.id || user.id,
          profile_id: p.id || p.profile_id || user.id,
          username: p.username,
          display_name: p.display_name || user.user_metadata?.display_name || p.username,
          avatar_color: p.avatar_color || generateAvatarColor(),
          avatar_url: p.avatar_url || user.user_metadata?.avatar_url || '',
          bio: p.bio || '',
          website: p.website || '',
          language: p.language || DEFAULT_LANGUAGE,
          auto_translate: p.auto_translate !== false,
          user_id: user.id,
        };
        setLocalProfile(profile);
        return profile;
      }
    } catch (err) {
      console.warn('Error fetching profile for user:', err);
    }

    // No profile record in DB yet — create one for this account
    let desiredUsername = user.user_metadata?.username || (user.email ? user.email.split('@')[0] : '');
    desiredUsername = sanitizeUsername(desiredUsername);

    let username = desiredUsername || generateUsername();
    try {
      let taken = await db.entities.Profile.filter({ username });
      let attempts = 0;
      while (taken.length > 0 && attempts < 10) {
        username = `${desiredUsername || 'user'}_${Math.floor(Math.random() * 9000 + 100)}`;
        taken = await db.entities.Profile.filter({ username });
        attempts++;
      }
    } catch {
      // ignore
    }

    const profile = {
      id: user.id,
      profile_id: user.id,
      username,
      display_name: user.user_metadata?.display_name || user.user_metadata?.full_name || username,
      avatar_color: generateAvatarColor(),
      avatar_url: user.user_metadata?.avatar_url || '',
      bio: '',
      website: '',
      language: DEFAULT_LANGUAGE,
      auto_translate: DEFAULT_AUTO_TRANSLATE,
      user_id: user.id,
    };

    try {
      await db.entities.Profile.create({
        id: user.id,
        username: profile.username,
        display_name: profile.display_name,
        avatar_color: profile.avatar_color,
        avatar_url: profile.avatar_url,
        bio: '',
        website: '',
        language: profile.language,
        auto_translate: profile.auto_translate,
        user_id: user.id,
      });
    } catch (err) {
      console.warn('Failed to insert new profile row:', err);
    }

    setLocalProfile(profile);
    return profile;
  }

  // Not authenticated
  return null;
}

export async function updateProfile(updates) {
  const profile = getLocalProfile();
  if (!profile) return null;
  const targetId = profile.id || profile.profile_id;
  try {
    const existing = await db.entities.Profile.get(targetId);
    if (existing) {
      await db.entities.Profile.update(targetId, updates);
    } else {
      await db.entities.Profile.create({
        id: targetId,
        username: profile.username,
        display_name: profile.display_name,
        user_id: profile.user_id,
        ...updates,
      });
    }
  } catch (err) {
    console.warn('Failed to sync profile update to backend:', err);
  }
  const merged = normalizeLanguageProfile({ ...profile, ...updates });
  setLocalProfile(merged);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('whisper-profile-updated', { detail: merged }));
  }
  return merged;
}

export function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h';
  if (diff < 604800) return Math.floor(diff / 86400) + 'd';
  return d.toLocaleDateString();
}

export function clearAllLocal() {
  try {
    localStorage.removeItem('whisper_profile');
    localStorage.removeItem('whisper_saved_rooms');
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith('whisper_participant_') || k.startsWith('whisper_room_settings_')) {
        localStorage.removeItem(k);
      }
    });
  } catch {
    // ignore
  }
}