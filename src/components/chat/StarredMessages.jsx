import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { formatTime } from '@/lib/chat-utils';
import MessageContent from './MessageContent';

export default function StarredMessages({ messages, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card w-full max-w-md max-h-[75vh] flex flex-col p-5"
        >
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-lg font-heading font-bold flex items-center gap-2">
              <Star size={18} className="text-amber-500" fill="currentColor" /> Starred Messages
            </h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-card/40 text-muted-foreground">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Star size={36} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm font-body">No starred messages yet</p>
                <p className="text-xs font-body mt-1 opacity-70">Star important messages to find them here</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="p-3 sketch-border rounded-xl bg-card/40">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-body font-medium text-primary">{msg.sender_name}</span>
                    <span className="text-[10px] text-muted-foreground">{formatTime(msg.created_date)}</span>
                  </div>
                  <MessageContent message={msg} isMine={false} />
                </div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}