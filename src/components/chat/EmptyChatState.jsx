import { motion } from 'framer-motion';
import { UserPlus, MessageCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function EmptyChatState({ roomId, isWaiting }) {
  const copyLink = () => {
    const url = `${window.location.origin}/chat/${roomId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  if (isWaiting) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-2xl sketch-fill flex items-center justify-center mb-6"
        >
          <UserPlus size={32} />
        </motion.div>
        <h2 className="text-xl font-heading font-bold mb-2">Waiting for someone to join</h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-xs font-body">
          Share the room link below with anyone you want to chat with
        </p>
        <button
          onClick={copyLink}
          className="flex items-center gap-2 px-5 py-2.5 sketch-fill rounded-xl text-sm font-heading font-bold"
        >
          <Copy size={16} /> Copy Room Link
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-16 h-16 rounded-2xl bg-card/50 flex items-center justify-center mb-4 sketch-border"
      >
        <MessageCircle size={28} className="text-primary" />
      </motion.div>
      <h2 className="text-lg font-heading font-bold mb-1">No messages yet</h2>
      <p className="text-muted-foreground text-sm font-body">
        Send the first message to start the conversation
      </p>
    </div>
  );
}