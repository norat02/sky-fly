import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Avatar from '@/components/Avatar';

export default function StoryViewer({ group, onClose }) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);
  const story = group.stories[idx];

  const next = () => setIdx((i) => (i + 1 < group.stories.length ? i + 1 : i));
  const prev = () => setIdx((i) => (i > 0 ? i - 1 : i));

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (idx >= group.stories.length - 1) return;
    timerRef.current = setTimeout(() => next(), story?.media_type === 'video' ? 12000 : 5000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [idx]);

  if (!story) {
    onClose();
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-[60] flex items-center justify-center"
      >
        <div className="absolute top-0 left-0 right-0 flex gap-1 p-3 z-10">
          {group.stories.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: i < idx ? '100%' : i === idx ? '50%' : '0%' }}
              />
            </div>
          ))}
        </div>
        <div className="absolute top-6 left-0 right-0 flex items-center gap-2 px-4 z-10">
          <Avatar name={group.display_name} color={group.avatar_color} avatarUrl={group.avatar_url} size={36} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-body font-medium text-white truncate">@{group.username}</p>
            <p className="text-[10px] text-white/60">
              {new Date(story.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
            <X size={22} className="text-white" />
          </button>
        </div>
        {story.media_type === 'video' ? (
          <video src={story.media_url} autoPlay className="max-w-full max-h-full" />
        ) : (
          <img src={story.media_url} className="max-w-full max-h-full object-contain" alt="story" />
        )}
        {story.caption && (
          <div className="absolute bottom-10 left-0 right-0 text-center px-6">
            <p className="text-white text-sm font-body drop-shadow-lg">{story.caption}</p>
          </div>
        )}
        <button onClick={prev} className="absolute left-0 top-16 bottom-16 w-1/3" aria-label="previous" />
        <button onClick={next} className="absolute right-0 top-16 bottom-16 w-1/3" aria-label="next" />
      </motion.div>
    </AnimatePresence>
  );
}