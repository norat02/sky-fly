import { useState, useEffect } from 'react';
import { Bookmark, X, ArrowRight } from 'lucide-react';
import { getSavedRooms, removeSavedRoom } from '@/lib/chat-utils';

export default function SavedRooms({ onJoin }) {
  const [rooms, setRooms] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setRooms(getSavedRooms());
  }, []);

  const handleRemove = (roomId) => {
    removeSavedRoom(roomId);
    setRooms(getSavedRooms());
  };

  if (rooms.length === 0) return null;

  const display = showAll ? rooms : rooms.slice(0, 3);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-body flex items-center gap-1.5">
          <Bookmark size={12} /> Saved Rooms
        </h3>
        {rooms.length > 3 && (
          <button onClick={() => setShowAll(!showAll)} className="text-xs text-muted-foreground hover:text-foreground transition-colors font-body">
            {showAll ? 'Show less' : `Show all (${rooms.length})`}
          </button>
        )}
      </div>
      <div className="space-y-2">
        {display.map((r) => (
          <div key={r.room_id} className="flex items-center gap-2 p-2.5 sketch-border rounded-xl bg-card/30 hover:bg-card/50 transition-colors group">
            <button onClick={() => onJoin(r.room_id)} className="flex-1 flex items-center gap-2 text-left min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                {(r.room_name || 'W').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-body truncate">{r.room_name || 'Whisper Room'}</p>
                <p className="text-xs text-muted-foreground font-mono truncate">{r.room_id.slice(0, 12)}...</p>
              </div>
            </button>
            <button onClick={() => handleRemove(r.room_id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
              <X size={14} />
            </button>
            <ArrowRight size={16} className="text-muted-foreground shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}