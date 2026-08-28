import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Mic } from 'lucide-react';

const SPEED_OPTIONS = [1, 1.5, 2];

export default function VoicePlayer({ audioUrl, duration = 0, isOutgoing = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration || 0);
  const [speedIndex, setSpeedIndex] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setAudioDuration(Math.round(audio.duration));
      }
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [audioUrl]);

  const togglePlay = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.playbackRate = SPEED_OPTIONS[speedIndex];
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = (e) => {
    e.stopPropagation();
    const nextIdx = (speedIndex + 1) % SPEED_OPTIONS.length;
    setSpeedIndex(nextIdx);
    if (audioRef.current) {
      audioRef.current.playbackRate = SPEED_OPTIONS[nextIdx];
    }
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio || !audioDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const seekTo = pos * audioDuration;
    audio.currentTime = seekTo;
    setCurrentTime(seekTo);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  };

  // Generate 24 static waveform heights
  const bars = [40, 60, 25, 80, 50, 90, 30, 75, 45, 100, 65, 35, 70, 85, 40, 95, 60, 30, 80, 50, 65, 35, 55, 40];
  const progressPercent = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex items-center gap-2.5 p-2 rounded-2xl bg-card/40 sketch-border min-w-[220px] max-w-xs"
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 ${
          isOutgoing
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'bg-primary/20 text-primary hover:bg-primary/30'
        }`}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
      </button>

      {/* Waveform & Scrubber */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        <div
          onClick={handleSeek}
          className="h-6 flex items-center gap-0.5 cursor-pointer select-none"
          title="Click to seek"
        >
          {bars.map((height, i) => {
            const barProgress = (i / bars.length) * 100;
            const isPlayed = barProgress <= progressPercent;

            return (
              <span
                key={i}
                className={`w-1 rounded-full transition-colors ${
                  isPlayed ? 'bg-primary' : 'bg-foreground/20'
                }`}
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>

        {/* Timer */}
        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
          <span>{formatTime(isPlaying ? currentTime : audioDuration || 0)}</span>
          <span className="flex items-center gap-0.5">
            <Mic size={10} /> Voice note
          </span>
        </div>
      </div>

      {/* Speed Multiplier Pill */}
      <button
        onClick={handleSpeedChange}
        className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-foreground/10 hover:bg-foreground/20 text-foreground shrink-0 transition-colors"
        title="Toggle audio speed"
      >
        {SPEED_OPTIONS[speedIndex]}x
      </button>
    </div>
  );
}
