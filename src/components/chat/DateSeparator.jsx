import { format } from 'date-fns';

export default function DateSeparator({ date }) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  let label;
  if (d.toDateString() === today.toDateString()) label = 'Today';
  else if (d.toDateString() === yesterday.toDateString()) label = 'Yesterday';
  else label = format(d, 'EEEE, MMM d');

  return (
    <div className="flex items-center gap-3 my-3">
      <div className="flex-1 h-0 border-t-2 border-dashed border-foreground/20" />
      <span className="text-xs text-muted-foreground font-body px-3 py-1 sketch-border rounded-lg bg-card/40 whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-0 border-t-2 border-dashed border-foreground/20" />
    </div>
  );
}