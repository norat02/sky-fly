import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Radio,
  Plus,
  Search,
  Check,
} from 'lucide-react';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import Avatar from '@/components/Avatar';
import { getLocalProfile } from '@/lib/chat-utils';

const DEFAULT_CHANNELS = [
  {
    id: 'chan_art_daily',
    name: '🎨 Daily Sketch Prompts',
    username: 'artdaily',
    description: 'Fresh daily drawing challenges, doodle ideas & ink techniques.',
    subscribers_count: 1420,
    avatar_color: '#ec4899',
    category: 'Art & Design',
    is_joined: true,
  },
  {
    id: 'chan_whisper_updates',
    name: '⚡ Whisper Official News',
    username: 'whispernews',
    description: 'Release notes, secret features, and roadmap announcements.',
    subscribers_count: 3890,
    avatar_color: '#3b82f6',
    category: 'Technology',
    is_joined: true,
  },
  {
    id: 'chan_quotes',
    name: '🖋️ Ink & Philosophy',
    username: 'inkphilosophy',
    description: 'Handcrafted calligraphic thoughts and daily mindful sketches.',
    subscribers_count: 980,
    avatar_color: '#8b5cf6',
    category: 'Lifestyle',
    is_joined: false,
  },
];

export default function Channels() {
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Channel form
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Art & Design');

  const me = getLocalProfile();

  const loadChannels = useCallback(() => {
    try {
      const stored = localStorage.getItem('whisper_channels');
      if (stored) {
        setChannels(JSON.parse(stored));
      } else {
        setChannels(DEFAULT_CHANNELS);
        localStorage.setItem('whisper_channels', JSON.stringify(DEFAULT_CHANNELS));
      }
    } catch {
      setChannels(DEFAULT_CHANNELS);
    }
  }, []);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  const saveChannels = (updated) => {
    setChannels(updated);
    localStorage.setItem('whisper_channels', JSON.stringify(updated));
  };

  const toggleJoin = (id) => {
    const updated = channels.map((c) => {
      if (c.id === id) {
        const nextJoined = !c.is_joined;
        toast.success(
          nextJoined ? `Subscribed to ${c.name}` : `Unsubscribed from ${c.name}`
        );
        return {
          ...c,
          is_joined: nextJoined,
          subscribers_count: nextJoined
            ? c.subscribers_count + 1
            : Math.max(0, c.subscribers_count - 1),
        };
      }
      return c;
    });
    saveChannels(updated);
  };

  const handleCreateChannel = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newChan = {
      id: `chan_${Date.now()}`,
      name: newName.trim(),
      username: (newUsername.trim() || newName.toLowerCase().replace(/\s+/g, '_')).replace(/[^a-z0-9_]/g, ''),
      description: newDesc.trim(),
      subscribers_count: 1,
      avatar_color: '#3b82f6',
      category: newCategory,
      is_joined: true,
      owner_id: me?.profile_id,
    };

    const updated = [newChan, ...channels];
    saveChannels(updated);
    setShowCreateModal(false);
    setNewName('');
    setNewUsername('');
    setNewDesc('');
    toast.success(`Channel "${newChan.name}" created!`);
  };

  const categories = ['All', 'Art & Design', 'Technology', 'Lifestyle', 'News'];

  const filteredChannels = channels.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.username.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="page-shell relative">
      <BackgroundOrbs />

      <div className="page-container max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
              Channels <span className="text-xs font-mono font-normal text-muted-foreground">({channels.length})</span>
            </h1>
            <p className="text-xs text-muted-foreground font-body">
              Telegram-style public broadcasts and creator networks
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="sketch-fill flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-heading font-bold text-primary-foreground shadow-sm"
          >
            <Plus size={16} /> New Channel
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-foreground/10 bg-card/65 px-3.5 py-3 shadow-sm">
          <Search size={16} className="text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search public channels & topics..."
            className="flex-1 bg-transparent outline-none text-xs font-body"
          />
        </div>

        {/* Category Pills */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-heading font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-foreground/10 bg-card/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Channel Cards */}
        <div className="space-y-3">
          {filteredChannels.map((channel) => (
            <div
              key={channel.id}
              className="glass-card flex flex-col justify-between gap-4 rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:bg-card/70 sm:flex-row sm:items-center"
            >
              <div className="flex items-start gap-3 min-w-0">
                <Avatar
                  name={channel.name}
                  color={channel.avatar_color}
                  size={46}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-heading font-bold text-foreground truncate">
                      {channel.name}
                    </h3>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      @{channel.username}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground font-body line-clamp-2 mt-0.5">
                    {channel.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Radio size={12} className="text-primary" /> {channel.subscribers_count} subscribers
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px]">
                      {channel.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => toggleJoin(channel.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all ${
                    channel.is_joined
                      ? 'sketch-border bg-card/60 text-foreground'
                      : 'sketch-fill text-primary-foreground'
                  }`}
                >
                  {channel.is_joined ? (
                    <span className="flex items-center gap-1">
                      <Check size={13} /> Subscribed
                    </span>
                  ) : (
                    'Subscribe'
                  )}
                </button>

                <button
                  onClick={() => navigate(`/chat/channel_${channel.id}`)}
                  className="px-3.5 py-2 rounded-xl sketch-border text-xs font-heading font-bold hover:bg-card/50"
                >
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Channel Modal */}
      {showCreateModal && (
        <div
          onClick={() => setShowCreateModal(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-card rounded-3xl p-5 max-w-md w-full sketch-border bg-card/95 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-heading font-bold flex items-center gap-2">
                <Radio size={18} className="text-primary" /> Create Broadcast Channel
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg hover:bg-card/40"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateChannel} className="space-y-3">
              <div>
                <label className="text-xs font-body text-muted-foreground block mb-1">
                  Channel Name
                </label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Daily Ink Inspirations"
                  required
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs font-body sketch-border"
                />
              </div>

              <div>
                <label className="text-xs font-body text-muted-foreground block mb-1">
                  Public Handle (@username)
                </label>
                <input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="dailyink"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono lowercase sketch-border"
                />
              </div>

              <div>
                <label className="text-xs font-body text-muted-foreground block mb-1">
                  Description
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="What is this channel about?"
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs font-body sketch-border resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-body text-muted-foreground block mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs font-body sketch-border bg-card/40"
                >
                  <option value="Art & Design">Art & Design</option>
                  <option value="Technology">Technology</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="News">News</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl sketch-border text-xs font-heading font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl sketch-fill text-xs font-heading font-bold text-primary-foreground"
                >
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
