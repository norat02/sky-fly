import { toast } from 'sonner';
import {
  X, Copy, Share2, LogOut, Clock, Settings, Users, Crown,
  Star, Bookmark, Image as ImageIcon,
} from 'lucide-react';
import Avatar from '@/components/Avatar';
import { saveRoom } from '@/lib/chat-utils';

export default function RoomInfo({
  room, roomId, participant, participants, isOwner, messages,
  onLeave, onClose, onOpenSettings, onShowStarred, starredCount,
}) {
  const copyLink = () => {
    const url = `${window.location.origin}/chat/${roomId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const shareLink = async () => {
    const url = `${window.location.origin}/chat/${roomId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Join my chat room', text: 'Let\'s chat anonymously', url });
      } catch { /* cancelled */ }
    } else {
      copyLink();
    }
  };

  const handleSaveRoom = () => {
    saveRoom(roomId, room?.room_name || '');
    toast.success('Room saved! Find it on the home page.');
  };

  const onlineCount = participants.filter((p) => p.online).length;
  const mediaMessages = messages?.filter((m) => m.message_type === 'image' && m.file_url) || [];

  return (
    <div className="glass-card h-full flex flex-col p-5 overflow-y-auto scrollbar-thin">
      {onClose && (
        <button onClick={onClose} className="md:hidden self-end p-1.5 rounded-lg hover:bg-card/40 transition-colors mb-2">
          <X size={20} />
        </button>
      )}

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">
              {(room?.room_name || 'W').charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-lg font-heading font-bold">{room?.room_name || 'Whisper Room'}</h2>
        </div>
        <p className="text-xs text-muted-foreground font-mono truncate">{roomId}</p>
      </div>

      <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
        <Users size={14} />
        <span>{participants.length} / {room?.max_participants || 2} joined</span>
        <span className="w-1 h-1 rounded-full bg-muted-foreground" />
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          {onlineCount} online
        </span>
      </div>

      <div className="space-y-2 mb-6">
        <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">Participants</h3>
        {participants.map((p) => {
          const isMe = p.participant_id === participant?.id;
          return (
            <div key={p.id} className="flex items-center gap-3">
              <div className="relative shrink-0">
                <Avatar name={p.name} color={p.avatar_color} avatarUrl={p.avatar_url} size={36} />
                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card ${p.online ? 'bg-green-500' : 'bg-muted-foreground'}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate font-body">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.online ? 'Online' : 'Offline'}</p>
              </div>
              {p.is_owner && (
                <span className="flex items-center gap-1 text-[10px] text-amber-500 px-1.5 py-0.5 rounded-full bg-amber-500/10">
                  <Crown size={10} /> Owner
                </span>
              )}
              {isMe && !p.is_owner && (
                <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full bg-card/40">You</span>
              )}
            </div>
          );
        })}
        {participants.length === 0 && (
          <p className="text-xs text-muted-foreground italic">Loading participants...</p>
        )}
      </div>

      {mediaMessages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2 flex items-center gap-1">
            <ImageIcon size={12} /> Shared Media
          </h3>
          <div className="grid grid-cols-3 gap-1.5">
            {mediaMessages.slice(0, 9).map((m) => (
              <a key={m.id} href={m.file_url} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-lg overflow-hidden sketch-border">
                <img src={m.file_url} alt={m.file_name || 'media'} className="w-full h-full object-cover" />
              </a>
            ))}
          </div>
        </div>
      )}

      {room?.created_date && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Clock size={12} />
          <span>Created {new Date(room.created_date).toLocaleDateString()}</span>
        </div>
      )}

      <div className="space-y-2 mt-auto">
        {isOwner && (
          <button onClick={onOpenSettings}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-colors text-sm font-medium font-body">
            <Settings size={16} /> Room Settings
          </button>
        )}
        {onShowStarred && (
          <button onClick={onShowStarred}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card/40 hover:bg-card/60 transition-colors text-sm font-medium font-body">
            <Star size={16} /> Starred ({starredCount || 0})
          </button>
        )}
        <button onClick={handleSaveRoom}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card/40 hover:bg-card/60 transition-colors text-sm font-medium font-body">
          <Bookmark size={16} /> Save Room
        </button>
        <button onClick={copyLink}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card/40 hover:bg-card/60 transition-colors text-sm font-medium font-body">
          <Copy size={16} /> Copy Link
        </button>
        <button onClick={shareLink}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card/40 hover:bg-card/60 transition-colors text-sm font-medium font-body">
          <Share2 size={16} /> Share
        </button>
        <button onClick={onLeave}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors text-sm font-medium text-red-500 dark:text-red-400 font-body">
          <LogOut size={16} /> Leave Room
        </button>
      </div>
    </div>
  );
}