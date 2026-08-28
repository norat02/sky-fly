import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Camera, Clock } from 'lucide-react';
import { toast } from 'sonner';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import Avatar from '@/components/Avatar';
import StoryViewer from '@/components/stories/StoryViewer';
import PostStory from '@/components/stories/PostStory';
import { ensureProfile } from '@/lib/chat-utils';
import { db } from '@/api/base44Client';

export default function Status() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [myStories, setMyStories] = useState([]);
  const [allStoryGroups, setAllStoryGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isPostingStory, setIsPostingStory] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadStories = async () => {
    try {
      const profile = await ensureProfile();
      setMe(profile);
      const myId = profile.profile_id || profile.id;

      // 24 hour cutoff
      const cutoff = new Date(Date.now() - 24 * 3600 * 1000);
      const allStories = await db.entities.Story.filter({}, '-created_at');

      const validStories = allStories.filter((s) => {
        const d = new Date(s.created_at || s.created_date);
        return d > cutoff;
      });

      // Filter my stories
      const mine = validStories.filter((s) => s.user_id === myId);
      setMyStories(mine);

      // Group others' stories by author
      const groupsMap = {};
      for (const s of validStories) {
        if (s.user_id === myId) continue;
        if (!groupsMap[s.user_id]) {
          const author = await db.entities.Profile.get(s.user_id).catch(() => null);
          groupsMap[s.user_id] = {
            profile_id: s.user_id,
            user_id: s.user_id,
            username: author?.username || 'contact',
            display_name: author?.display_name || author?.username || 'Sketchbook Friend',
            avatar_color: author?.avatar_color || '#3b82f6',
            avatar_url: author?.avatar_url || '',
            stories: [],
          };
        }
        groupsMap[s.user_id].stories.push(s);
      }

      setAllStoryGroups(Object.values(groupsMap));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const handleDeleteMyStory = async (storyId) => {
    try {
      await db.entities.Story.delete(storyId);
      toast.success('Status update deleted');
      loadStories();
    } catch {
      toast.error('Failed to delete status');
    }
  };

  const myStoryGroup =
    myStories.length > 0
      ? {
          profile_id: me?.id,
          user_id: me?.id,
          username: me?.username,
          display_name: me?.display_name || 'My Status',
          avatar_color: me?.avatar_color,
          avatar_url: me?.avatar_url,
          stories: myStories,
        }
      : null;

  return (
    <div className="page-shell relative">
      <BackgroundOrbs />
      <div className="page-container max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold">Status & Stories</h1>
            <p className="text-xs text-muted-foreground font-body">
              Disappears 24 hours after publishing
            </p>
          </div>
          <button
            onClick={() => setIsPostingStory(true)}
            className="sketch-fill flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-heading font-bold text-primary-foreground shadow-sm"
          >
            <Camera size={16} /> Add Status
          </button>
        </div>

        {/* My Status Card */}
        <div className="glass-card mb-6 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div
              onClick={() => (myStoryGroup ? setSelectedGroup(myStoryGroup) : setIsPostingStory(true))}
              className="flex items-center gap-3.5 cursor-pointer flex-1 min-w-0"
            >
              <div className="relative">
                <div
                  className={`p-1 rounded-full ${
                    myStories.length > 0
                      ? 'bg-gradient-to-tr from-green-500 to-emerald-400'
                      : 'border-2 border-dashed border-muted-foreground/50'
                  }`}
                >
                  <Avatar
                    name={me?.display_name || 'Me'}
                    color={me?.avatar_color}
                    avatarUrl={me?.avatar_url}
                    size={52}
                  />
                </div>
                {myStories.length === 0 && (
                  <div className="absolute bottom-0 right-0 p-1 rounded-full bg-primary text-primary-foreground">
                    <Plus size={12} className="stroke-[3]" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-heading font-bold truncate">My Status</h3>
                <p className="text-xs text-muted-foreground font-body">
                  {myStories.length > 0
                    ? `${myStories.length} active updates • Tap to view`
                    : 'Tap to add status update'}
                </p>
              </div>
            </div>

            {myStories.length > 0 && (
              <button
                onClick={() => setIsPostingStory(true)}
                className="p-2.5 rounded-xl hover:bg-card/60 sketch-border text-foreground transition-colors shrink-0"
                title="Add another status"
              >
                <Plus size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Recent Updates from Contacts */}
        <div className="space-y-3">
          <h2 className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground px-1">
            Recent Updates
          </h2>

          {loading ? (
            <div className="text-center py-10">
              <div className="w-8 h-8 border-4 border-foreground/20 border-t-primary rounded-full animate-spin mx-auto" />
            </div>
          ) : allStoryGroups.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center sm:p-10">
              <Clock size={36} className="mx-auto mb-2 text-muted-foreground/40" />
              <h3 className="font-heading font-bold text-sm">No recent updates</h3>
              <p className="text-xs text-muted-foreground font-body mt-1">
                When your contacts post status updates, you’ll see them right here!
              </p>
            </div>
          ) : (
            <div className="glass-card overflow-hidden rounded-2xl divide-y divide-foreground/[0.08]">
              {allStoryGroups.map((group) => {
                const latest = group.stories[group.stories.length - 1];
                return (
                  <div
                    key={group.user_id}
                    onClick={() => setSelectedGroup(group)}
                    className="flex items-center justify-between p-3.5 hover:bg-card/40 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-0.5 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400">
                        <div className="p-0.5 bg-background rounded-full">
                          <Avatar
                            name={group.display_name}
                            color={group.avatar_color}
                            avatarUrl={group.avatar_url}
                            size={48}
                          />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="font-heading font-bold text-sm truncate">{group.display_name}</p>
                        <p className="text-xs text-muted-foreground font-body truncate">
                          {latest?.caption || 'Photo status'} •{' '}
                          {new Date(latest?.created_at || latest?.created_date).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold px-2 py-1 rounded-full bg-primary/10 text-primary sketch-border">
                      {group.stories.length}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Story Viewer */}
        {selectedGroup && (
          <StoryViewer group={selectedGroup} onClose={() => setSelectedGroup(null)} />
        )}

        {/* Post Story Modal */}
        {isPostingStory && (
          <PostStory
            isOpen={isPostingStory}
            onClose={() => setIsPostingStory(false)}
            onStoryCreated={loadStories}
          />
        )}
      </div>
    </div>
  );
}
