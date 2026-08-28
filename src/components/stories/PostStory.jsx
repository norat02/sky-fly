import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { X, Loader2, Camera } from 'lucide-react';

import { getLocalProfile } from '@/lib/chat-utils';
import { db } from '@/api/base44Client';

export default function PostStory({ onClose, onPosted }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const me = getLocalProfile();

  const pick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 25 * 1024 * 1024) {
      toast.error('Max 25MB');
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const post = async () => {
    if (!file || !me) return;
    setUploading(true);
    try {
      const res = await db.integrations.Core.UploadFile({ file });
      const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
      await db.entities.Story.create({
        profile_id: me.profile_id,
        username: me.username,
        display_name: me.display_name,
        avatar_color: me.avatar_color,
        avatar_url: me.avatar_url || '',
        media_url: res.file_url,
        media_type: mediaType,
        caption: caption.trim(),
      });
      toast.success('Story shared');
      onPosted();
    } catch {
      toast.error('Failed to post story');
    }
    setUploading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.92 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.92 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card w-full max-w-sm p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-bold">Add story</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-card/40">
              <X size={18} />
            </button>
          </div>
          {!preview ? (
            <label className="flex flex-col items-center justify-center gap-2 h-48 sketch-dashed rounded-xl cursor-pointer hover:bg-card/30 transition-colors">
              <Camera size={28} />
              <span className="text-sm font-body">Tap to add photo or video</span>
              <input type="file" accept="image/*,video/*" className="hidden" onChange={pick} />
            </label>
          ) : (
            <div>
              {file?.type.startsWith('video/') ? (
                <video src={preview} className="w-full max-h-64 rounded-xl sketch-border" controls />
              ) : (
                <img src={preview} alt="preview" className="w-full max-h-64 object-contain rounded-xl sketch-border" />
              )}
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption…"
                maxLength={100}
                rows={2}
                className="w-full mt-3 px-3 py-2 glass-input text-sm font-body resize-none"
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="flex-1 py-2 sketch-border rounded-xl text-sm font-body"
                >
                  Change
                </button>
                <button
                  onClick={post}
                  disabled={uploading}
                  className="flex-1 py-2 sketch-fill rounded-xl text-sm font-heading font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : null}
                  Share
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}