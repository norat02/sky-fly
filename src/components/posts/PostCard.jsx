import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, Trash2, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Avatar from '@/components/Avatar';
import { getLocalProfile, formatRelativeTime } from '@/lib/chat-utils';
import { db } from '@/api/base44Client';
import PostCommentsModal from './PostCommentsModal';

export default function PostCard({ post, onDeletePost, onUpdatePost }) {
  const navigate = useNavigate();
  const me = getLocalProfile();
  const currentUserId = me?.id || me?.profile_id;

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [quickComment, setQuickComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Load likes, saved state, and comment count
  useEffect(() => {
    let cancelled = false;
    async function loadPostDetails() {
      if (!post?.id) return;
      try {
        const [likes, comments, saves] = await Promise.all([
          db.entities.Like.filter({ post_id: post.id }),
          db.entities.Comment.filter({ post_id: post.id }),
          currentUserId ? db.entities.SavedPost.filter({ post_id: post.id, user_id: currentUserId }) : [],
        ]);

        if (cancelled) return;
        setLikeCount(likes.length);
        setIsLiked(Boolean(likes.find((l) => l.user_id === currentUserId)));
        setCommentCount(comments.length);
        setIsSaved(saves.length > 0);
      } catch (err) {
        console.warn('Failed to load post metrics:', err);
      }
    }

    loadPostDetails();
    return () => {
      cancelled = true;
    };
  }, [post?.id, currentUserId]);

  const toggleLike = async () => {
    if (!currentUserId || !post?.id) {
      toast.error('Please log in to like posts');
      return;
    }

    const previousLiked = isLiked;
    const previousCount = likeCount;

    // Optimistic update
    setIsLiked(!previousLiked);
    setLikeCount(previousLiked ? Math.max(0, previousCount - 1) : previousCount + 1);

    try {
      if (previousLiked) {
        await db.entities.Like.deleteMany({ post_id: post.id, user_id: currentUserId });
      } else {
        await db.entities.Like.create({
          post_id: post.id,
          user_id: currentUserId,
        });

        // Trigger notification to post author
        if (post.user_id && post.user_id !== currentUserId) {
          await db.entities.Notification.create({
            recipient_id: post.user_id,
            actor_id: currentUserId,
            type: 'like',
            text: 'liked your sketch post.',
            post_id: post.id,
          }).catch(() => {});
        }
      }
    } catch (err) {
      // Revert on error
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      toast.error('Failed to update like');
    }
  };

  const handleDoubleTap = () => {
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 900);
    if (!isLiked) {
      toggleLike();
    }
  };

  const toggleSave = async () => {
    if (!currentUserId || !post?.id) return;
    const previousSaved = isSaved;
    setIsSaved(!previousSaved);

    try {
      if (previousSaved) {
        await db.entities.SavedPost.deleteMany({ post_id: post.id, user_id: currentUserId });
        toast.success('Removed from saved sketches');
      } else {
        await db.entities.SavedPost.create({
          post_id: post.id,
          user_id: currentUserId,
        });
        toast.success('Saved to your collection');
      }
    } catch (err) {
      setIsSaved(previousSaved);
      toast.error('Failed to save post');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await db.entities.Post.delete(post.id);
      toast.success('Post deleted');
      if (onDeletePost) onDeletePost(post.id);
    } catch (err) {
      toast.error('Failed to delete post');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + `/profile/${post.user_id}`);
      toast.success('Post link copied to clipboard!');
    }
  };

  const handleQuickComment = async (e) => {
    e.preventDefault();
    if (!quickComment.trim() || !currentUserId || isSubmittingComment) return;

    setIsSubmittingComment(true);
    const text = quickComment.trim();
    setQuickComment('');

    try {
      await db.entities.Comment.create({
        post_id: post.id,
        user_id: currentUserId,
        content: text,
      });

      setCommentCount((prev) => prev + 1);

      if (post.user_id && post.user_id !== currentUserId) {
        await db.entities.Notification.create({
          recipient_id: post.user_id,
          actor_id: currentUserId,
          type: 'comment',
          text: `commented: "${text.slice(0, 30)}${text.length > 30 ? '...' : ''}"`,
          post_id: post.id,
        }).catch(() => {});
      }

      toast.success('Comment added');
    } catch (err) {
      toast.error('Failed to add comment');
      setQuickComment(text);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const isOwner = currentUserId === post.user_id;

  return (
    <article className="glass-card overflow-hidden rounded-2xl sketch-border mb-6">
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-foreground/10 bg-card/30">
        <div
          onClick={() => navigate(`/profile/${post.user_id}`)}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <Avatar
            name={post.author_name || post.author_username}
            color={post.author_avatar_color}
            avatarUrl={post.author_avatar_url}
            size={38}
          />
          <div className="min-w-0">
            <p className="text-sm font-heading font-bold text-foreground leading-tight truncate">
              @{post.author_username || 'artist'}
            </p>
            {post.location ? (
              <p className="text-[11px] text-muted-foreground font-body flex items-center gap-0.5">
                <MapPin size={10} /> {post.location}
              </p>
            ) : (
              <p className="text-[10px] text-muted-foreground font-body">
                {formatRelativeTime(post.created_at || post.created_date)}
              </p>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg hover:bg-card/60 text-muted-foreground transition-colors"
          >
            <MoreHorizontal size={18} />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 z-30 w-36 glass-card p-1.5 sketch-border shadow-lg rounded-xl text-xs font-body">
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleShare();
                }}
                className="w-full text-left px-2.5 py-1.5 hover:bg-card/60 rounded-lg flex items-center gap-2"
              >
                <Share2 size={13} /> Copy link
              </button>
              {isOwner && (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    handleDelete();
                  }}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-destructive/10 text-destructive rounded-lg flex items-center gap-2"
                >
                  <Trash2 size={13} /> Delete post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Media / Image Display with Double-Tap Animation */}
      <div className="relative aspect-square sm:aspect-[4/3] bg-muted/40 select-none overflow-hidden" onDoubleClick={handleDoubleTap}>
        {post.media_type === 'video' ? (
          <video
            src={post.media_url}
            controls
            className="w-full h-full object-contain bg-black/50"
          />
        ) : (
          <img
            src={post.media_url}
            alt={post.caption || 'Sketch post'}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}

        {/* Double-tap Heart Animation */}
        <AnimatePresence>
          {showHeartAnim && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0.95 }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <Heart size={88} className="fill-rose-500 text-rose-500 drop-shadow-xl stroke-[1.5]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <button
              onClick={toggleLike}
              className="group flex items-center gap-1.5 text-foreground hover:text-rose-500 transition-colors"
            >
              <Heart
                size={22}
                className={isLiked ? 'fill-rose-500 text-rose-500 transition-transform scale-110' : 'group-hover:scale-110 transition-transform'}
              />
              <span className="text-xs font-heading font-bold">{likeCount}</span>
            </button>

            <button
              onClick={() => setShowComments(true)}
              className="group flex items-center gap-1.5 text-foreground hover:text-primary transition-colors"
            >
              <MessageCircle size={22} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-heading font-bold">{commentCount}</span>
            </button>

            <button
              onClick={handleShare}
              className="text-foreground hover:text-primary transition-colors hover:scale-110"
              title="Share"
            >
              <Share2 size={20} />
            </button>
          </div>

          <button
            onClick={toggleSave}
            className="text-foreground hover:text-amber-500 transition-colors"
            title="Save post"
          >
            <Bookmark
              size={22}
              className={isSaved ? 'fill-amber-500 text-amber-500' : 'hover:scale-110 transition-transform'}
            />
          </button>
        </div>

        {/* Caption */}
        {post.caption && (
          <div className="text-sm font-body pt-1">
            <span
              onClick={() => navigate(`/profile/${post.user_id}`)}
              className="font-heading font-bold mr-2 cursor-pointer hover:underline"
            >
              @{post.author_username || 'artist'}
            </span>
            <span className="text-foreground/90 whitespace-pre-wrap">{post.caption}</span>
          </div>
        )}

        {/* View all comments link */}
        {commentCount > 0 && (
          <button
            onClick={() => setShowComments(true)}
            className="text-xs text-muted-foreground hover:text-foreground font-body block pt-0.5"
          >
            View all {commentCount} comment{commentCount !== 1 ? 's' : ''}
          </button>
        )}

        {/* Quick inline comment */}
        <form onSubmit={handleQuickComment} className="flex items-center gap-2 pt-1 border-t border-foreground/5">
          <input
            type="text"
            value={quickComment}
            onChange={(e) => setQuickComment(e.target.value)}
            placeholder="Add a handwritten comment..."
            className="flex-1 bg-transparent border-none outline-none text-xs font-body placeholder:text-muted-foreground/60 py-1"
            maxLength={200}
          />
          {quickComment.trim() && (
            <button
              type="submit"
              disabled={isSubmittingComment}
              className="text-xs font-heading font-bold text-primary hover:underline px-1 disabled:opacity-50"
            >
              Post
            </button>
          )}
        </form>
      </div>

      {/* Comments Modal */}
      {showComments && (
        <PostCommentsModal
          post={post}
          isOpen={showComments}
          onClose={() => setShowComments(false)}
          onCommentCountChanged={(c) => setCommentCount(c)}
        />
      )}
    </article>
  );
}
