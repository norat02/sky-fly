import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, KeyRound, CheckCircle2, ArrowRight } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { db } from "@/api/base44Client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await db.auth.resetPasswordRequest(email);
    } catch {
      // Always show confirmation
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <AuthLayout
      icon={KeyRound}
      title="Reset Password"
      subtitle="We'll send you instructions to reset your sketchbook password"
      footer={
        <Link to="/login" className="text-primary font-heading font-bold hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Log In
        </Link>
      }
    >
      {sent ? (
        <div className="text-center space-y-4 animate-in fade-in">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center sketch-border">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="font-heading font-bold text-lg text-foreground">Reset Request Sent</h3>
          <p className="text-sm font-body text-muted-foreground">
            If an account exists with <strong>{email}</strong>, instructions and a recovery link have been prepared.
          </p>

          <div className="pt-2">
            <Link
              to={`/reset-password?email=${encodeURIComponent(email)}&token=demo_reset_tok`}
              className="w-full py-3 px-4 rounded-2xl bg-primary text-primary-foreground font-heading font-bold text-sm flex items-center justify-center gap-2 sketch-border shadow-[2px_2px_0px_rgba(0,0,0,0.15)] hover:scale-[1.01] transition-all"
            >
              <span>Continue to Set New Password</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-heading font-bold text-foreground">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground font-body text-base placeholder:text-muted-foreground/60 transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-primary text-primary-foreground font-heading font-bold text-base sketch-border shadow-[3px_3px_0px_rgba(0,0,0,0.2)] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.1)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending Instructions...</span>
              </>
            ) : (
              <span>Send Reset Link</span>
            )}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}

