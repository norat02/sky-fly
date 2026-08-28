import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MessageSearch({ query, onQueryChange, onClose, resultCount }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="px-4 py-2.5 border-b border-foreground/20 flex items-center gap-2 bg-card/30">
        <Search size={16} className="text-muted-foreground shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search messages..."
          autoFocus
          className="flex-1 bg-transparent outline-none text-sm font-body placeholder:text-muted-foreground/50 min-w-0"
        />
        {query && resultCount !== undefined && (
          <span className="text-xs text-muted-foreground font-body shrink-0 whitespace-nowrap">
            {resultCount} {resultCount === 1 ? 'match' : 'matches'}
          </span>
        )}
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-card/40 text-muted-foreground shrink-0">
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
}