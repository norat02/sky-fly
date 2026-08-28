import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Compass, Home, MessageSquare } from 'lucide-react';
import BackgroundOrbs from '@/components/BackgroundOrbs';

export default function PageNotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const pageName = location.pathname.substring(1);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background text-foreground">
      <BackgroundOrbs />
      <div className="max-w-md w-full glass-card p-8 rounded-3xl sketch-border shadow-[4px_4px_0px_rgba(0,0,0,0.1)] text-center relative z-10 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center sketch-border -rotate-3">
          <Compass size={32} />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-heading font-black text-foreground">404</h1>
          <h2 className="text-xl font-heading font-bold text-foreground">Page Not Found</h2>
          <p className="text-sm font-body text-muted-foreground">
            The page <span className="font-semibold text-foreground font-mono">/{pageName}</span> is not drawn in this sketchbook yet.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3 px-4 rounded-2xl bg-primary text-primary-foreground font-heading font-bold text-sm sketch-border shadow-[2px_2px_0px_rgba(0,0,0,0.15)] hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5"
          >
            <MessageSquare size={16} />
            <span>Go to Chats</span>
          </button>
        </div>
      </div>
    </div>
  );
}
