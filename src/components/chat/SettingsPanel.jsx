import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  X, Settings, Users, Trash2, AlertTriangle, Crown,
} from 'lucide-react';
import { LANGUAGES } from '@/lib/languages';

const MAX_OPTIONS = [2, 5, 10, 25, 50];

export default function SettingsPanel({ room, isOpen, onClose, onUpdate, onClearMessages, onEndRoom }) {
  const [roomName, setRoomName] = useState(room?.room_name || '');
  const [maxParticipants, setMaxParticipants] = useState(room?.max_participants || 2);
  const [allowFileSharing, setAllowFileSharing] = useState(room?.allow_file_sharing ?? true);
  const [allowNewJoins, setAllowNewJoins] = useState(room?.allow_new_joins ?? true);
  const [typingPreview, setTypingPreview] = useState(room?.typing_preview_visible ?? true);
  const [messageNotifs, setMessageNotifs] = useState(room?.message_notifications ?? true);
  const [roomLang, setRoomLang] = useState(room?.language || '');
  const [saving, setSaving] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate({
        room_name: roomName.trim(),
        max_participants: maxParticipants,
        allow_file_sharing: allowFileSharing,
        allow_new_joins: allowNewJoins,
        typing_preview_visible: typingPreview,
        message_notifications: messageNotifs,
        language: roomLang,
      });
      toast.success('Settings updated');
      onClose();
    } catch {
      toast.error('Failed to update settings');
    }
    setSaving(false);
  };

  const handleClearMessages = async () => {
    try {
      await onClearMessages();
      toast.success('All messages cleared');
      setConfirmClear(false);
    } catch {
      toast.error('Failed to clear messages');
    }
  };

  const handleEndRoom = async () => {
    try {
      await onEndRoom();
    } catch {
      toast.error('Failed to end room');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-md max-h-[85vh] overflow-y-auto scrollbar-thin z-50 glass-card p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                  <Settings size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Room Settings</h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Crown size={10} className="text-amber-500" /> Owner only
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/20 dark:hover:bg-white/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5">
              {/* Room Name */}
              <div>
                <label className="text-xs text-slate-400 dark:text-slate-500 mb-1.5 block font-medium">
                  Room name
                </label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Whisper Room"
                  maxLength={30}
                  className="w-full px-3 py-2.5 rounded-xl bg-card/30 sketch-border outline-none focus:border-primary transition-colors text-sm"
                />
              </div>

              {/* Max Participants */}
              <div>
                <label className="text-xs text-slate-400 dark:text-slate-500 mb-1.5 block font-medium flex items-center gap-1.5">
                  <Users size={12} /> Max participants
                </label>
                <div className="flex gap-2 flex-wrap">
                  {MAX_OPTIONS.map((n) => (
                    <button
                      key={n}
                      onClick={() => setMaxParticipants(n)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        maxParticipants === n
                          ? 'sketch-fill shadow-md'
                          : 'bg-card/30 hover:bg-white/40 dark:hover:bg-white/10'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room Language */}
              <div>
                <label className="text-xs text-slate-400 dark:text-slate-500 mb-1.5 block font-medium">
                  Room language
                </label>
                <select
                  value={roomLang}
                  onChange={(e) => setRoomLang(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-card/30 sketch-border outline-none text-sm"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
              </div>

              {/* Toggles */}
              <ToggleRow
                label="Allow file sharing"
                desc="Let participants upload files"
                value={allowFileSharing}
                onChange={setAllowFileSharing}
              />
              <ToggleRow
                label="Allow new joins"
                desc="New people can join with the link"
                value={allowNewJoins}
                onChange={setAllowNewJoins}
              />
              <ToggleRow
                label="Typing preview"
                desc="Show what others are typing"
                value={typingPreview}
                onChange={setTypingPreview}
              />
              <ToggleRow
                label="Join notifications"
                desc="Notify when someone joins"
                value={messageNotifs}
                onChange={setMessageNotifs}
              />

              {/* Danger Zone */}
              <div className="pt-4 border-t border-white/10 dark:border-white/5 space-y-2">
                <p className="text-xs uppercase tracking-widest text-red-400 dark:text-red-500 font-semibold flex items-center gap-1.5">
                  <AlertTriangle size={12} /> Danger Zone
                </p>

                {!confirmClear ? (
                  <button
                    onClick={() => setConfirmClear(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors text-sm font-medium text-red-500 dark:text-red-400"
                  >
                    <Trash2 size={16} /> Clear All Messages
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 space-y-2">
                    <p className="text-xs text-red-500 dark:text-red-400 text-center">
                      Delete ALL messages in this room?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmClear(false)}
                        className="flex-1 px-3 py-2 rounded-lg bg-card/30 hover:bg-white/30 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleClearMessages}
                        className="flex-1 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors text-sm font-medium text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}

                {!confirmEnd ? (
                  <button
                    onClick={() => setConfirmEnd(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors text-sm font-medium text-red-500 dark:text-red-400"
                  >
                    <AlertTriangle size={16} /> End Room
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 space-y-2">
                    <p className="text-xs text-red-500 dark:text-red-400 text-center">
                      Permanently end this room? All data will be deleted.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmEnd(false)}
                        className="flex-1 px-3 py-2 rounded-lg bg-card/30 hover:bg-white/30 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleEndRoom}
                        className="flex-1 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors text-sm font-medium text-white"
                      >
                        End Room
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Save */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl sketch-fill font-heading font-bold shadow-lg disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ToggleRow({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {desc && <p className="text-xs text-slate-400 dark:text-slate-500">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
          value ? 'bg-primary border-primary' : 'bg-transparent border-2 border-foreground'
        }`}
      >
        <motion.div
          animate={{ x: value ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={`absolute top-0.5 w-5 h-5 rounded-full shadow-md ${value ? 'bg-primary-foreground' : 'bg-foreground'}`}
        />
      </button>
    </div>
  );
}