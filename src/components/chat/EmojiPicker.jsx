import { motion } from 'framer-motion';

const EMOJIS = [
  '😀', '😂', '🥰', '😍', '😎', '🤔', '😴', '🥳',
  '😭', '😡', '🤯', '😱', '👍', '👎', '👏', '🙌',
  '🤝', '👋', '🙏', '💪', '🫶', '💯', '🔥', '✨',
  '🎉', '⭐', '🌟', '⚡', '🌈', '❤️', '💔', '💜',
  '💙', '💚', '🍕', '🍔', '🍟', '🍿', '☕', '🍺',
  '🎁', '🎈', '🎵', '🎶', '📸', '💬', '🤗', '🤫',
];

export default function EmojiPicker({ onSelect, onClose }) {
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="absolute bottom-full mb-3 left-2 right-2 p-3 bg-card/80 backdrop-blur-2xl sketch-border rounded-2xl shadow-2xl z-40"
      >
        <div className="grid grid-cols-8 gap-1">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onSelect(emoji)}
              className="text-2xl p-1.5 rounded-lg hover:bg-foreground/10 transition-colors hover:scale-125 active:scale-95"
            >
              {emoji}
            </button>
          ))}
        </div>
      </motion.div>
    </>
  );
}