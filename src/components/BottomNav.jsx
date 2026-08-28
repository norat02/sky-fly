import { NavLink } from 'react-router-dom';
import { MessageSquare, Disc, Radio, User } from 'lucide-react';

const items = [
  { to: '/', end: true, label: 'Chats', icon: MessageSquare },
  { to: '/status', label: 'Status', icon: Disc },
  { to: '/channels', label: 'Channels', icon: Radio },
  { to: '/profile', end: true, label: 'Profile', icon: User },
];

export default function BottomNav() {
  return (
    <nav className="app-bottom-nav fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around" aria-label="Primary navigation">
      {items.map(({ to, end, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `relative flex min-h-[3.25rem] flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[11px] font-semibold tracking-[-0.01em] ${
              isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={19} strokeWidth={isActive ? 2.6 : 2} />
              <span>{label}</span>
              {isActive && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-accent" aria-hidden="true" />}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
