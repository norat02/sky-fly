import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Send } from 'lucide-react';

export default function ScheduledMessageModal({
  isOpen,
  onClose,
  onSchedule,
  initialText = '',
}) {
  const [scheduledText, setScheduledText] = useState(initialText);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!scheduledText.trim()) return;

    let targetDate = new Date();
    if (scheduledDate && scheduledTime) {
      targetDate = new Date(`${scheduledDate}T${scheduledTime}`);
    } else {
      // Default: 10 minutes from now
      targetDate = new Date(Date.now() + 10 * 60 * 1000);
    }

    onSchedule(targetDate, scheduledText.trim());
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="glass-card rounded-3xl p-5 max-w-sm w-full sketch-border bg-card/95 shadow-2xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500 sketch-border">
                <Clock size={18} />
              </div>
              <h3 className="text-sm font-heading font-bold">Schedule Message</h3>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-card/40 sketch-border">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-body text-muted-foreground block mb-1">Message</label>
              <textarea
                value={scheduledText}
                onChange={(e) => setScheduledText(e.target.value)}
                placeholder="What would you like to say later?"
                rows={3}
                required
                className="w-full px-3 py-2 rounded-xl glass-input text-xs font-body sketch-border resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-body text-muted-foreground block mb-1">Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl glass-input text-xs font-mono sketch-border"
                />
              </div>
              <div>
                <label className="text-xs font-body text-muted-foreground block mb-1">Time</label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl glass-input text-xs font-mono sketch-border"
                />
              </div>
            </div>

            {/* Presets */}
            <div className="flex gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  const d = new Date(Date.now() + 30 * 60 * 1000);
                  onSchedule(d, scheduledText.trim());
                  onClose();
                }}
                className="flex-1 py-1.5 px-2 rounded-xl sketch-border text-[10px] font-heading font-bold hover:bg-card/40"
              >
                In 30m
              </button>
              <button
                type="button"
                onClick={() => {
                  const d = new Date(Date.now() + 2 * 3600 * 1000);
                  onSchedule(d, scheduledText.trim());
                  onClose();
                }}
                className="flex-1 py-1.5 px-2 rounded-xl sketch-border text-[10px] font-heading font-bold hover:bg-card/40"
              >
                In 2 hours
              </button>
              <button
                type="button"
                onClick={() => {
                  const d = new Date();
                  d.setHours(9, 0, 0, 0);
                  d.setDate(d.getDate() + 1);
                  onSchedule(d, scheduledText.trim());
                  onClose();
                }}
                className="flex-1 py-1.5 px-2 rounded-xl sketch-border text-[10px] font-heading font-bold hover:bg-card/40"
              >
                Tomorrow 9am
              </button>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl sketch-border text-xs font-heading font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl sketch-fill text-xs font-heading font-bold text-primary-foreground flex items-center gap-1.5"
              >
                <Send size={14} /> Schedule
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
