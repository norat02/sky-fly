import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, BarChart2, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function PollModal({ isOpen, onClose, onSendPoll }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [allowMultiple, setAllowMultiple] = useState(false);

  const addOption = () => {
    if (options.length >= 8) {
      toast.error('Maximum 8 options allowed');
      return;
    }
    setOptions([...options, '']);
  };

  const updateOption = (index, value) => {
    const next = [...options];
    next[index] = value;
    setOptions(next);
  };

  const removeOption = (index) => {
    if (options.length <= 2) {
      toast.error('A poll needs at least 2 options');
      return;
    }
    setOptions(options.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) {
      toast.error('Please provide a poll question');
      return;
    }
    const cleanOptions = options.map((o) => o.trim()).filter(Boolean);
    if (cleanOptions.length < 2) {
      toast.error('Please provide at least 2 valid options');
      return;
    }

    const pollData = {
      id: 'poll_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      question: question.trim(),
      options: cleanOptions.map((text, idx) => ({
        id: `opt_${idx}_${Date.now()}`,
        text,
        votes: [],
      })),
      is_anonymous: isAnonymous,
      allow_multiple: allowMultiple,
      created_at: new Date().toISOString(),
    };

    onSendPoll(pollData);
    setQuestion('');
    setOptions(['', '']);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="w-full max-w-md glass-card rounded-3xl overflow-hidden sketch-border shadow-2xl bg-card/95 p-5 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
          <div className="flex items-center gap-2">
            <BarChart2 size={18} className="text-primary" />
            <h2 className="text-base font-heading font-bold">Create In-Chat Poll</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-card/60 text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground font-body block mb-1">Poll Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..."
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm font-body bg-card/40 sketch-border"
              maxLength={200}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-body block">Poll Options</label>
            {options.map((opt, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-3 py-2 rounded-xl glass-input text-xs font-body bg-card/40 sketch-border"
                  maxLength={100}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}

            {options.length < 8 && (
              <button
                type="button"
                onClick={addOption}
                className="w-full py-2 sketch-border rounded-xl text-xs font-heading font-bold text-primary hover:bg-card/40 flex items-center justify-center gap-1.5 transition-colors mt-1"
              >
                <Plus size={14} /> Add Option
              </button>
            )}
          </div>

          {/* Poll Settings */}
          <div className="pt-2 border-t border-foreground/10 space-y-2">
            <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-card/40">
              <span className="text-xs font-heading font-bold text-foreground">Anonymous Voting</span>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded accent-primary w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-card/40">
              <span className="text-xs font-heading font-bold text-foreground">Multiple Answers</span>
              <input
                type="checkbox"
                checked={allowMultiple}
                onChange={(e) => setAllowMultiple(e.target.checked)}
                className="rounded accent-primary w-4 h-4"
              />
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-xs font-heading font-bold hover:bg-card/40 sketch-border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl sketch-fill text-xs font-heading font-bold text-primary-foreground flex items-center justify-center gap-1.5"
            >
              <CheckSquare size={15} /> Launch Poll
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
