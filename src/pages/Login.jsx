import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LogIn, User, Lock, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import AuthLayout from "@/components/AuthLayout";
import OAuthButtons from "@/components/OAuthButtons";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const returnTo = safeReturnTo();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const cleanUsername = username.trim();
    if (!cleanUsername || !password) {
      setError("Please enter both your username and password.");
      return;
    }
    setLoading(true);
    try {
      await login(cleanUsername, password);
      navigate(returnTo);
    } catch (err) {
      setError(err.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="Welcome to Whisper"
      subtitle="Sign in with your username and password"
      footer={
        <div className="space-y-3">
          <p className="text-sm font-body">
            Don't have an account?{" "}
            <Link
              to={`/register${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
              className="text-primary font-heading font-bold hover:underline"
            >
              Create Account
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-body">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Encrypted sketchbook messaging & Supabase database</span>
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

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {/* Username field */}
        <div className="space-y-1.5">
          <label htmlFor="username" className="block text-sm font-heading font-bold text-foreground">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <input
              id="username"
              type="text"
              autoComplete="username"
              autoFocus
              placeholder="e.g. ink_artist or your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none text-foreground font-body text-base placeholder:text-muted-foreground/60 transition-colors"
              required
            />
          </div>
        </div>

        {/* Password field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-heading font-bold text-foreground">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs font-heading font-semibold text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              <span>Sign In</span>
            </>
          )}
        </button>

        <div className="pt-2 text-center">
          <p className="text-xs text-muted-foreground font-hand">
            <Sparkles size={12} className="inline mr-1 text-primary" />
            Instant multi-language translation and Supabase sync ready
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
