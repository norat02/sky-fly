import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Send,
  Paperclip,
  Smile,
  X,
  Volume2,
  VolumeX,
  Flame,
  Clock,
  Sparkles,
  BarChart2,
  Eye,
  PenTool,
  Image as ImageIcon,
} from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';
import EmojiPicker from './EmojiPicker';
import DoodleModal from './DoodleModal';
import PollModal from './PollModal';
import ScheduledMessageModal from './ScheduledMessageModal';

export default function ChatInput({
  onSend,
  onTyping,
  onFileUpload,
  onVoiceMessage,
  disabled,
  uploading,
  allowFiles,
  replyingTo,
  onReplyCancel,
  isVanishMode = false,
  selfDestructTimer = 0,
  onSetSelfDestructTimer,
}) {
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [isSilent, setIsSilent] = useState(false); // Telegram silent message
  const [isViewOnce, setIsViewOnce] = useState(false); // WhatsApp view-once photo
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  // Advanced features modals
  const [showDoodleModal, setShowDoodleModal] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showBurnerMenu, setShowBurnerMenu] = useState(false);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed, replyingTo, {
      silent: isSilent,
      viewOnce: isViewOnce,
      selfDestruct: selfDestructTimer,
      isVanish: isVanishMode,
    });

    setText('');
    setIsViewOnce(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    setText(val);
    onTyping(val);

    // Auto-resize
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }
  };

  const handleEmojiSelect = (emoji) => {
    const updated = text + emoji;
    setText(updated);
    onTyping(updated);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file, { viewOnce: isViewOnce, selfDestruct: selfDestructTimer });
      setIsViewOnce(false);
    }
    e.target.value = '';
    setShowAttachmentMenu(false);
  };

  const handleDoodleSave = async (file) => {
    onFileUpload(file, { isDoodle: true, viewOnce: isViewOnce, selfDestruct: selfDestructTimer });
    setShowDoodleModal(false);
  };

  const handleCreatePoll = (pollData) => {
    onSend(pollData.question, replyingTo, {
      messageType: 'poll',
      pollData,
    });
    setShowPollModal(false);
  };

  const handleScheduleSend = (scheduledTime, scheduleText) => {
    toast.success(`Message scheduled for ${scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ⏰`);
    setShowScheduleModal(false);
  };

  return (
    <div className="relative">
      {/* Reply banner */}
      <AnimatePresence>
        {replyingTo && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="flex items-center justify-between px-4 py-2 mb-2 bg-card/60 sketch-border rounded-xl border-l-4 border-primary"
          >
            <div className="text-xs truncate">
              <span className="font-heading font-bold text-primary">{replyingTo.name}: </span>
              <span className="text-muted-foreground font-body">{replyingTo.content}</span>
            </div>
            <button onClick={onReplyCancel} className="p-1 rounded-lg hover:bg-card/40 text-muted-foreground">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vanish / Self-Destruct Active Banner */}
      {(isVanishMode || selfDestructTimer > 0) && (
        <div className="flex items-center justify-between px-3 py-1.5 mb-2 bg-amber-500/10 sketch-border border-amber-500/30 rounded-xl text-xs text-amber-500 font-body">
          <div className="flex items-center gap-1.5 font-heading font-bold">
            <Flame size={14} className="animate-pulse" />
            {isVanishMode
              ? 'Vanish Mode ON (Ephemeral)'
              : `Auto-burn active (${selfDestructTimer}s)`}
          </div>
          {onSetSelfDestructTimer && (
            <button
              onClick={() => onSetSelfDestructTimer(0)}
              className="text-[11px] underline opacity-80 hover:opacity-100"
            >
              Reset
            </button>
          )}
        </div>
      )}

      {/* Main input container */}
      <div className="flex min-w-0 items-end gap-1 rounded-2xl border border-foreground/10 bg-card/75 p-1 shadow-sm sm:gap-1.5 sm:rounded-3xl sm:p-1.5">
        {/* Attachment menu trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            disabled={disabled}
            className={`p-2.5 rounded-2xl transition-all ${
              showAttachmentMenu
                ? 'bg-primary text-primary-foreground rotate-45'
                : 'hover:bg-card/50 text-muted-foreground'
            }`}
            title="Attach Files, Doodles, Polls"
          >
            <Paperclip size={18} />
          </button>

          {/* Attachment Popup Menu */}
          <AnimatePresence>
            {showAttachmentMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: -8 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute bottom-full left-0 mb-2 w-52 glass-card rounded-2xl sketch-border shadow-2xl p-2 z-50 space-y-1 bg-card/95"
              >
                {/* Photo / Media */}
                <button
                  type="button"
                  onClick={() => {
                    imageInputRef.current?.click();
                    setShowAttachmentMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-body rounded-xl hover:bg-card/40 transition-colors text-left"
                >
                  <ImageIcon size={16} className="text-blue-500" /> Photo & Video
                </button>

                {/* Doodle Pad */}
                <button
                  type="button"
                  onClick={() => {
                    setShowDoodleModal(true);
                    setShowAttachmentMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-body rounded-xl hover:bg-card/40 transition-colors text-left"
                >
                  <PenTool size={16} className="text-pink-500" /> Sketch Doodle Pad
                </button>

                {/* Create Poll */}
                <button
                  type="button"
                  onClick={() => {
                    setShowPollModal(true);
                    setShowAttachmentMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-body rounded-xl hover:bg-card/40 transition-colors text-left"
                >
                  <BarChart2 size={16} className="text-emerald-500" /> Create Poll
                </button>

                {/* Schedule Message */}
                <button
                  type="button"
                  onClick={() => {
                    setShowScheduleModal(true);
                    setShowAttachmentMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-body rounded-xl hover:bg-card/40 transition-colors text-left"
                >
                  <Clock size={16} className="text-amber-500" /> Schedule Message
                </button>

                {/* File input */}
                {allowFiles && (
                  <button
                    type="button"
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowAttachmentMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-body rounded-xl hover:bg-card/40 transition-colors text-left"
                  >
                    <Sparkles size={16} className="text-purple-500" /> Document / Audio
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Text Input Area */}
        <div className="flex-1 min-w-0 py-1">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={
              isVanishMode
                ? '👻 Vanish mode message...'
                : 'Write a sketchbook message...'
            }
            disabled={disabled}
            rows={1}
            className="max-h-32 w-full resize-none bg-transparent px-1 py-1.5 text-sm outline-none placeholder:text-muted-foreground/60 scrollbar-none"
          />
        </div>

        {/* Emoji trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmoji(!showEmoji)}
            disabled={disabled}
            className={`p-2.5 rounded-2xl transition-colors ${
              showEmoji ? 'text-primary bg-primary/10' : 'hover:bg-card/50 text-muted-foreground'
            }`}
            title="Add Emoji"
          >
            <Smile size={18} />
          </button>
          <AnimatePresence>
            {showEmoji && (
              <EmojiPicker
                onSelect={handleEmojiSelect}
                onClose={() => setShowEmoji(false)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* View Once 1️⃣ Trigger (WhatsApp / Instagram style) */}
        <button
          type="button"
          onClick={() => {
            const next = !isViewOnce;
            setIsViewOnce(next);
            toast.success(next ? '1️⃣ View-Once Media Mode active' : 'View-Once deactivated');
          }}
className={`hidden p-2.5 rounded-2xl transition-all sm:block ${
              isViewOnce
              ? 'bg-amber-500 text-white font-bold font-mono text-xs scale-105'
              : 'hover:bg-card/50 text-muted-foreground'
          }`}
          title={isViewOnce ? 'View-Once photo enabled' : 'Set as View-Once photo'}
        >
          <Eye size={17} />
        </button>

        {/* Silent Message Toggle (Telegram) */}
        <button
          type="button"
          onClick={() => {
            const next = !isSilent;
            setIsSilent(next);
            toast.success(next ? '🔕 Silent message (no notification buzz)' : 'Normal message notification');
          }}
          className={`hidden p-2.5 rounded-2xl transition-colors sm:block ${
            isSilent ? 'bg-primary/20 text-primary' : 'hover:bg-card/50 text-muted-foreground'
          }`}
          title={isSilent ? 'Silent Mode On' : 'Send Silently'}
        >
          {isSilent ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </button>

        {/* Burner Timer Toggle (Telegram Secret Chat) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowBurnerMenu(!showBurnerMenu)}
            className={`p-2.5 rounded-2xl transition-colors ${
              selfDestructTimer > 0 ? 'bg-amber-500 text-white' : 'hover:bg-card/50 text-muted-foreground'
            }`}
            title="Auto Self-Destruct Timer"
          >
            <Flame size={17} />
          </button>

          {showBurnerMenu && (
            <div className="absolute bottom-full right-0 mb-2 p-2 glass-card rounded-2xl sketch-border shadow-xl w-40 z-50 bg-card/95 space-y-1">
              <p className="text-[10px] font-heading font-bold text-muted-foreground px-2 py-1">
                Self-Destruct Timer
              </p>
              {[0, 5, 10, 30, 60].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    if (onSetSelfDestructTimer) onSetSelfDestructTimer(sec);
                    setShowBurnerMenu(false);
                    toast.success(sec === 0 ? 'Timer turned off' : `Self-destruct in ${sec}s`);
                  }}
                  className={`w-full text-left px-2 py-1 text-xs rounded-xl font-mono ${
                    selfDestructTimer === sec ? 'sketch-fill text-primary-foreground' : 'hover:bg-card/40'
                  }`}
                >
                  {sec === 0 ? 'Off' : `${sec} seconds`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Send button or Voice recorder */}
        {text.trim() ? (
          <motion.button
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={handleSubmit}
            disabled={disabled}
            className="p-2.5 rounded-2xl sketch-fill text-primary-foreground shadow-md transition-transform"
            title="Send"
          >
            <Send size={18} />
          </motion.button>
        ) : (
          <VoiceRecorder
            onRecordingComplete={(file, duration) =>
              onVoiceMessage(file, duration, {
                viewOnce: isViewOnce,
                selfDestruct: selfDestructTimer,
                isVanish: isVanishMode,
              })
            }
            disabled={disabled || uploading}
          />
        )}
      </div>

      {/* In-Chat Doodle Modal */}
      {showDoodleModal && (
        <DoodleModal
          isOpen={showDoodleModal}
          onClose={() => setShowDoodleModal(false)}
          onSave={handleDoodleSave}
        />
      )}

      {/* In-Chat Poll Modal */}
      {showPollModal && (
        <PollModal
          isOpen={showPollModal}
          onClose={() => setShowPollModal(false)}
          onCreatePoll={handleCreatePoll}
        />
      )}

      {/* Scheduled Message Modal */}
      {showScheduleModal && (
        <ScheduledMessageModal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          onSchedule={handleScheduleSend}
          initialText={text}
        />
      )}
    </div>
  );
}
