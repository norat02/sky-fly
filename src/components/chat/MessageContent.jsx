import React, { useState } from 'react';
import { Download, File, Play, Pause, BarChart2 } from 'lucide-react';
import MediaLightbox from './MediaLightbox';
import ViewOnceModal from './ViewOnceModal';
import TranslatedText from './TranslatedText';

export default function MessageContent({
  message,
  isMine,
  isOwn,
  isMe,
  onVotePoll,
  currentUserId,
  viewerLang,
  autoTranslate,
  manualTranslate,
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [viewOnceOpen, setViewOnceOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [hasViewedOnce, setHasViewedOnce] = useState(Boolean(message.is_viewed_once));

  const audioRef = React.useRef(null);
  const targetLanguage = viewerLang || 'en';
  const shouldTranslate = Boolean(manualTranslate || (autoTranslate && !isMine && !isOwn && !isMe));

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  // 1. WhatsApp-style View Once Media 1️⃣
  if (message.is_view_once) {
    return (
      <>
        <div
          onClick={() => {
            if (!hasViewedOnce) {
              setViewOnceOpen(true);
            }
          }}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl cursor-pointer transition-all sketch-border select-none ${
            hasViewedOnce
              ? 'opacity-60 bg-muted/30 cursor-not-allowed'
              : 'hover:scale-[1.02] bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
          }`}
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold font-mono text-xs border-2 border-current">
            1
          </div>
          <div>
            <p className="text-xs font-heading font-bold">
              {hasViewedOnce ? 'Opened Photo' : 'View Once Photo'}
            </p>
            <p className="text-[10px] opacity-80 font-body">
              {hasViewedOnce ? 'Already expired' : 'Tap to view once'}
            </p>
          </div>
        </div>

        {viewOnceOpen && (
          <ViewOnceModal
            isOpen={viewOnceOpen}
            onClose={() => {
              setViewOnceOpen(false);
              setHasViewedOnce(true);
            }}
            mediaUrl={message.media_url || message.file_url}
            caption={message.content}
            captionNode={message.content ? <TranslatedText text={message.content} targetLang={targetLanguage} enabled={shouldTranslate} /> : null}
          />
        )}
      </>
    );
  }

  // 2. Interactive Polls (Telegram / WhatsApp style)
  if (message.message_type === 'poll' || message.poll_data) {
    let poll = message.poll_data;
    if (typeof poll === 'string') {
      try {
        poll = JSON.parse(poll);
      } catch {
        poll = null;
      }
    }

    if (poll) {
      const totalVotes = (poll.options || []).reduce(
        (sum, opt) => sum + (opt.votes?.length || 0),
        0
      );

      return (
        <div className="space-y-2.5 py-1 min-w-[220px]">
              <div className="flex items-start gap-1.5 text-xs font-heading font-bold text-primary">
            <BarChart2 size={16} className="mt-0.5 shrink-0" />
            <TranslatedText text={poll.question} targetLang={targetLanguage} enabled={shouldTranslate} />
          </div>

          <div className="space-y-1.5">
            {poll.options.map((option, idx) => {
              const count = option.votes?.length || 0;
              const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
              const hasVoted = option.votes?.includes(currentUserId);

              return (
                <button
                  key={idx}
                  onClick={() => onVotePoll && onVotePoll(message.id, idx)}
                  className={`w-full relative overflow-hidden text-left p-2.5 rounded-xl border transition-all ${
                    hasVoted
                      ? 'border-primary bg-primary/10'
                      : 'border-foreground/15 hover:border-foreground/30 bg-card/30'
                  }`}
                >
                  {/* Progress bar fill */}
                  <div
                    className="absolute inset-0 bg-primary/15 transition-all duration-500 -z-0"
                    style={{ width: `${pct}%` }}
                  />

                  <div className="relative z-10 flex items-center justify-between text-xs font-body">
                    <div className="min-w-0 flex-1 pr-2 font-medium"><TranslatedText text={option.text} targetLang={targetLanguage} enabled={shouldTranslate} /></div>
                    <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                      {pct}% ({count})
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-[10px] text-muted-foreground font-mono text-right">
            {totalVotes} total {totalVotes === 1 ? 'vote' : 'votes'}
          </p>
        </div>
      );
    }
  }

  // 3. Voice Messages with Sketch Waveform Player
  if (message.message_type === 'voice' || message.voice_url) {
    const vUrl = message.voice_url || message.media_url || message.file_url;
    return (
      <div className="flex items-center gap-3 py-1 min-w-[180px]">
        <audio
          ref={audioRef}
          src={vUrl}
          onEnded={() => setIsPlayingAudio(false)}
          className="hidden"
        />
        <button
          type="button"
          onClick={togglePlayAudio}
          className="p-2.5 rounded-full sketch-fill text-primary-foreground shadow-md transition-transform active:scale-95 shrink-0"
        >
          {isPlayingAudio ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </button>

        <div className="flex-1">
          {/* Animated or static sound bars */}
          <div className="flex items-center gap-0.5 h-6">
            {[40, 70, 30, 90, 60, 100, 50, 80, 45, 65, 35, 75].map((h, i) => (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-200 ${
                  isPlayingAudio ? 'bg-primary animate-pulse' : 'bg-foreground/30'
                }`}
                style={{
                  height: `${h}%`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
          <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
            Voice Note {message.voice_duration ? `• ${message.voice_duration}s` : ''}
          </p>
        </div>
      </div>
    );
  }

  // 4. Image / Sketch / Photo
  if (message.file_type?.startsWith('image/') || message.media_url || message.is_doodle) {
    const imgUrl = message.media_url || message.file_url;
    return (
      <>
        <div className="space-y-1.5">
          <div
            onClick={() => setLightboxOpen(true)}
            className="relative rounded-2xl overflow-hidden cursor-pointer group sketch-border bg-black/10 max-w-sm"
          >
            <img
              src={imgUrl}
              alt={message.content || 'Image'}
              className="w-full max-h-72 object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
            {message.is_doodle && (
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-heading font-bold bg-black/60 text-white backdrop-blur-sm">
                ✏️ Doodle
              </span>
            )}
          </div>
          {message.content && !message.is_doodle && (
            <TranslatedText text={message.content} targetLang={targetLanguage} enabled={shouldTranslate} />
          )}
        </div>

        {lightboxOpen && (
          <MediaLightbox
            isOpen={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            mediaUrl={imgUrl}
            mediaType="image"
            caption={message.content}
            captionNode={message.content ? <TranslatedText text={message.content} targetLang={targetLanguage} enabled={shouldTranslate} /> : null}
          />
        )}
      </>
    );
  }

  // 5. Video Media
  if (message.file_type?.startsWith('video/')) {
    const videoUrl = message.media_url || message.file_url;
    return (
      <>
        <div className="space-y-1.5">
          <div
            onClick={() => setLightboxOpen(true)}
            className="relative rounded-2xl overflow-hidden cursor-pointer sketch-border max-w-sm"
          >
            <video src={videoUrl} className="w-full max-h-72 object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="p-3 rounded-full bg-black/60 text-white">
                <Play size={20} className="ml-0.5" />
              </div>
            </div>
          </div>
          {message.content && (
            <TranslatedText text={message.content} targetLang={targetLanguage} enabled={shouldTranslate} />
          )}
        </div>

        {lightboxOpen && (
          <MediaLightbox
            isOpen={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            mediaUrl={videoUrl}
            mediaType="video"
            caption={message.content}
            captionNode={message.content ? <TranslatedText text={message.content} targetLang={targetLanguage} enabled={shouldTranslate} /> : null}
          />
        )}
      </>
    );
  }

  // 6. Generic Files / Documents
  if (message.file_url) {
    return (
      <div className="flex items-center gap-3 p-2 rounded-xl bg-card/40 sketch-border">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
          <File size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-body font-medium truncate">
            {message.file_name || 'Document'}
          </p>
          <p className="text-[10px] text-muted-foreground font-mono">
            {message.file_size ? `${(message.file_size / 1024).toFixed(1)} KB` : 'File'}
          </p>
        </div>
        <a
          href={message.file_url}
          download={message.file_name || 'file'}
          target="_blank"
          rel="noreferrer"
          className="p-2 rounded-xl hover:bg-card/60 text-primary"
        >
          <Download size={16} />
        </a>
      </div>
    );
  }

  // 7. Regular Text Message
  return (
    <div className="space-y-1">
      <TranslatedText
        text={message.content || message.translated_text || ''}
        targetLang={targetLanguage}
        enabled={shouldTranslate}
      />

      {/* Legacy/pre-stored translation badge */}
      {message.translated_text && message.translated_text !== message.content && !shouldTranslate && (
        <span className="inline-block text-[10px] text-muted-foreground font-mono bg-card/30 px-1.5 py-0.5 rounded-md">
          Translated from {message.original_language || 'auto'}
        </span>
      )}
    </div>
  );
}
