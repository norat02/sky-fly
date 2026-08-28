import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Avatar from '@/components/Avatar';
import StoryViewer from './StoryViewer';
import PostStory from './PostStory';
import { getLocalProfile } from '@/lib/chat-utils';
import { db } from '@/api/base44Client';

export default function StoriesTray() {
  const [groups, setGroups] = useState([]);
  const [viewing, setViewing] = useState(null);
  const [posting, setPosting] = useState(false);
  const me = getLocalProfile();

  const load = async () => {
    try {
      const all = await db.entities.Story.list('-created_date', 200);
      const cutoff = new Date(Date.now() - 24 * 3600 * 1000);
      const recent = all.filter((s) => new Date(s.created_date) > cutoff);
      const map = {};
      recent.forEach((s) => {
        if (!map[s.profile_id]) {
          map[s.profile_id] = {
            profile_id: s.profile_id,
            username: s.username,
            display_name: s.display_name,
            avatar_color: s.avatar_color,
            avatar_url: s.avatar_url,
            stories: [],
          };
        }
        map[s.profile_id].stories.push(s);
      });
      setGroups(Object.values(map));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    load();
    const unsub = db.entities.Story.subscribe(() => load());
    return unsub;
  }, []);

  if (!me) return null;

  const viewingGroup = groups.find((x) => x.profile_id === viewing);

  return (
    <div className="mb-3">
      <div className="flex gap-3 overflow-x-auto scrollbar-thin pb-1">
        <button onClick={() => setPosting(true)} className="flex flex-col items-center gap-1 shrink-0">
          <div className="relative">
            <Avatar name={me.display_name} color={me.avatar_color} avatarUrl={me.avatar_url} size={56} />
            <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full sketch-fill flex items-center justify-center border-2 border-background">
              <Plus size={12} className="text-primary-foreground" />
            </span>
          </div>
          <span className="text-[10px] font-body text-muted-foreground">Your story</span>
        </button>
        {groups.map((g) => (
          <button
            key={g.profile_id}
            onClick={() => setViewing(g.profile_id)}
            className="flex flex-col items-center gap-1 shrink-0"
          >
            <div
              className="p-0.5 rounded-full"
              style={{ background: 'linear-gradient(135deg,#f093fb,#f5576c,#ffd700)' }}
            >
              <div className="bg-background rounded-full p-0.5">
                <Avatar name={g.display_name} color={g.avatar_color} avatarUrl={g.avatar_url} size={52} />
              </div>
            </div>
            <span className="text-[10px] font-body text-muted-foreground truncate max-w-[64px]">
              {g.username}
            </span>
          </button>
        ))}
      </div>
      {posting && (
        <PostStory onClose={() => setPosting(false)} onPosted={() => { setPosting(false); load(); }} />
      )}
      {viewingGroup && <StoryViewer group={viewingGroup} onClose={() => setViewing(null)} />}
    </div>
  );
}