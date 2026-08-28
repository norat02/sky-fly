import React, { useState } from 'react';
import { BarChart2, Check, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function PollCard({ poll, currentUserId, onVote }) {
  const [localPoll, setLocalPoll] = useState(poll);

  if (!localPoll) return null;

  const totalVotes = localPoll.options.reduce((acc, opt) => acc + (opt.votes?.length || 0), 0);
  const hasUserVoted = localPoll.options.some((opt) => opt.votes?.includes(currentUserId));

  const handleVoteOption = (optionId) => {
    if (!currentUserId) {
      toast.error('Sign in to vote');
      return;
    }

    const updatedOptions = localPoll.options.map((opt) => {
      let votes = [...(opt.votes || [])];
      const isThisOption = opt.id === optionId;
      const alreadyVotedThis = votes.includes(currentUserId);

      if (localPoll.allow_multiple) {
        if (isThisOption) {
          if (alreadyVotedThis) {
            votes = votes.filter((id) => id !== currentUserId);
          } else {
            votes.push(currentUserId);
          }
        }
      } else {
        // Single choice
        if (isThisOption) {
          if (!alreadyVotedThis) {
            votes.push(currentUserId);
          }
        } else {
          votes = votes.filter((id) => id !== currentUserId);
        }
      }
      return { ...opt, votes };
    });

    const updatedPoll = { ...localPoll, options: updatedOptions };
    setLocalPoll(updatedPoll);
    if (onVote) {
      onVote(updatedPoll);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-2xl p-3.5 bg-card/60 sketch-border shadow-sm space-y-3">
      {/* Poll Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 text-primary">
          <BarChart2 size={16} />
          <span className="text-[11px] font-heading font-bold uppercase tracking-wider">
            {localPoll.is_anonymous ? 'Anonymous Poll' : 'Public Poll'}
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
          <Users size={12} /> {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
        </span>
      </div>

      <h4 className="text-sm font-heading font-bold text-foreground leading-snug">{localPoll.question}</h4>

      {/* Options List */}
      <div className="space-y-2 pt-1">
        {localPoll.options.map((opt) => {
          const voteCount = opt.votes?.length || 0;
          const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          const isSelected = opt.votes?.includes(currentUserId);

          return (
            <button
              key={opt.id}
              onClick={() => handleVoteOption(opt.id)}
              className={`w-full text-left p-2.5 rounded-xl sketch-border transition-all relative overflow-hidden group ${
                isSelected ? 'bg-primary/15 border-primary ring-1 ring-primary/30' : 'bg-card/40 hover:bg-card/70'
              }`}
            >
              {/* Animated Progress Bar background */}
              {hasUserVoted && (
                <div
                  className="absolute inset-y-0 left-0 bg-primary/20 transition-all duration-500 rounded-lg pointer-events-none"
                  style={{ width: `${percentage}%` }}
                />
              )}

              <div className="relative z-10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className={`w-4 h-4 rounded-${localPoll.allow_multiple ? 'md' : 'full'} border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/60'
                    }`}
                  >
                    {isSelected && <Check size={11} className="stroke-[3]" />}
                  </div>
                  <span className="text-xs font-body font-medium text-foreground truncate">{opt.text}</span>
                </div>

                {hasUserVoted && (
                  <span className="text-xs font-mono font-bold text-foreground/80 shrink-0">
                    {percentage}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-[10px] text-muted-foreground font-body text-right">
        {localPoll.allow_multiple ? 'Select one or more answers' : 'Select one answer'}
      </div>
    </div>
  );
}
