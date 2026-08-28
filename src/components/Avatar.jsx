import { getInitials } from '@/lib/chat-utils';

export default function Avatar({ name, color, avatarUrl, size = 40 }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name || 'Avatar'}
        className="rounded-full object-cover shrink-0 select-none border-2 border-foreground/30 shadow-sm"
        style={{
          width: size,
          height: size,
        }}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full font-heading font-bold text-foreground shrink-0 select-none border-2 border-foreground shadow-sm"
      style={{
        width: size,
        height: size,
        background: color || 'linear-gradient(135deg, hsl(var(--card)), hsl(var(--muted)))',
        fontSize: Math.max(12, size * 0.38),
      }}
    >
      {getInitials(name)}
    </div>
  );
}
