import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';

export default function MediaLightbox({
  isOpen,
  onClose,
  mediaUrl,
  mediaType = 'image',
  caption = '',
  captionNode = null,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mediaUrl) return null;

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
      >
        {/* Controls */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          <a
            href={mediaUrl}
            download="whisper-media"
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
            title="Download Media"
          >
            <Download size={18} />
          </a>
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
            title="Close Lightbox"
          >
            <X size={20} />
          </button>
        </div>

        {/* Media Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
        >
          {mediaType === 'video' ? (
            <video
              src={mediaUrl}
              controls
              autoPlay
              className="max-h-[75vh] w-auto rounded-2xl shadow-2xl sketch-border"
            />
          ) : (
            <img
              src={mediaUrl}
              alt={typeof caption === 'string' && caption ? caption : 'Media full preview'}
              className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl sketch-border"
            />
          )}

          {(captionNode || caption) && (
            <div className="mt-3 max-w-lg rounded-xl bg-black/60 px-4 py-2 text-center text-xs text-white backdrop-blur-sm">
              {captionNode || caption}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
