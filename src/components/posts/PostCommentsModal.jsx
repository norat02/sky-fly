import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Trash2, MessageCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Avatar from '@/components/Avatar';
import { getLocalProfile, formatRelativeTime } from '@/lib/chat-utils';
import { db } from '@/api/base44Client';

export default function PostCommentsModal({ post, isOpen, onClose, onCommentCountChanged }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const me = getLocalProfile();

  const loadComments = useCallback(async () => {
    if (!post?.id) return;
    try {
      const list = await db.entities.Comment.filter({ post_id: post.id }, 'created_at', 100);
      // Fetch profile data for each comment author
      const enriched = await Promise.all(
        list.map(async (c) => {
          try {
            const author = await db.entities.Profile.get(c.user_id);
            return {
              ...c,
              author_username: author?.username || 'user',
              author_name: author?.display_name || author?.username || 'User',
              author_avatar_color: author?.avatar_color,
              author_avatar_url: author?.avatar_url,
            };
          } catch {
            return c;
          }
        })
      );
      setComments(enriched);
      if (onCommentCountChanged) onCommentCountChanged(enriched.length);
    } catch (err) {
      console.warn('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  }, [post?.id, onCommentCountChanged]);

  useEffect(() => {
    if (isOpen && post?.id) {
      setLoading(true);
      loadComments();

      // Subscribe to real-time comments on this post
      const unsub = db.entities.Comment.subscribe((event) => {
        if (event.data?.post_id === post.id) {
          loadComments();
        }
      });
      return unsub;
    }
  }, [isOpen, post?.id, loadComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !me || submitting) return;

    setSubmitting(true);
    const text = newComment.trim();
    setNewComment('');

    try {
      await db.entities.Comment.create({
        post_id: post.id,
        user_id: me.id || me.profile_id,
        content: text,
      });

      // Send notification to post author if not self
      if (post.user_id && post.user_id !== (me.id || me.profile_id)) {
        await db.entities.Notification.create({
          recipient_id: post.user_id,
          actor_id: me.id || me.profile_id,
          type: 'comment',
          text: `commented: "${text.slice(0, 30)}${text.length > 30 ? '...' : ''}"`,
          post_id: post.id,
        }).catch(() => {});
      }

      await loadComments();
      toast.success('Comment posted');
    } catch (err) {
      console.error('Failed to post comment:', err);
      toast.error('Failed to post comment');
      setNewComment(text);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await db.entities.Comment.delete(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      if (onCommentCountChanged) onCommentCountChanged(Math.max(0, comments.length - 1));
      toast.success('Comment removed');
    } catch (err) {
      console.error('Failed to delete comment:', err);
      toast.error('Failed to delete comment');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card w-full max-w-lg h-[80vh] sm:h-[600px] rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden sketch-border"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-foreground/10 bg-card/60">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-primary" />
              <h3 className="font-heading font-bold text-base">Comments ({comments.length})</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-card/60 text-muted-foreground transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Post Caption as first item if present */}
            {post?.caption && (
              <div className="flex items-start gap-3 pb-3 border-b border-foreground/5">
                <Avatar
                  name={post.author_name || post.author_username}
                  color={post.author_avatar_color}
                  avatarUrl={post.author_avatar_url}
                  size={36}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body">
                    <span className="font-heading font-bold mr-2 text-foreground">
                      @{post.author_username || 'author'}
                    </span>
                    <span className="text-foreground/90 whitespace-pre-wrap">{post.caption}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {formatRelativeTime(post.created_at || post.created_date)}
                  </p>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 size={24} className="animate-spin text-primary" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageCircle size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm font-body">No comments yet.</p>
                <p className="text-xs opacity-70">Be the first to leave a handwritten note!</p>
              </div>
            ) : (
              comments.map((c) => {
                const isOwn = (me?.id || me?.profile_id) === c.user_id;
                const isPostOwner = (me?.id || me?.profile_id) === post?.user_id;
                return (
                  <div key={c.id} className="flex items-start gap-3 group">
                    <Avatar
                      name={c.author_name || c.author_username}
                      color={c.author_avatar_color}
                      avatarUrl={c.author_avatar_url}
                      size={34}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-heading font-bold text-foreground">
                          @{c.author_username || 'user'}
                        </p>
                        <span className="text-[10px] text-muted-foreground">
                          {formatRelativeTime(c.created_at || c.created_date)}
                        </span>
                      </div>
                      <p className="text-sm font-body text-foreground/90 mt-0.5 whitespace-pre-wrap">
                        {c.content}
                      </p>
                    </div>
                    {(isOwn || isPostOwner) && (
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                        title="Delete comment"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* New Comment Input */}
          <form
            onSubmit={handleAddComment}
            className="p-3 border-t border-foreground/10 bg-card/40 flex items-center gap-2"
          >
            <Avatar
              name={me?.display_name || me?.username}
              color={me?.avatar_color}
              avatarUrl={me?.avatar_url}
              size={32}
            />
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-transparent border-none outline-none text-sm font-body placeholder:text-muted-foreground/60 px-2"
              maxLength={300}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className="p-2 rounded-xl sketch-fill text-primary-foreground disabled:opacity-40 transition-opacity"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
