import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCheck,
  Check,
  Copy,
  Trash2,
  SmilePlus,
  CornerUpLeft,
  Star,
  Pencil,
  Pin,
  Languages,
  Flame,
  Heart,
  Share2,
} from 'lucide-react';
import Avatar from '@/components/Avatar';
import { formatTime } from '@/lib/chat-utils';
import MessageContent from './MessageContent';
import ReactionPicker from './ReactionPicker';

export default function MessageBubble({
  message,
  isMine,
  showAvatar,
  onReact,
  onCopy,
  onDelete,
  onReply,
  onStar,
  onEdit,
  onPin,
  onForward,
  isOwner,
  currentUserId,
  viewerLang,
  autoTranslate,
  onVotePoll,
}) {
  const [showActions, setShowActions] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(message.content || '');
  const [manualTranslate, setManualTranslate] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const lastTapRef = useRef(0);

  let reactions = {};
  try {
    reactions = typeof message.reactions === 'string' ? JSON.parse(message.reactions || '{}') : message.reactions || {};
  } catch {
    reactions = {};
  }
  const reactionEntries = Object.entries(reactions).filter(([, users]) => Array.isArray(users) && users.length > 0);

  let reply = null;
  try {
    reply = message.reply_to ? (typeof message.reply_to === 'string' ? JSON.parse(message.reply_to) : message.reply_to) : null;
  } catch {
    reply = null;
  }

  const handleSaveEdit = () => {
    if (editText.trim() && editText.trim() !== message.content) {
      onEdit(message.id, editText.trim());
    }
    setEditing(false);
  };

  // Instagram-style double tap to like
  const handleDoubleTap = (e) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Trigger double tap heart
      setShowHeartBurst(true);
      if (onReact) {
        onReact(message, '❤️');
      }
      setTimeout(() => setShowHeartBurst(false), 900);
    }
    lastTapRef.current = now;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`group flex gap-2 items-end ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowPicker(false);
      }}
      onClick={handleDoubleTap}
    >
      {showAvatar && !isMine && (
        <Avatar
          name={message.sender_name}
          color={message.sender_avatar_color}
          avatarUrl={message.sender_avatar_url}
          size={32}
        />
      )}
      {!showAvatar && !isMine && <div className="w-8 shrink-0" />}
      {isMine && <div className="w-1 shrink-0" />}

      <div className={`max-w-[78%] md:max-w-[65%] flex flex-col ${isMine ? 'items-end' : 'items-start'} relative`}>
        {/* Pinned Marker */}
        {message.pinned && (
          <div className={`flex items-center gap-1 mb-1 text-[10px] text-primary ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
            <Pin size={10} className="rotate-45" fill="currentColor" /> Pinned
          </div>
        )}

        {/* Self-Destruct Burner Indicator (Telegram secret chat) */}
        {message.self_destruct > 0 && (
          <div className="flex items-center gap-1 mb-1 text-[10px] text-amber-500 font-mono font-bold">
            <Flame size={11} className="animate-pulse" /> Auto-burns in {message.self_destruct}s
          </div>
        )}

        {/* Quote Reply Preview */}
        {reply && (
          <div className="px-3 py-1.5 mb-1 text-xs sketch-border bg-card/30 rounded-xl border-l-2 border-primary max-w-full overflow-hidden">
            <p className="font-body font-bold text-primary truncate">{reply.name}</p>
            <p className="text-muted-foreground truncate">{reply.content}</p>
          </div>
        )}

        {/* Double-Tap Heart Burst Animation */}
        <AnimatePresence>
          {showHeartBurst && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 0 }}
              animate={{ scale: 1.6, opacity: 1, y: -20 }}
              exit={{ scale: 2, opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
            >
              <Heart size={44} className="fill-rose-500 text-rose-500 filter drop-shadow-md" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Content or Editor */}
        {editing ? (
          <div className="px-3 py-2 rounded-2xl shadow-lg sketch-border bg-card/90 w-full">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              autoFocus
              rows={2}
              className="w-full bg-transparent outline-none text-sm font-body resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveEdit();
                }
                if (e.key === 'Escape') setEditing(false);
              }}
            />
            <div className="flex items-center gap-2 justify-end mt-1">
              <button
                onClick={() => setEditing(false)}
                className="px-2 py-1 text-xs rounded-lg hover:bg-card/40 text-muted-foreground font-body"
              >
                Cancel
              </button>
              <button onClick={handleSaveEdit} className="px-2 py-1 text-xs rounded-lg sketch-fill font-body">
                Save
              </button>
            </div>
          </div>
        ) : (
          <MessageContent
            message={message}
            isMine={isMine}
            viewerLang={viewerLang}
            autoTranslate={autoTranslate}
            manualTranslate={manualTranslate}
            currentUserId={currentUserId}
            onVotePoll={onVotePoll}
          />
        )}

        {/* Reactions List */}
        {reactionEntries.length > 0 && (
          <div className={`flex gap-1 flex-wrap mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
            {reactionEntries.map(([emoji, users]) => (
              <button
                key={emoji}
                onClick={() => onReact(message, emoji)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs sketch-border transition-colors ${
                  users.includes(currentUserId) ? 'bg-primary/20 border-primary' : 'bg-card/50'
                }`}
              >
                <span>{emoji}</span>
                <span className="font-body text-[11px]">{users.length}</span>
              </button>
            ))}
          </div>
        )}

        {/* Actions Bar */}
        <AnimatePresence>
          {showActions && !editing && (
            <motion.div
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              className={`flex items-center gap-0.5 mt-1 relative ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <button
                onClick={() => setShowPicker(!showPicker)}
                className="p-1 rounded-lg hover:bg-card/40 text-muted-foreground transition-colors"
                title="React"
              >
                <SmilePlus size={14} />
              </button>
              <button
                onClick={() => onReply(message)}
                className="p-1 rounded-lg hover:bg-card/40 text-muted-foreground transition-colors"
                title="Reply"
              >
                <CornerUpLeft size={14} />
              </button>
              <button
                onClick={() => onCopy(message.content)}
                className="p-1 rounded-lg hover:bg-card/40 text-muted-foreground transition-colors"
                title="Copy"
              >
                <Copy size={14} />
              </button>
              {message.message_type === 'text' && message.content && (
                <button
                  onClick={() => setManualTranslate((v) => !v)}
                  className={`p-1 rounded-lg hover:bg-card/40 transition-colors ${
                    manualTranslate ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  title="Translate"
                >
                  <Languages size={14} />
                </button>
              )}
              <button
                onClick={() => onStar(message)}
                className={`p-1 rounded-lg hover:bg-card/40 transition-colors ${
                  message.starred ? 'text-amber-500' : 'text-muted-foreground'
                }`}
                title="Star"
              >
                <Star size={14} fill={message.starred ? 'currentColor' : 'none'} />
              </button>
              {onForward && (
                <button
                  onClick={() => onForward(message)}
                  className="p-1 rounded-lg hover:bg-card/40 text-muted-foreground transition-colors"
                  title="Forward"
                >
                  <Share2 size={14} />
                </button>
              )}
              {isMine && message.message_type === 'text' && (
                <button
                  onClick={() => {
                    setEditText(message.content || '');
                    setEditing(true);
                  }}
                  className="p-1 rounded-lg hover:bg-card/40 text-muted-foreground transition-colors"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
              )}
              {isMine && (
                <button
                  onClick={() => onDelete(message.id)}
                  className="p-1 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              )}
              {isOwner && (
                <button
                  onClick={() => onPin(message)}
                  className={`p-1 rounded-lg hover:bg-card/40 transition-colors ${
                    message.pinned ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  title="Pin"
                >
                  <Pin size={14} />
                </button>
              )}

              <AnimatePresence>
                {showPicker && (
                  <ReactionPicker
                    onSelect={(emoji) => {
                      onReact(message, emoji);
                      setShowPicker(false);
                    }}
                    onClose={() => setShowPicker(false)}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Timestamp & Seen Receipts */}
        <div
          className={`flex items-center gap-1.5 mt-0.5 px-1 text-[10px] text-muted-foreground ${
            isMine ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          <span>{formatTime(message.created_date || message.created_at)}</span>
          {message.edited && <span className="italic opacity-70">edited</span>}
          {message.starred && <Star size={10} className="text-amber-500" fill="currentColor" />}
          {isMine && message.seen && (
            <span className="flex items-center gap-0.5 text-primary">
              <CheckCheck size={12} />
              <span>Seen</span>
            </span>
          )}
          {isMine && !message.seen && <Check size={12} className="text-muted-foreground/50" />}
        </div>
      </div>
    </motion.div>
  );
}
