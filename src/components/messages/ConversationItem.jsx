import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import Avatar from '@/components/Avatar';
import { formatRelativeTime } from '@/lib/chat-utils';

export default function ConversationItem({ convo, myName }) {
  const navigate = useNavigate();
  const { room, display } = convo;
  const preview = room.last_message_preview || 'Say hi 👋';
  const senderName = room.last_sender_name;
  const prefix = senderName === myName
    ? 'You: '
    : display.isGroup && senderName
    ? `${senderName.split(' ')[0]}: `
    : '';

  return (
    <button
      onClick={() => navigate(`/chat/${room.room_id}`)}
      className="w-full flex items-center gap-3 p-3 hover:bg-card/40 transition-colors text-left"
    >
      {display.isGroup ? (
        <div className="w-12 h-12 rounded-full sketch-border bg-card/50 flex items-center justify-center shrink-0">
          <Users size={22} />
        </div>
      ) : (
        <Avatar name={display.name} color={display.color} avatarUrl={display.avatar_url} size={48} />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-body font-medium truncate">{display.name}</p>
        <p className="text-xs text-muted-foreground truncate">{prefix}{preview}</p>
      </div>
      {room.last_message_at && (
        <span className="text-[10px] text-muted-foreground shrink-0 font-body">
          {formatRelativeTime(room.last_message_at)}
        </span>
      )}
    </button>
  );
}