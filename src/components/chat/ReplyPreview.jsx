import { X } from 'lucide-react';

export default function ReplyPreview({ replyTo, onCancel }) {
  let reply;
  try { reply = JSON.parse(replyTo); } catch { return null; }
  if (!reply) return null;

  return (
    <div className="flex items-center gap-2 mb-2 px-3 py-2 sketch-border bg-card/40 rounded-xl">
      <div className="w-1 h-8 bg-primary rounded-full shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-body font-medium text-primary">{reply.name}</p>
        <p className="text-xs text-muted-foreground truncate">{reply.content}</p>
      </div>
      <button
        onClick={onCancel}
        className="p-1 rounded-lg hover:bg-card/40 text-muted-foreground shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}