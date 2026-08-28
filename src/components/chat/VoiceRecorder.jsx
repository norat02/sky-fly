import { useState, useRef, useEffect } from 'react';
import { Mic, X, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function VoiceRecorder({ onSend, disabled, onStateChange }) {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    onStateChange?.(recording);
  }, [recording, onStateChange]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        if (chunksRef.current.length === 0) return;
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], `voice-${Date.now()}.webm`, { type: 'audio/webm' });
        onSend(file);
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      toast.error('Microphone access denied');
    }
  };

  const stopRecording = (send) => {
    if (mediaRecorderRef.current) {
      if (!send) mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    if (timerRef.current) clearInterval(timerRef.current);
    setRecording(false);
    setDuration(0);
  };

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
  }, []);

  const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (recording) {
    return (
      <div className="flex items-center gap-2 w-full flex-1">
        <button onClick={() => stopRecording(false)} className="p-2.5 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors shrink-0" title="Cancel">
          <X size={20} />
        </button>
        <div className="flex-1 flex items-center gap-2 px-2 min-w-0">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span className="text-sm font-body text-muted-foreground tabular-nums shrink-0">{fmt(duration)}</span>
          <div className="flex-1 h-1.5 bg-foreground/10 rounded-full overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${Math.min(duration * 4, 100)}%` }} transition={{ ease: 'linear' }} />
          </div>
          <span className="text-xs text-muted-foreground font-body shrink-0 hidden sm:inline">Recording...</span>
        </div>
        <button onClick={() => stopRecording(true)} disabled={duration === 0} className="p-2.5 rounded-xl sketch-fill shrink-0 disabled:opacity-40" title="Send voice message">
          <Send size={18} />
        </button>
      </div>
    );
  }

  return (
    <button onClick={startRecording} disabled={disabled} className="p-2.5 rounded-xl hover:bg-card/40 transition-colors text-muted-foreground disabled:opacity-40 shrink-0" title="Voice message">
      <Mic size={20} />
    </button>
  );
}