import { Pin, X } from 'lucide-react';

export default function PinnedMessages({ pinnedMessages, onUnpin }) {
  if (!pinnedMessages || pinnedMessages.length === 0) return null;

  return (
    <div className="px-4 py-2 border-b border-foreground/20 bg-card/30 max-h-32 overflow-y-auto scrollbar-thin">
      {pinnedMessages.map((msg) => (
        <div key={msg.id} className="flex items-start gap-2 py-1">
          <Pin size={14} className="text-primary shrink-0 mt-0.5 rotate-45" fill="currentColor" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-body font-medium text-primary truncate">{msg.sender_name}</p>
            <p className="text-sm text-muted-foreground truncate">{msg.content || msg.file_name || 'Media message'}</p>
          </div>
          {onUnpin && (
            <button onClick={() => onUnpin(msg.id)} className="p-0.5 rounded hover:bg-card/40 text-muted-foreground shrink-0 mt-0.5">
              <X size={12} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}