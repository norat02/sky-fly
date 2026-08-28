import { motion } from 'framer-motion';

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🔥', '👏'];

export default function ReactionPicker({ onSelect, onClose }) {
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 5, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 5, scale: 0.9 }}
        transition={{ duration: 0.15 }}
        className="flex gap-1 p-2 bg-card/90 backdrop-blur-xl sketch-border rounded-2xl shadow-xl z-40 absolute bottom-full mb-1 left-0"
      >
        {QUICK_REACTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className="text-xl p-1.5 rounded-lg hover:bg-foreground/10 transition-transform hover:scale-125 active:scale-95"
          >
            {emoji}
          </button>
        ))}
      </motion.div>
    </>
  );
}