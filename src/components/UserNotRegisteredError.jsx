import React from 'react';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import { db } from '@/api/base44Client';

const UserNotRegisteredError = () => {
  const handleLogout = () => {
    db.auth.logout('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background text-foreground">
      <BackgroundOrbs />
      <div className="max-w-md w-full glass-card p-8 rounded-3xl sketch-border shadow-[4px_4px_0px_rgba(0,0,0,0.1)] text-center relative z-10 space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center sketch-border -rotate-3">
          <ShieldAlert size={32} />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-heading font-black text-foreground">Access Restricted</h1>
          <p className="text-sm font-body text-muted-foreground">
            Your account is not registered to access this sketchbook or requires approval from an administrator.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-muted/40 border border-foreground/10 text-xs text-left font-body space-y-1.5 text-muted-foreground">
          <p className="font-heading font-bold text-foreground">Quick solutions:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Verify you are signed in with the correct email address</li>
            <li>Try logging in again or create a new anonymous sketchbook identity</li>
          </ul>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 py-3 px-4 rounded-2xl bg-card hover:bg-muted font-heading font-bold text-sm sketch-border transition-all flex items-center justify-center gap-1.5"
          >
            <ArrowLeft size={16} />
            <span>Go Home</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 py-3 px-4 rounded-2xl bg-primary text-primary-foreground font-heading font-bold text-sm sketch-border shadow-[2px_2px_0px_rgba(0,0,0,0.15)] hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5"
          >
            <LogIn size={16} />
            <span>Switch Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserNotRegisteredError;

