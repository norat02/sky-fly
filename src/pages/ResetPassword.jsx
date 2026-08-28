import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Loader2, KeyRound, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { getSupabase } from "@/lib/supabase";
import { db } from "@/api/base44Client";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resetToken = searchParams.get("token") || searchParams.get("access_token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    if (supabase) {
      const hash = window.location.hash;
      if (hash && (hash.includes('access_token') || hash.includes('type=recovery'))) {
        console.log('[Auth] Recovery hash detected');
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await db.auth.resetPassword({ resetToken, newPassword });
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        icon={CheckCircle2}
        title="Password Updated"
        subtitle="Your password has been changed successfully"
        footer={
          <Link to="/login" className="text-primary font-heading font-bold hover:underline inline-flex items-center gap-1">
            <span>Proceed to Log In</span>
            <ArrowRight size={14} />
          </Link>
        }
      >
        <div className="text-center py-4 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center sketch-border">
            <CheckCircle2 size={28} />
          </div>
          <p className="text-sm font-body text-muted-foreground">
            Redirecting to your login screen in a moment...
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={KeyRound}
      title="Create New Password"
      subtitle="Enter a strong new password for your sketchbook account"
      footer={
        <div className="space-y-2 text-center">
          <Link to="/login" className="text-primary font-heading font-bold hover:underline text-sm">
            Back to Log In
          </Link>
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <ShieldCheck size={13} className="text-emerald-500" />
            <span>Encrypted credentials</span>
          </div>
        </div>
      }
    >
      {error && (
        <div className="mb-4 p-3.5 rounded-2xl bg-destructive/10 border-2 border-destructive/30 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="newPassword" className="block text-sm font-heading font-bold text-foreground">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              autoFocus
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground font-body text-base placeholder:text-muted-foreground/60 transition-colors"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="block text-sm font-heading font-bold text-foreground">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground font-body text-base placeholder:text-muted-foreground/60 transition-colors"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-2xl bg-primary text-primary-foreground font-heading font-bold text-lg sketch-border shadow-[3px_3px_0px_rgba(0,0,0,0.2)] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.1)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Saving New Password...</span>
            </>
          ) : (
            <span>Update Password</span>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}

