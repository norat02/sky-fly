import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, Palette } from 'lucide-react';

export const CHAT_WALLPAPERS = [
  {
    id: 'parchment',
    name: 'Vintage Parchment',
    bgClass: 'bg-[#faf8f5] dark:bg-[#181614]',
    pattern: 'radial-gradient(#d1c7b7 1px, transparent 1px)',
    preview: '#faf8f5',
  },
  {
    id: 'blueprint',
    name: 'Blueprint Grid',
    bgClass: 'bg-[#f0f4f8] dark:bg-[#0f172a]',
    pattern: 'linear-gradient(to right, rgba(59, 130, 246, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.08) 1px, transparent 1px)',
    preview: '#3b82f6',
  },
  {
    id: 'inknight',
    name: 'Inky Night',
    bgClass: 'bg-[#121214]',
    pattern: 'radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px)',
    preview: '#1e1e24',
  },
  {
    id: 'rose',
    name: 'Rose Notebook',
    bgClass: 'bg-[#fff5f5] dark:bg-[#201416]',
    pattern: 'radial-gradient(rgba(244, 63, 94, 0.08) 1px, transparent 1px)',
    preview: '#f43f5e',
  },
  {
    id: 'mint',
    name: 'Mint Sketch',
    bgClass: 'bg-[#f0fdf4] dark:bg-[#102018]',
    pattern: 'radial-gradient(rgba(34, 197, 94, 0.08) 1px, transparent 1px)',
    preview: '#22c55e',
  },
  {
    id: 'lavender',
    name: 'Lavender Dusk',
    bgClass: 'bg-[#fbf7ff] dark:bg-[#1a1424]',
    pattern: 'radial-gradient(rgba(168, 85, 247, 0.08) 1px, transparent 1px)',
    preview: '#a855f7',
  },
];

export default function ChatWallpaperModal({ isOpen, onClose, selectedId, onSelect }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="w-full max-w-sm glass-card rounded-3xl overflow-hidden sketch-border shadow-2xl bg-card/95 p-5 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
          <div className="flex items-center gap-2">
            <Palette size={18} className="text-primary" />
            <h2 className="text-base font-heading font-bold">Chat Paper Theme</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-card/60 text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-muted-foreground font-body">
          Choose a custom sketchbook paper texture and background for this conversation.
        </p>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {CHAT_WALLPAPERS.map((theme) => {
            const isSelected = selectedId === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => {
                  onSelect(theme.id);
                  onClose();
                }}
                className={`p-3 rounded-2xl text-left sketch-border relative overflow-hidden transition-all flex flex-col justify-between h-20 ${
                  isSelected ? 'border-primary ring-2 ring-primary/40' : 'hover:scale-[1.02]'
                }`}
                style={{
                  backgroundColor: theme.preview,
                  backgroundImage: theme.pattern,
                  backgroundSize: '16px 16px',
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: theme.preview }} />
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                      <Check size={12} className="stroke-[3]" />
                    </div>
                  )}
                </div>
                <span className="text-xs font-heading font-bold text-foreground bg-background/80 px-2 py-0.5 rounded-md backdrop-blur-xs w-fit">
                  {theme.name}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
