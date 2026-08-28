import { motion } from 'framer-motion';
import Avatar from '@/components/Avatar';

export default function TypingIndicator({ name, color, avatarUrl, text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex items-end gap-2"
    >
      {name && <Avatar name={name} color={color} avatarUrl={avatarUrl} size={32} />}
      <div className="px-4 py-2.5 rounded-2xl rounded-bl-md bg-card/70 sketch-border shadow-lg max-w-[75%] md:max-w-[65%]">
        {text ? (
          <p className="text-sm text-muted-foreground italic break-words leading-relaxed font-body">
            {text.slice(0, 120)}
            <span className="inline-block w-0.5 h-3.5 ml-0.5 bg-muted-foreground animate-pulse align-middle" />
          </p>
        ) : (
          <div className="flex items-center gap-1 py-0.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-muted-foreground"
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}