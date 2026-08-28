import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, Check, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { LANGUAGES } from '@/lib/languages';
import { updateProfile, getLocalProfile } from '@/lib/chat-utils';

export default function LanguageSelectModal({ isOpen, onClose, currentLang, onSelect }) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const activeLang = currentLang || getLocalProfile()?.language || 'en';

  const filteredLanguages = LANGUAGES.filter((l) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      l.label.toLowerCase().includes(q) ||
      l.native.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q)
    );
  });

  const handleSelectLanguage = async (code, label) => {
    try {
      await updateProfile({ language: code, auto_translate: true });
      if (onSelect) onSelect(code);
      toast.success(`Active translation set to ${label}! Incoming messages will be in ${label}.`);
    } catch {
      toast.error('Failed to update language');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/45 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 10 }}
          className="glass-card w-full max-w-md p-5 rounded-3xl sketch-border relative z-10 space-y-4 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl sketch-fill text-primary-foreground">
                <Globe size={18} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base leading-tight">Choose Your Language</h3>
                <p className="text-[11px] text-muted-foreground font-body leading-tight">
                  All received messages will appear in your chosen language
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-card/60 text-muted-foreground hover:text-foreground transition-colors font-bold text-xs sketch-border"
            >
              ✕
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${LANGUAGES.length}+ languages (e.g. Spanish, हिन्दी, Français)...`}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl glass-input text-xs font-body bg-card/40 sketch-border"
              autoFocus
            />
          </div>

          {/* Language Grid / List */}
          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
            {filteredLanguages.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground font-body">
                No languages found matching "{search}"
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {filteredLanguages.map((l) => {
                  const isSelected = activeLang === l.code;
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => handleSelectLanguage(l.code, l.label)}
                      className={`p-2.5 rounded-2xl text-left text-xs font-body transition-all sketch-border flex items-center justify-between ${
                        isSelected
                          ? 'bg-primary/20 border-primary font-bold text-primary shadow-xs'
                          : 'bg-card/30 hover:bg-card/70 text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base leading-none">{l.flag}</span>
                        <div className="truncate">
                          <p className="font-heading font-bold text-xs leading-tight truncate">{l.label}</p>
                          <p className="text-[10px] text-muted-foreground truncate leading-tight font-hand">
                            {l.native} · {l.code}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 ml-1">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between pt-2 border-t border-foreground/10 text-xs">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-hand">
              <Sparkles size={12} className="text-primary" />
              <span>Instant SLM: 0ms Cache + Gemini 3.7 Flash</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 sketch-fill text-xs font-heading font-bold rounded-xl"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
