import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import PostCard from './PostCard';

export default function PostDetailModal({ post, isOpen, onClose, onDeletePost, onUpdatePost }) {
  if (!isOpen || !post) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      >
        <div className="relative w-full max-w-lg my-8" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors z-10"
            title="Close"
          >
            <X size={20} />
          </button>
          <PostCard
            post={post}
            onDeletePost={(id) => {
              if (onDeletePost) onDeletePost(id);
              onClose();
            }}
            onUpdatePost={onUpdatePost}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
