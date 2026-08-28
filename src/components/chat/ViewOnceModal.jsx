import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Flame } from 'lucide-react';

export default function ViewOnceModal({
  isOpen,
  onClose,
  mediaUrl,
  caption = '',
  captionNode = null,
}) {
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    if (!isOpen) return;

    // Countdown 10 seconds before auto closing and destroying
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onClose]);

  if (!isOpen || !mediaUrl) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 select-none">
        {/* Top Bar with Timer */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-50 max-w-xl mx-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-400 sketch-border text-xs font-mono font-bold">
            <Flame size={14} className="animate-pulse" /> Disappearing in {secondsLeft}s
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
            title="Close View Once"
          >
            <X size={20} />
          </button>
        </div>

        {/* Media Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          className="relative max-w-lg w-full flex flex-col items-center justify-center"
        >
          <img
            src={mediaUrl}
            alt={typeof caption === 'string' && caption ? caption : 'View Once Media'}
            className="max-h-[75vh] w-auto object-contain rounded-3xl shadow-2xl sketch-border border-amber-500/40"
          />

          <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/70 text-slate-300 text-xs font-body sketch-border">
            <Lock size={14} className="text-amber-400" />
            <span>This photo will disappear permanently once closed.</span>
          </div>

          {(captionNode || caption) && (
            <div className="mt-2 text-center text-xs text-white font-body">
              {captionNode || caption}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
