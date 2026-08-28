import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { UserPlus, Lock, User, Sparkles, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import AuthLayout from "@/components/AuthLayout";
import OAuthButtons from "@/components/OAuthButtons";
import { safeReturnTo } from "@/lib/authReturnTo";
import { getOAuthErrorFromLocation } from "@/lib/oauthErrors";
import { generateUsername } from "@/lib/chat-utils";

export default function Register() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const returnTo = safeReturnTo();

  useEffect(() => {
    const callbackError = getOAuthErrorFromLocation();
    if (callbackError) {
      setError(callbackError);
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search.replace(/([?&])(?:error|error_code|error_description)=[^&]*/g, '').replace(/[?&]$/, ''));
    }
  }, []);

  const handleRandomizeHandle = () => {
    const handle = generateUsername();
    setUsername(handle);
    if (!displayName) {
      setDisplayName(handle.split('_')[0].charAt(0).toUpperCase() + handle.split('_')[0].slice(1));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!cleanUsername) {
      setError("Please choose a valid username (letters, numbers, and underscores).");
      return;
    }
    if (cleanUsername.length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }
    if (!password) {
      setError("Please enter a password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register({
        username: cleanUsername,
        displayName: displayName.trim() || cleanUsername,
        password,
      });
      navigate(returnTo);
    } catch (err) {
      setError(err.message || "Failed to create account. Please try a different username.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={UserPlus}
      title="Create Account"
      subtitle="Join Whisper with your username & password"
      footer={
        <div className="space-y-3">
          <p className="text-sm font-body">
            Already have an account?{" "}
            <Link
              to={`/login${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
              className="text-primary font-heading font-bold hover:underline"
            >
              Sign in instead
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-body">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Instant account creation • Supabase database synced</span>
          </div>
        </div>
      }
    >
      {error && (
        <div className="mb-4 p-3.5 rounded-2xl bg-destructive/10 border-2 border-destructive/30 text-destructive text-sm font-medium animate-in fade-in">
          {error}
        </div>
      )}

      <OAuthButtons returnTo={returnTo} onError={setError} disabled={loading} />

      <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
        {/* Username field */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor="username" className="text-xs font-heading font-bold text-foreground">
              Username <span className="text-destructive">*</span>
            </label>
            <button
              type="button"
              onClick={handleRandomizeHandle}
              className="text-[11px] font-heading font-semibold text-primary hover:underline flex items-center gap-0.5"
            >
              <Sparkles size={11} /> Generate
            </button>
          </div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <input
              id="username"
              type="text"
              autoFocus
              placeholder="e.g. sketchbook_master"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground font-body text-sm placeholder:text-muted-foreground/60 transition-colors"
              required
            />
          </div>
          <p className="text-[10px] text-muted-foreground font-hand">
            Only letters, numbers, and underscores
          </p>
        </div>

        {/* Display Name (Optional) */}
        <div className="space-y-1">
          <label htmlFor="displayName" className="block text-xs font-heading font-bold text-foreground">
            Display Name <span className="text-muted-foreground text-[10px]">(Optional)</span>
          </label>
          <input
            id="displayName"
            type="text"
            placeholder="e.g. Master Artist"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground font-body text-sm placeholder:text-muted-foreground/60 transition-colors"
          />
        </div>

        {/* Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="password" className="block text-xs font-heading font-bold text-foreground">
              Password <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="6+ chars"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground font-body text-sm placeholder:text-muted-foreground/60 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="confirm" className="block text-xs font-heading font-bold text-foreground">
              Confirm Password <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <input
                id="confirm"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground font-body text-sm placeholder:text-muted-foreground/60 transition-colors"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-2xl bg-primary text-primary-foreground font-heading font-bold text-lg sketch-border shadow-[3px_3px_0px_rgba(0,0,0,0.2)] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.1)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-3 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
