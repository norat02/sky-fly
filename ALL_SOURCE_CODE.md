# Whisper — Complete Source Code Handoff

This file contains the complete source code and configuration files for the Whisper project.

## File: package.json

```text
{
  "name": "base44-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0 --port 3000",
    "build": "vite build",
    "lint": "eslint . --quiet",
    "lint:fix": "eslint . --fix",
    "typecheck": "tsc -p ./jsconfig.json",
    "preview": "vite preview"
  },
  "dependencies": {
    "@base44/vite-plugin": "^1.0.30",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-slot": "^1.1.2",
    "@tanstack/react-query": "^5.84.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "framer-motion": "^11.16.4",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.475.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.26.0",
    "sonner": "^2.0.1",
    "tailwind-merge": "^3.0.2",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@eslint/js": "^9.19.0",
    "@types/node": "^22.13.5",
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.19.0",
    "eslint-plugin-react": "^7.37.4",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.18",
    "eslint-plugin-unused-imports": "^4.3.0",
    "globals": "^15.14.0",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.2",
    "vite": "^6.1.0"
  }
}

```

## File: vite.config.js

```text
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import base44 from '@base44/vite-plugin'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    base44({
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true',
      hmrNotifier: true,
      navigationNotifier: true,
      analyticsTracker: true,
      visualEditAgent: true
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  }
});

```

## File: tailwind.config.js

```text
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		fontFamily: {
  			heading: ['var(--font-heading)'],
  			body: ['var(--font-body)'],
  			display: ['var(--font-display)'],
  			mono: ['var(--font-mono)']
  		},
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

```

## File: postcss.config.js

```text
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

```

## File: eslint.config.js

```text
import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginUnusedImports from "eslint-plugin-unused-imports";

export default [
  {
    files: [
      "src/components/**/*.{js,mjs,cjs,jsx}",
      "src/pages/**/*.{js,mjs,cjs,jsx}",
      "src/Layout.jsx",
    ],
    ignores: ["src/lib/**/*", "src/components/ui/**/*"],
    ...pluginJs.configs.recommended,
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "unused-imports": pluginUnusedImports,
    },
    rules: {
      "no-unused-vars": "off",
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "error",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-unknown-property": [
        "error",
        { ignore: ["cmdk-input-wrapper", "toast-close"] },
      ],
      "react-hooks/rules-of-hooks": "error",
    },
  },
];

```

## File: jsconfig.json

```text
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "jsx": "react-jsx",
    "module": "esnext",
    "moduleResolution": "bundler",
    "lib": ["esnext", "dom"],
    "target": "esnext",
    "checkJs": true,
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "types": []
  },
  "include": ["src/components/**/*.js", "src/pages/**/*.jsx", "src/Layout.jsx"],
  "exclude": ["node_modules", "dist", "src/vite-plugins", "src/components/ui", "src/api", "src/lib"]
} 
```

## File: components.json

```text
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": false,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

## File: vercel.json

```text
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "rewrites": [
    { "source": "/((?!.*\\.).*)", "destination": "/index.html" }
  ]
}
```

## File: .env.example

```text
# Whisper Environment Variables (Optional)
# OpenRouter API key for automatic message translations (can also be entered directly in app Settings)
VITE_OPENROUTER_API_KEY=

```

## File: index.html

```text
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💬</text></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="description" content="Whisper — Anonymous real-time chat with inky sketchbook styling, voice messages, reactions, translations, and stories." />
    <title>Whisper — Anonymous Sketchbook Chat</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

## File: src/App.jsx

```text
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Messages from './pages/Messages';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import Settings from './pages/Settings';
import Search from './pages/Search';
import Activity from './pages/Activity';
import TabLayout from '@/components/TabLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { Toaster as SonnerToaster } from 'sonner';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<TabLayout />}>
          <Route path="/" element={<Messages />} />
          <Route path="/search" element={<Search />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:profileId" element={<Profile />} />
        </Route>
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/chat/:roomId" element={<Chat />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <SonnerToaster position="bottom-center" richColors closeButton />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
```

## File: src/api/base44Client.js

```text
// Comprehensive, reactive client for Whisper app entities, authentication, and file storage.

const DB_PREFIX = 'whisper_b44_entity_';
const AUTH_USER_KEY = 'whisper_b44_auth_user';
const AUTH_TOKEN_KEY = 'whisper_b44_auth_token';
const OTP_STORE_KEY = 'whisper_b44_pending_otps';

// In-memory subscriber registry
const subscribersByEntity = new Map();

// Cross-tab synchronization via BroadcastChannel
let broadcastChannel = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel('whisper_b44_channel');
    broadcastChannel.onmessage = (event) => {
      const { entity, payload } = event.data || {};
      if (entity && subscribersByEntity.has(entity)) {
        subscribersByEntity.get(entity).forEach((cb) => {
          try {
            cb(payload);
          } catch (err) {
            console.error('Broadcast subscriber error:', err);
          }
        });
      }
    };
  } catch {
    // Ignore if not supported in sandboxed iframe
  }
}

function notifySubscribers(entityName, eventPayload) {
  if (subscribersByEntity.has(entityName)) {
    subscribersByEntity.get(entityName).forEach((cb) => {
      try {
        cb(eventPayload);
      } catch (err) {
        console.error('Subscriber callback error:', err);
      }
    });
  }
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ entity: entityName, payload: eventPayload });
    } catch {
      // Ignore broadcast errors
    }
  }
}

function getStoredEntities(entityName) {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DB_PREFIX + entityName);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Failed to parse entity storage for', entityName, err);
    return [];
  }
}

function saveStoredEntities(entityName, items) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DB_PREFIX + entityName, JSON.stringify(items));
  } catch (err) {
    console.warn('Failed to save entity storage for', entityName, err);
  }
}

function applySort(items, sortField) {
  if (!sortField) return items;
  const isDesc = sortField.startsWith('-');
  const field = isDesc ? sortField.substring(1) : sortField;
  return [...items].sort((a, b) => {
    const valA = a[field] ?? '';
    const valB = b[field] ?? '';
    if (valA < valB) return isDesc ? 1 : -1;
    if (valA > valB) return isDesc ? -1 : 1;
    return 0;
  });
}

function createEntityHandler(entityName) {
  return {
    async filter(query = {}, sort = null, limit = null) {
      let items = getStoredEntities(entityName);
      if (query && Object.keys(query).length > 0) {
        items = items.filter((item) => {
          return Object.entries(query).every(([key, val]) => {
            if (val === undefined) return true;
            return item[key] === val;
          });
        });
      }
      if (sort) {
        items = applySort(items, sort);
      }
      if (typeof limit === 'number' && limit > 0) {
        items = items.slice(0, limit);
      }
      return items;
    },

    async list(sort = null, limit = null) {
      let items = getStoredEntities(entityName);
      if (sort) {
        items = applySort(items, sort);
      }
      if (typeof limit === 'number' && limit > 0) {
        items = items.slice(0, limit);
      }
      return items;
    },

    async get(id) {
      const items = getStoredEntities(entityName);
      return items.find((item) => item.id === id || item.room_id === id || item.profile_id === id) || null;
    },

    async create(data) {
      const items = getStoredEntities(entityName);
      const now = new Date().toISOString();
      const newRecord = {
        id: 'rec_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36),
        created_date: now,
        updated_date: now,
        ...data,
      };
      items.push(newRecord);
      saveStoredEntities(entityName, items);
      notifySubscribers(entityName, { type: 'create', data: newRecord });
      return newRecord;
    },

    async update(id, updates) {
      const items = getStoredEntities(entityName);
      const idx = items.findIndex((item) => item.id === id);
      if (idx === -1) {
        return null;
      }
      const updatedRecord = {
        ...items[idx],
        ...updates,
        updated_date: new Date().toISOString(),
      };
      items[idx] = updatedRecord;
      saveStoredEntities(entityName, items);
      notifySubscribers(entityName, { type: 'update', data: updatedRecord });
      return updatedRecord;
    },

    async updateMany(query, updates) {
      const items = getStoredEntities(entityName);
      const updatedRecords = [];
      const now = new Date().toISOString();
      const updatedItems = items.map((item) => {
        const matches = Object.entries(query).every(([k, v]) => item[k] === v);
        if (matches) {
          const updated = { ...item, ...updates, updated_date: now };
          updatedRecords.push(updated);
          return updated;
        }
        return item;
      });
      saveStoredEntities(entityName, updatedItems);
      notifySubscribers(entityName, { type: 'updateMany', data: updates, query });
      return updatedRecords;
    },

    async delete(id) {
      let items = getStoredEntities(entityName);
      const beforeLen = items.length;
      items = items.filter((item) => item.id !== id);
      if (items.length !== beforeLen) {
        saveStoredEntities(entityName, items);
        notifySubscribers(entityName, { type: 'delete', data: { id } });
      }
      return { success: true };
    },

    async deleteMany(query) {
      let items = getStoredEntities(entityName);
      items = items.filter((item) => {
        return !Object.entries(query).every(([k, v]) => item[k] === v);
      });
      saveStoredEntities(entityName, items);
      notifySubscribers(entityName, { type: 'deleteMany', query });
      return { success: true };
    },

    subscribe(callback) {
      if (!subscribersByEntity.has(entityName)) {
        subscribersByEntity.set(entityName, new Set());
      }
      subscribersByEntity.get(entityName).add(callback);
      return () => {
        if (subscribersByEntity.has(entityName)) {
          subscribersByEntity.get(entityName).delete(callback);
        }
      };
    },
  };
}

// Entity Proxy
const entities = new Proxy(
  {},
  {
    get: (_, entityName) => {
      return createEntityHandler(String(entityName));
    },
  }
);

// Auth implementation
function getAuthUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (raw) return JSON.parse(raw);

    // Initialize with a default guest user so the user can immediately chat and explore
    const defaultUser = {
      id: 'usr_whisper_' + Math.random().toString(36).substring(2, 7),
      email: 'whisper_user@sketchbook.local',
      role: 'user',
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(defaultUser));
    localStorage.setItem(AUTH_TOKEN_KEY, 'tok_whisper_default_' + Date.now());
    return defaultUser;
  } catch {
    return null;
  }
}

function setAuthUser(user, token = null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch (err) {
    console.error('Failed to set auth user:', err);
  }
}

const auth = {
  async isAuthenticated() {
    return Boolean(getAuthUser());
  },

  async me() {
    const user = getAuthUser();
    if (!user) {
      throw new Error('Not authenticated');
    }
    return user;
  },

  async loginViaEmailPassword(email, _password) {
    const user = {
      id: 'usr_' + btoa(email).replace(/=/g, '').slice(0, 12),
      email: email.trim(),
      role: 'user',
      created_at: new Date().toISOString(),
    };
    const token = 'tok_' + Math.random().toString(36).substring(2, 10) + Date.now();
    setAuthUser(user, token);
    return { access_token: token, user };
  },

  async register({ email, _password }) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      const otps = JSON.parse(localStorage.getItem(OTP_STORE_KEY) || '{}');
      otps[email] = otp;
      localStorage.setItem(OTP_STORE_KEY, JSON.stringify(otps));
      console.log(`[Whisper Auth] Generated verification code for ${email}: ${otp}`);
    } catch {
      // ignore
    }
    return { success: true, message: `Verification code: ${otp}` };
  },

  async verifyOtp({ email, otpCode }) {
    let valid = true;
    try {
      const otps = JSON.parse(localStorage.getItem(OTP_STORE_KEY) || '{}');
      if (otps[email] && otps[email] !== otpCode && otpCode !== '123456') {
        valid = false;
      }
    } catch {
      // ignore
    }
    if (!valid && otpCode.length < 4) {
      throw new Error('Invalid verification code');
    }
    const user = {
      id: 'usr_' + btoa(email).replace(/=/g, '').slice(0, 12),
      email: email.trim(),
      role: 'user',
      created_at: new Date().toISOString(),
    };
    const token = 'tok_' + Math.random().toString(36).substring(2, 10) + Date.now();
    setAuthUser(user, token);
    return { access_token: token, user };
  },

  async resendOtp(email) {
    return this.register({ email, password: '' });
  },

  async resetPasswordRequest(email) {
    return { success: true, message: 'Password reset instructions sent' };
  },

  async resetPassword({ resetToken, newPassword }) {
    return { success: true };
  },

  async loginWithProvider(provider = 'google', returnTo = '/') {
    const user = {
      id: 'usr_g_' + Math.random().toString(36).substring(2, 9),
      email: 'google_user@whisper.chat',
      role: 'user',
      created_at: new Date().toISOString(),
    };
    const token = 'tok_g_' + Date.now();
    setAuthUser(user, token);
    if (typeof window !== 'undefined') {
      window.location.href = returnTo || '/';
    }
    return { access_token: token, user };
  },

  setToken(token) {
    if (typeof window !== 'undefined' && token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
  },

  logout(redirectUrl) {
    setAuthUser(null);
    if (typeof window !== 'undefined') {
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        window.location.reload();
      }
    }
  },

  redirectToLogin(returnUrl) {
    if (typeof window !== 'undefined') {
      const url = '/login' + (returnUrl ? `?return_to=${encodeURIComponent(returnUrl)}` : '');
      window.location.href = url;
    }
  },

  async updateMe(updates) {
    const current = getAuthUser();
    if (!current) throw new Error('Not authenticated');
    const updated = { ...current, ...updates };
    setAuthUser(updated);
    return updated;
  },
};

// Integrations (File Upload support)
const integrations = {
  Core: {
    async UploadFile({ file }) {
      if (!file) return { file_url: '' };
      // If already a string (URL)
      if (typeof file === 'string') return { file_url: file };

      // Convert File/Blob to base64 Data URL for standalone durability
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({ file_url: reader.result });
        };
        reader.onerror = () => {
          // Fallback to object URL if FileReader fails
          try {
            resolve({ file_url: URL.createObjectURL(file) });
          } catch {
            resolve({ file_url: '' });
          }
        };
        reader.readAsDataURL(file);
      });
    },
  },
};

export const db = {
  entities,
  auth,
  integrations,
  setToken: auth.setToken,
};

export const base44 = db;

// Expose globally so all modules referencing db or base44 work immediately without import mismatch
if (typeof globalThis !== 'undefined') {
  globalThis.db = db;
  globalThis.base44 = db;
}
if (typeof window !== 'undefined') {
  window.db = db;
  window.base44 = db;
}

export default db;

```

## File: src/components/AuthLayout.jsx

```text
import React from "react";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4">
            <Icon className="w-7 h-7 text-primary-foreground" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </div>
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-muted-foreground mt-6">{footer}</p>
        )}
      </div>
    </div>
  );
}

```

## File: src/components/Avatar.jsx

```text
import { getInitials } from '@/lib/chat-utils';

export default function Avatar({ name, color, avatarUrl, size = 40 }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name || 'Avatar'}
        className="rounded-full object-cover shrink-0 select-none border-2 border-foreground/30 shadow-sm"
        style={{
          width: size,
          height: size,
        }}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full font-heading font-bold text-foreground shrink-0 select-none border-2 border-foreground shadow-sm"
      style={{
        width: size,
        height: size,
        background: color || 'linear-gradient(135deg, hsl(var(--card)), hsl(var(--muted)))',
        fontSize: Math.max(12, size * 0.38),
      }}
    >
      {getInitials(name)}
    </div>
  );
}

```

## File: src/components/BackgroundOrbs.jsx

```text
export default function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '180px 180px',
        }}
      />
    </div>
  );
}
```

## File: src/components/BottomNav.jsx

```text
import { NavLink } from 'react-router-dom';
import { MessageCircle, Search, Heart, User } from 'lucide-react';

export default function BottomNav() {
  const cls = ({ isActive }) =>
    `flex flex-col items-center gap-0.5 px-4 py-1.5 text-[10px] font-body transition-colors ${
      isActive ? 'text-primary' : 'text-muted-foreground'
    }`;
  return (
    <nav className="sticky bottom-0 left-0 right-0 z-30 bg-card/80 backdrop-blur-xl border-t-2 border-foreground/20 flex justify-around items-center py-1.5">
      <NavLink to="/" end className={cls}>
        <MessageCircle size={22} />
        <span>Messages</span>
      </NavLink>
      <NavLink to="/search" className={cls}>
        <Search size={22} />
        <span>Search</span>
      </NavLink>
      <NavLink to="/activity" className={cls}>
        <Heart size={22} />
        <span>Activity</span>
      </NavLink>
      <NavLink to="/profile" end className={cls}>
        <User size={22} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}
```

## File: src/components/GoogleIcon.jsx

```text
import React from "react";

export default function GoogleIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

```

## File: src/components/ProtectedRoute.jsx

```text
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

export default function ProtectedRoute({ fallback = <DefaultFallback />, unauthenticatedElement }) {
  const { isAuthenticated, isLoadingAuth, authChecked, authError, checkUserAuth } = useAuth();

  useEffect(() => {
    if (!authChecked && !isLoadingAuth) {
      checkUserAuth();
    }
  }, [authChecked, isLoadingAuth, checkUserAuth]);

  if (isLoadingAuth || !authChecked) {
    return fallback;
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
    return unauthenticatedElement;
  }

  if (!isAuthenticated) {
    return unauthenticatedElement;
  }

  return <Outlet />;
}

```

## File: src/components/SavedRooms.jsx

```text
import { useState, useEffect } from 'react';
import { Bookmark, X, ArrowRight } from 'lucide-react';
import { getSavedRooms, removeSavedRoom } from '@/lib/chat-utils';

export default function SavedRooms({ onJoin }) {
  const [rooms, setRooms] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setRooms(getSavedRooms());
  }, []);

  const handleRemove = (roomId) => {
    removeSavedRoom(roomId);
    setRooms(getSavedRooms());
  };

  if (rooms.length === 0) return null;

  const display = showAll ? rooms : rooms.slice(0, 3);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-body flex items-center gap-1.5">
          <Bookmark size={12} /> Saved Rooms
        </h3>
        {rooms.length > 3 && (
          <button onClick={() => setShowAll(!showAll)} className="text-xs text-muted-foreground hover:text-foreground transition-colors font-body">
            {showAll ? 'Show less' : `Show all (${rooms.length})`}
          </button>
        )}
      </div>
      <div className="space-y-2">
        {display.map((r) => (
          <div key={r.room_id} className="flex items-center gap-2 p-2.5 sketch-border rounded-xl bg-card/30 hover:bg-card/50 transition-colors group">
            <button onClick={() => onJoin(r.room_id)} className="flex-1 flex items-center gap-2 text-left min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                {(r.room_name || 'W').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-body truncate">{r.room_name || 'Whisper Room'}</p>
                <p className="text-xs text-muted-foreground font-mono truncate">{r.room_id.slice(0, 12)}...</p>
              </div>
            </button>
            <button onClick={() => handleRemove(r.room_id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
              <X size={14} />
            </button>
            <ArrowRight size={16} className="text-muted-foreground shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## File: src/components/ScrollToTop.jsx

```text
import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const getHashId = (hash) => {
  const rawId = hash.slice(1);

  try {
    return decodeURIComponent(rawId);
  } catch {
    return rawId;
  }
};

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === "POP") return;

    if (hash) {
      const id = getHashId(hash);
      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 50);
      return () => window.clearTimeout(timer);
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash, navigationType]);

  return null;
}

```

## File: src/components/TabLayout.jsx

```text
import { Outlet } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';

export default function TabLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
```

## File: src/components/ThemeToggle.jsx

```text
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle({ className = '' }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('whisper_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('whisper_theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className={`p-2.5 rounded-xl sketch-fill ${className}`}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {dark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun size={18} />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon size={18} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
```

## File: src/components/UserNotRegisteredError.jsx

```text
import React from 'react';

const UserNotRegisteredError = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg border border-slate-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-orange-100">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Access Restricted</h1>
          <p className="text-slate-600 mb-8">
            You are not registered to use this application. Please contact the app administrator to request access.
          </p>
          <div className="p-4 bg-slate-50 rounded-md text-sm text-slate-600">
            <p>If you believe this is an error, you can:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Verify you are logged in with the correct account</li>
              <li>Contact the app administrator for access</li>
              <li>Try logging out and back in again</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNotRegisteredError;

```

## File: src/components/chat/ChatInput.jsx

```text
import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import EmojiPicker from './EmojiPicker';
import ReplyPreview from './ReplyPreview';
import VoiceRecorder from './VoiceRecorder';

export default function ChatInput({ onSend, onTyping, onFileUpload, onVoiceMessage, disabled, uploading, allowFiles = true, replyingTo, onReplyCancel }) {
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim(), replyingTo);
    setText('');
    onTyping('');
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    onTyping(e.target.value);
  };

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }
  }, [text]);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      toast.error('File too large (max 25MB)');
      e.target.value = '';
      return;
    }
    await onFileUpload(file);
    e.target.value = '';
  };

  return (
    <div className="relative">
      {replyingTo && <ReplyPreview replyTo={replyingTo} onCancel={onReplyCancel} />}

      <AnimatePresence>
        {showEmoji && (
          <EmojiPicker
            onSelect={(emoji) => setText((prev) => prev + emoji)}
            onClose={() => setShowEmoji(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex items-end gap-1.5">
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFile} accept="image/*,application/pdf,.doc,.docx,video/*,audio/*" />

        {allowFiles && !isRecording && (
          <button onClick={() => fileInputRef.current?.click()} disabled={disabled}
            className="p-2.5 rounded-xl hover:bg-card/40 transition-colors text-muted-foreground disabled:opacity-40 shrink-0" title="Attach file">
            <Paperclip size={20} />
          </button>
        )}

        {!isRecording && (
          <button onClick={() => setShowEmoji(!showEmoji)}
            className="p-2.5 rounded-xl hover:bg-card/40 transition-colors text-muted-foreground shrink-0" title="Emoji">
            <Smile size={20} />
          </button>
        )}

        {onVoiceMessage && (
          <VoiceRecorder onSend={onVoiceMessage} disabled={disabled} onStateChange={setIsRecording} />
        )}

        {!isRecording && (
          <>
            <textarea ref={textareaRef} value={text} onChange={handleChange} onKeyDown={handleKeyDown}
              placeholder="Type a message..." rows={1}
              className="flex-1 resize-none bg-transparent outline-none py-2.5 px-1 max-h-32 text-sm leading-relaxed placeholder:text-muted-foreground/50 font-body min-w-0" />
            <motion.button onClick={handleSend} disabled={!text.trim() || disabled} whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl sketch-fill disabled:opacity-30 transition-opacity shrink-0" title="Send (Enter)">
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}
```

## File: src/components/chat/DateSeparator.jsx

```text
import { format } from 'date-fns';

export default function DateSeparator({ date }) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  let label;
  if (d.toDateString() === today.toDateString()) label = 'Today';
  else if (d.toDateString() === yesterday.toDateString()) label = 'Yesterday';
  else label = format(d, 'EEEE, MMM d');

  return (
    <div className="flex items-center gap-3 my-3">
      <div className="flex-1 h-0 border-t-2 border-dashed border-foreground/20" />
      <span className="text-xs text-muted-foreground font-body px-3 py-1 sketch-border rounded-lg bg-card/40 whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-0 border-t-2 border-dashed border-foreground/20" />
    </div>
  );
}
```

## File: src/components/chat/EmojiPicker.jsx

```text
import { motion } from 'framer-motion';

const EMOJIS = [
  '😀', '😂', '🥰', '😍', '😎', '🤔', '😴', '🥳',
  '😭', '😡', '🤯', '😱', '👍', '👎', '👏', '🙌',
  '🤝', '👋', '🙏', '💪', '🫶', '💯', '🔥', '✨',
  '🎉', '⭐', '🌟', '⚡', '🌈', '❤️', '💔', '💜',
  '💙', '💚', '🍕', '🍔', '🍟', '🍿', '☕', '🍺',
  '🎁', '🎈', '🎵', '🎶', '📸', '💬', '🤗', '🤫',
];

export default function EmojiPicker({ onSelect, onClose }) {
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="absolute bottom-full mb-3 left-2 right-2 p-3 bg-card/80 backdrop-blur-2xl sketch-border rounded-2xl shadow-2xl z-40"
      >
        <div className="grid grid-cols-8 gap-1">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onSelect(emoji)}
              className="text-2xl p-1.5 rounded-lg hover:bg-foreground/10 transition-colors hover:scale-125 active:scale-95"
            >
              {emoji}
            </button>
          ))}
        </div>
      </motion.div>
    </>
  );
}
```

## File: src/components/chat/EmptyChatState.jsx

```text
import { motion } from 'framer-motion';
import { UserPlus, MessageCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function EmptyChatState({ roomId, isWaiting }) {
  const copyLink = () => {
    const url = `${window.location.origin}/chat/${roomId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  if (isWaiting) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-2xl sketch-fill flex items-center justify-center mb-6"
        >
          <UserPlus size={32} />
        </motion.div>
        <h2 className="text-xl font-heading font-bold mb-2">Waiting for someone to join</h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-xs font-body">
          Share the room link below with anyone you want to chat with
        </p>
        <button
          onClick={copyLink}
          className="flex items-center gap-2 px-5 py-2.5 sketch-fill rounded-xl text-sm font-heading font-bold"
        >
          <Copy size={16} /> Copy Room Link
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-16 h-16 rounded-2xl bg-card/50 flex items-center justify-center mb-4 sketch-border"
      >
        <MessageCircle size={28} className="text-primary" />
      </motion.div>
      <h2 className="text-lg font-heading font-bold mb-1">No messages yet</h2>
      <p className="text-muted-foreground text-sm font-body">
        Send the first message to start the conversation
      </p>
    </div>
  );
}
```

## File: src/components/chat/LinkText.jsx

```text
export default function LinkText({ text }) {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return (
    <>
      {parts.map((part, i) => {
        if (part && part.match(urlRegex)) {
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:opacity-80 break-all"
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
```

## File: src/components/chat/MessageBubble.jsx

```text
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCheck, Check, Copy, Trash2, SmilePlus, CornerUpLeft, Star, Pencil, Pin, Languages } from 'lucide-react';
import Avatar from '@/components/Avatar';
import { formatTime } from '@/lib/chat-utils';
import MessageContent from './MessageContent';
import ReactionPicker from './ReactionPicker';

export default function MessageBubble({ message, isMine, showAvatar, onReact, onCopy, onDelete, onReply, onStar, onEdit, onPin, isOwner, currentUserId, viewerLang, autoTranslate }) {
  const [showActions, setShowActions] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(message.content || '');
  const [manualTranslate, setManualTranslate] = useState(false);

  let reactions = {};
  try { reactions = JSON.parse(message.reactions || '{}'); } catch { reactions = {}; }
  const reactionEntries = Object.entries(reactions).filter(([, users]) => users.length > 0);

  let reply = null;
  try { reply = message.reply_to ? JSON.parse(message.reply_to) : null; } catch { reply = null; }

  const handleSaveEdit = () => {
    if (editText.trim() && editText.trim() !== message.content) {
      onEdit(message.id, editText.trim());
    }
    setEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`group flex gap-2 items-end ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => { setShowActions(false); setShowPicker(false); }}
    >
      {showAvatar && !isMine && (
        <Avatar name={message.sender_name} color={message.sender_avatar_color} avatarUrl={message.sender_avatar_url} size={32} />
      )}
      {!showAvatar && !isMine && <div className="w-8 shrink-0" />}
      {isMine && <div className="w-1 shrink-0" />}

      <div className={`max-w-[75%] md:max-w-[65%] flex flex-col ${isMine ? 'items-end' : 'items-start'} relative`}>
        {message.pinned && (
          <div className={`flex items-center gap-1 mb-1 text-[10px] text-primary ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
            <Pin size={10} className="rotate-45" fill="currentColor" /> Pinned
          </div>
        )}

        {reply && (
          <div className="px-3 py-1.5 mb-1 text-xs sketch-border bg-card/30 rounded-xl border-l-2 border-primary max-w-full overflow-hidden">
            <p className="font-body font-medium text-primary truncate">{reply.name}</p>
            <p className="text-muted-foreground truncate">{reply.content}</p>
          </div>
        )}

        {editing ? (
          <div className="px-3 py-2 rounded-2xl shadow-lg sketch-border bg-card/70 w-full">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              autoFocus
              rows={2}
              className="w-full bg-transparent outline-none text-sm font-body resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSaveEdit(); }
                if (e.key === 'Escape') setEditing(false);
              }}
            />
            <div className="flex items-center gap-2 justify-end mt-1">
              <button onClick={() => setEditing(false)} className="px-2 py-1 text-xs rounded-lg hover:bg-card/40 text-muted-foreground font-body">Cancel</button>
              <button onClick={handleSaveEdit} className="px-2 py-1 text-xs rounded-lg sketch-fill font-body">Save</button>
            </div>
          </div>
        ) : (
          <MessageContent message={message} isMine={isMine} viewerLang={viewerLang} autoTranslate={autoTranslate} manualTranslate={manualTranslate} />
        )}

        {reactionEntries.length > 0 && (
          <div className={`flex gap-1 flex-wrap mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
            {reactionEntries.map(([emoji, users]) => (
              <button
                key={emoji}
                onClick={() => onReact(message, emoji)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs sketch-border transition-colors ${
                  users.includes(currentUserId) ? 'bg-primary/20' : 'bg-card/50'
                }`}
              >
                <span>{emoji}</span>
                <span className="font-body">{users.length}</span>
              </button>
            ))}
          </div>
        )}

        <AnimatePresence>
          {showActions && !editing && (
            <motion.div
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              className={`flex items-center gap-0.5 mt-1 relative ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <button onClick={() => setShowPicker(!showPicker)} className="p-1 rounded-lg hover:bg-card/40 text-muted-foreground transition-colors" title="React"><SmilePlus size={14} /></button>
              <button onClick={() => onReply(message)} className="p-1 rounded-lg hover:bg-card/40 text-muted-foreground transition-colors" title="Reply"><CornerUpLeft size={14} /></button>
              <button onClick={() => onCopy(message.content)} className="p-1 rounded-lg hover:bg-card/40 text-muted-foreground transition-colors" title="Copy"><Copy size={14} /></button>
              {message.message_type === 'text' && message.content && (
                <button onClick={() => setManualTranslate((v) => !v)} className={`p-1 rounded-lg hover:bg-card/40 transition-colors ${manualTranslate ? 'text-primary' : 'text-muted-foreground'}`} title="Translate"><Languages size={14} /></button>
              )}
              <button onClick={() => onStar(message)} className={`p-1 rounded-lg hover:bg-card/40 transition-colors ${message.starred ? 'text-amber-500' : 'text-muted-foreground'}`} title="Star"><Star size={14} fill={message.starred ? 'currentColor' : 'none'} /></button>
              {isMine && message.message_type === 'text' && (
                <button onClick={() => { setEditText(message.content || ''); setEditing(true); }} className="p-1 rounded-lg hover:bg-card/40 text-muted-foreground transition-colors" title="Edit"><Pencil size={14} /></button>
              )}
              {isMine && (
                <button onClick={() => onDelete(message.id)} className="p-1 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors" title="Delete"><Trash2 size={14} /></button>
              )}
              {isOwner && (
                <button onClick={() => onPin(message)} className={`p-1 rounded-lg hover:bg-card/40 transition-colors ${message.pinned ? 'text-primary' : 'text-muted-foreground'}`} title="Pin"><Pin size={14} /></button>
              )}
              <AnimatePresence>
                {showPicker && (
                  <ReactionPicker
                    onSelect={(emoji) => { onReact(message, emoji); setShowPicker(false); }}
                    onClose={() => setShowPicker(false)}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`flex items-center gap-1.5 mt-0.5 px-1 text-[10px] text-muted-foreground ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
          <span>{formatTime(message.created_date)}</span>
          {message.edited && <span className="italic opacity-70">edited</span>}
          {message.starred && <Star size={10} className="text-amber-500" fill="currentColor" />}
          {isMine && message.seen && (
            <span className="flex items-center gap-0.5 text-primary"><CheckCheck size={12} /><span>Seen</span></span>
          )}
          {isMine && !message.seen && <Check size={12} className="text-muted-foreground/50" />}
        </div>
      </div>
    </motion.div>
  );
}
```

## File: src/components/chat/MessageContent.jsx

```text
import { FileText, Download, Music } from 'lucide-react';
import LinkText from './LinkText';
import TranslatedText from './TranslatedText';

export default function MessageContent({ message, isMine, viewerLang, autoTranslate, manualTranslate }) {
  const isFile = message.message_type !== 'text';

  if (message.message_type === 'image' && message.file_url) {
    return (
      <div className="rounded-2xl overflow-hidden shadow-lg sketch-border">
        <img src={message.file_url} alt={message.file_name || 'image'} className="max-w-full max-h-64 object-cover block" />
        {message.content && message.content !== message.file_name && (
          <p className="text-xs px-3 py-1.5 bg-card/60"><LinkText text={message.content} /></p>
        )}
      </div>
    );
  }

  if (message.message_type === 'video' && message.file_url) {
    return (
      <div className="rounded-2xl overflow-hidden shadow-lg sketch-border">
        <video src={message.file_url} controls className="max-w-full max-h-64 block" />
      </div>
    );
  }

  if (message.message_type === 'audio' && message.file_url) {
    return (
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg sketch-border ${isMine ? 'sketch-fill' : 'bg-card/70'}`}>
        <Music size={20} className="shrink-0" />
        <audio src={message.file_url} controls className="max-w-[200px] h-8" />
      </div>
    );
  }

  if (isFile && message.file_url) {
    return (
      <a href={message.file_url} download={message.file_name || 'file'} target="_blank" rel="noopener noreferrer"
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg transition-transform hover:scale-[1.02] sketch-border ${isMine ? 'sketch-fill' : 'bg-card/70'}`}>
        <div className="p-2 rounded-lg bg-foreground/10"><FileText size={20} className="shrink-0" /></div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate max-w-[180px]">{message.file_name || 'File'}</p>
          <p className="text-xs opacity-70">Click to download</p>
        </div>
        <Download size={16} className="shrink-0 opacity-60" />
      </a>
    );
  }

  return (
    <div className={`px-4 py-2.5 rounded-2xl shadow-lg break-words ${
      isMine ? 'sketch-fill rounded-br-md' : 'bg-card/70 text-foreground rounded-bl-md sketch-border'
    }`}>
      <TranslatedText
        text={message.content}
        targetLang={viewerLang || 'en'}
        enabled={manualTranslate || (!isMine && autoTranslate)}
      />
    </div>
  );
}
```

## File: src/components/chat/MessageSearch.jsx

```text
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
```

## File: src/components/chat/PinnedMessages.jsx

```text
import { Pin, X } from 'lucide-react';

export default function PinnedMessages({ pinnedMessages, onUnpin }) {
  if (!pinnedMessages || pinnedMessages.length === 0) return null;

  return (
    <div className="px-4 py-2 border-b border-foreground/20 bg-card/30 max-h-32 overflow-y-auto scrollbar-thin">
      {pinnedMessages.map((msg) => (
        <div key={msg.id} className="flex items-start gap-2 py-1">
          <Pin size={14} className="text-primary shrink-0 mt-0.5 rotate-45" fill="currentColor" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-body font-medium text-primary truncate">{msg.sender_name}</p>
            <p className="text-sm text-muted-foreground truncate">{msg.content || msg.file_name || 'Media message'}</p>
          </div>
          {onUnpin && (
            <button onClick={() => onUnpin(msg.id)} className="p-0.5 rounded hover:bg-card/40 text-muted-foreground shrink-0 mt-0.5">
              <X size={12} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

## File: src/components/chat/ReactionPicker.jsx

```text
import { motion } from 'framer-motion';

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🔥', '👏'];

export default function ReactionPicker({ onSelect, onClose }) {
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 5, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 5, scale: 0.9 }}
        transition={{ duration: 0.15 }}
        className="flex gap-1 p-2 bg-card/90 backdrop-blur-xl sketch-border rounded-2xl shadow-xl z-40 absolute bottom-full mb-1 left-0"
      >
        {QUICK_REACTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className="text-xl p-1.5 rounded-lg hover:bg-foreground/10 transition-transform hover:scale-125 active:scale-95"
          >
            {emoji}
          </button>
        ))}
      </motion.div>
    </>
  );
}
```

## File: src/components/chat/ReplyPreview.jsx

```text
import { X } from 'lucide-react';

export default function ReplyPreview({ replyTo, onCancel }) {
  let reply;
  try { reply = JSON.parse(replyTo); } catch { return null; }
  if (!reply) return null;

  return (
    <div className="flex items-center gap-2 mb-2 px-3 py-2 sketch-border bg-card/40 rounded-xl">
      <div className="w-1 h-8 bg-primary rounded-full shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-body font-medium text-primary">{reply.name}</p>
        <p className="text-xs text-muted-foreground truncate">{reply.content}</p>
      </div>
      <button
        onClick={onCancel}
        className="p-1 rounded-lg hover:bg-card/40 text-muted-foreground shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}
```

## File: src/components/chat/RoomInfo.jsx

```text
import { toast } from 'sonner';
import {
  X, Copy, Share2, LogOut, Clock, Settings, Users, Crown,
  Star, Bookmark, Image as ImageIcon,
} from 'lucide-react';
import Avatar from '@/components/Avatar';
import { saveRoom } from '@/lib/chat-utils';

export default function RoomInfo({
  room, roomId, participant, participants, isOwner, messages,
  onLeave, onClose, onOpenSettings, onShowStarred, starredCount,
}) {
  const copyLink = () => {
    const url = `${window.location.origin}/chat/${roomId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const shareLink = async () => {
    const url = `${window.location.origin}/chat/${roomId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Join my chat room', text: 'Let\'s chat anonymously', url });
      } catch { /* cancelled */ }
    } else {
      copyLink();
    }
  };

  const handleSaveRoom = () => {
    saveRoom(roomId, room?.room_name || '');
    toast.success('Room saved! Find it on the home page.');
  };

  const onlineCount = participants.filter((p) => p.online).length;
  const mediaMessages = messages?.filter((m) => m.message_type === 'image' && m.file_url) || [];

  return (
    <div className="glass-card h-full flex flex-col p-5 overflow-y-auto scrollbar-thin">
      {onClose && (
        <button onClick={onClose} className="md:hidden self-end p-1.5 rounded-lg hover:bg-card/40 transition-colors mb-2">
          <X size={20} />
        </button>
      )}

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">
              {(room?.room_name || 'W').charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-lg font-heading font-bold">{room?.room_name || 'Whisper Room'}</h2>
        </div>
        <p className="text-xs text-muted-foreground font-mono truncate">{roomId}</p>
      </div>

      <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
        <Users size={14} />
        <span>{participants.length} / {room?.max_participants || 2} joined</span>
        <span className="w-1 h-1 rounded-full bg-muted-foreground" />
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          {onlineCount} online
        </span>
      </div>

      <div className="space-y-2 mb-6">
        <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">Participants</h3>
        {participants.map((p) => {
          const isMe = p.participant_id === participant?.id;
          return (
            <div key={p.id} className="flex items-center gap-3">
              <div className="relative shrink-0">
                <Avatar name={p.name} color={p.avatar_color} avatarUrl={p.avatar_url} size={36} />
                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card ${p.online ? 'bg-green-500' : 'bg-muted-foreground'}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate font-body">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.online ? 'Online' : 'Offline'}</p>
              </div>
              {p.is_owner && (
                <span className="flex items-center gap-1 text-[10px] text-amber-500 px-1.5 py-0.5 rounded-full bg-amber-500/10">
                  <Crown size={10} /> Owner
                </span>
              )}
              {isMe && !p.is_owner && (
                <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full bg-card/40">You</span>
              )}
            </div>
          );
        })}
        {participants.length === 0 && (
          <p className="text-xs text-muted-foreground italic">Loading participants...</p>
        )}
      </div>

      {mediaMessages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2 flex items-center gap-1">
            <ImageIcon size={12} /> Shared Media
          </h3>
          <div className="grid grid-cols-3 gap-1.5">
            {mediaMessages.slice(0, 9).map((m) => (
              <a key={m.id} href={m.file_url} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-lg overflow-hidden sketch-border">
                <img src={m.file_url} alt={m.file_name || 'media'} className="w-full h-full object-cover" />
              </a>
            ))}
          </div>
        </div>
      )}

      {room?.created_date && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Clock size={12} />
          <span>Created {new Date(room.created_date).toLocaleDateString()}</span>
        </div>
      )}

      <div className="space-y-2 mt-auto">
        {isOwner && (
          <button onClick={onOpenSettings}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-colors text-sm font-medium font-body">
            <Settings size={16} /> Room Settings
          </button>
        )}
        {onShowStarred && (
          <button onClick={onShowStarred}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card/40 hover:bg-card/60 transition-colors text-sm font-medium font-body">
            <Star size={16} /> Starred ({starredCount || 0})
          </button>
        )}
        <button onClick={handleSaveRoom}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card/40 hover:bg-card/60 transition-colors text-sm font-medium font-body">
          <Bookmark size={16} /> Save Room
        </button>
        <button onClick={copyLink}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card/40 hover:bg-card/60 transition-colors text-sm font-medium font-body">
          <Copy size={16} /> Copy Link
        </button>
        <button onClick={shareLink}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card/40 hover:bg-card/60 transition-colors text-sm font-medium font-body">
          <Share2 size={16} /> Share
        </button>
        <button onClick={onLeave}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors text-sm font-medium text-red-500 dark:text-red-400 font-body">
          <LogOut size={16} /> Leave Room
        </button>
      </div>
    </div>
  );
}
```

## File: src/components/chat/SettingsPanel.jsx

```text
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  X, Settings, Users, Trash2, AlertTriangle, Crown,
} from 'lucide-react';
import { LANGUAGES } from '@/lib/languages';

const MAX_OPTIONS = [2, 5, 10, 25, 50];

export default function SettingsPanel({ room, isOpen, onClose, onUpdate, onClearMessages, onEndRoom }) {
  const [roomName, setRoomName] = useState(room?.room_name || '');
  const [maxParticipants, setMaxParticipants] = useState(room?.max_participants || 2);
  const [allowFileSharing, setAllowFileSharing] = useState(room?.allow_file_sharing ?? true);
  const [allowNewJoins, setAllowNewJoins] = useState(room?.allow_new_joins ?? true);
  const [typingPreview, setTypingPreview] = useState(room?.typing_preview_visible ?? true);
  const [messageNotifs, setMessageNotifs] = useState(room?.message_notifications ?? true);
  const [roomLang, setRoomLang] = useState(room?.language || '');
  const [saving, setSaving] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate({
        room_name: roomName.trim(),
        max_participants: maxParticipants,
        allow_file_sharing: allowFileSharing,
        allow_new_joins: allowNewJoins,
        typing_preview_visible: typingPreview,
        message_notifications: messageNotifs,
        language: roomLang,
      });
      toast.success('Settings updated');
      onClose();
    } catch {
      toast.error('Failed to update settings');
    }
    setSaving(false);
  };

  const handleClearMessages = async () => {
    try {
      await onClearMessages();
      toast.success('All messages cleared');
      setConfirmClear(false);
    } catch {
      toast.error('Failed to clear messages');
    }
  };

  const handleEndRoom = async () => {
    try {
      await onEndRoom();
    } catch {
      toast.error('Failed to end room');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-md max-h-[85vh] overflow-y-auto scrollbar-thin z-50 glass-card p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                  <Settings size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Room Settings</h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Crown size={10} className="text-amber-500" /> Owner only
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/20 dark:hover:bg-white/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5">
              {/* Room Name */}
              <div>
                <label className="text-xs text-slate-400 dark:text-slate-500 mb-1.5 block font-medium">
                  Room name
                </label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Whisper Room"
                  maxLength={30}
                  className="w-full px-3 py-2.5 rounded-xl bg-card/30 sketch-border outline-none focus:border-primary transition-colors text-sm"
                />
              </div>

              {/* Max Participants */}
              <div>
                <label className="text-xs text-slate-400 dark:text-slate-500 mb-1.5 block font-medium flex items-center gap-1.5">
                  <Users size={12} /> Max participants
                </label>
                <div className="flex gap-2 flex-wrap">
                  {MAX_OPTIONS.map((n) => (
                    <button
                      key={n}
                      onClick={() => setMaxParticipants(n)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        maxParticipants === n
                          ? 'sketch-fill shadow-md'
                          : 'bg-card/30 hover:bg-white/40 dark:hover:bg-white/10'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room Language */}
              <div>
                <label className="text-xs text-slate-400 dark:text-slate-500 mb-1.5 block font-medium">
                  Room language
                </label>
                <select
                  value={roomLang}
                  onChange={(e) => setRoomLang(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-card/30 sketch-border outline-none text-sm"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
              </div>

              {/* Toggles */}
              <ToggleRow
                label="Allow file sharing"
                desc="Let participants upload files"
                value={allowFileSharing}
                onChange={setAllowFileSharing}
              />
              <ToggleRow
                label="Allow new joins"
                desc="New people can join with the link"
                value={allowNewJoins}
                onChange={setAllowNewJoins}
              />
              <ToggleRow
                label="Typing preview"
                desc="Show what others are typing"
                value={typingPreview}
                onChange={setTypingPreview}
              />
              <ToggleRow
                label="Join notifications"
                desc="Notify when someone joins"
                value={messageNotifs}
                onChange={setMessageNotifs}
              />

              {/* Danger Zone */}
              <div className="pt-4 border-t border-white/10 dark:border-white/5 space-y-2">
                <p className="text-xs uppercase tracking-widest text-red-400 dark:text-red-500 font-semibold flex items-center gap-1.5">
                  <AlertTriangle size={12} /> Danger Zone
                </p>

                {!confirmClear ? (
                  <button
                    onClick={() => setConfirmClear(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors text-sm font-medium text-red-500 dark:text-red-400"
                  >
                    <Trash2 size={16} /> Clear All Messages
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 space-y-2">
                    <p className="text-xs text-red-500 dark:text-red-400 text-center">
                      Delete ALL messages in this room?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmClear(false)}
                        className="flex-1 px-3 py-2 rounded-lg bg-card/30 hover:bg-white/30 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleClearMessages}
                        className="flex-1 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors text-sm font-medium text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}

                {!confirmEnd ? (
                  <button
                    onClick={() => setConfirmEnd(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors text-sm font-medium text-red-500 dark:text-red-400"
                  >
                    <AlertTriangle size={16} /> End Room
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 space-y-2">
                    <p className="text-xs text-red-500 dark:text-red-400 text-center">
                      Permanently end this room? All data will be deleted.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmEnd(false)}
                        className="flex-1 px-3 py-2 rounded-lg bg-card/30 hover:bg-white/30 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleEndRoom}
                        className="flex-1 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors text-sm font-medium text-white"
                      >
                        End Room
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Save */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl sketch-fill font-heading font-bold shadow-lg disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ToggleRow({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {desc && <p className="text-xs text-slate-400 dark:text-slate-500">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
          value ? 'bg-primary border-primary' : 'bg-transparent border-2 border-foreground'
        }`}
      >
        <motion.div
          animate={{ x: value ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={`absolute top-0.5 w-5 h-5 rounded-full shadow-md ${value ? 'bg-primary-foreground' : 'bg-foreground'}`}
        />
      </button>
    </div>
  );
}
```

## File: src/components/chat/StarredMessages.jsx

```text
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { formatTime } from '@/lib/chat-utils';
import MessageContent from './MessageContent';

export default function StarredMessages({ messages, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card w-full max-w-md max-h-[75vh] flex flex-col p-5"
        >
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-lg font-heading font-bold flex items-center gap-2">
              <Star size={18} className="text-amber-500" fill="currentColor" /> Starred Messages
            </h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-card/40 text-muted-foreground">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Star size={36} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm font-body">No starred messages yet</p>
                <p className="text-xs font-body mt-1 opacity-70">Star important messages to find them here</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="p-3 sketch-border rounded-xl bg-card/40">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-body font-medium text-primary">{msg.sender_name}</span>
                    <span className="text-[10px] text-muted-foreground">{formatTime(msg.created_date)}</span>
                  </div>
                  <MessageContent message={msg} isMine={false} />
                </div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
```

## File: src/components/chat/TranslatedText.jsx

```text
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Languages, Loader2 } from 'lucide-react';
import LinkText from './LinkText';
import { useTranslation } from '@/hooks/useTranslation';

export default function TranslatedText({ text, targetLang, enabled }) {
  const [showOriginal, setShowOriginal] = useState(false);
  const navigate = useNavigate();
  const { translated, loading, error } = useTranslation(text, targetLang, enabled);

  if (!enabled || !targetLang) {
    return <p className="text-sm whitespace-pre-wrap leading-relaxed"><LinkText text={text} /></p>;
  }

  if (error === 'NO_API_KEY' && !translated) {
    return (
      <div>
        <p className="text-sm whitespace-pre-wrap leading-relaxed"><LinkText text={text} /></p>
        <button
          onClick={() => navigate('/settings')}
          className="inline-flex items-center gap-1 text-[11px] font-hand text-primary mt-1 hover:underline underline-offset-2"
        >
          <Languages size={11} /> set OpenRouter key to translate
        </button>
      </div>
    );
  }

  if (loading && !translated) {
    return (
      <div>
        <p className="text-sm whitespace-pre-wrap leading-relaxed opacity-80"><LinkText text={text} /></p>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-hand text-muted-foreground mt-1">
          <Loader2 size={11} className="animate-spin text-primary" />
          <span>translating…</span>
        </span>
      </div>
    );
  }

  if (!translated || translated === text) {
    return <p className="text-sm whitespace-pre-wrap leading-relaxed"><LinkText text={text} /></p>;
  }

  if (showOriginal) {
    return (
      <div>
        <p className="text-sm whitespace-pre-wrap leading-relaxed"><LinkText text={text} /></p>
        <button
          onClick={() => setShowOriginal(false)}
          className="inline-flex items-center gap-1 text-[11px] font-hand text-primary mt-1 hover:underline underline-offset-2"
        >
          <Languages size={11} /> see translation
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm whitespace-pre-wrap leading-relaxed"><LinkText text={translated} /></p>
      <button
        onClick={() => setShowOriginal(true)}
        className="inline-flex items-center gap-1 text-[11px] font-hand text-muted-foreground mt-1 hover:text-foreground hover:underline underline-offset-2 transition-colors"
      >
        <Languages size={11} /> translated · see original
      </button>
    </div>
  );
}

```

## File: src/components/chat/TypingIndicator.jsx

```text
import { motion } from 'framer-motion';
import Avatar from '@/components/Avatar';

export default function TypingIndicator({ name, color, avatarUrl, text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex items-end gap-2"
    >
      {name && <Avatar name={name} color={color} avatarUrl={avatarUrl} size={32} />}
      <div className="px-4 py-2.5 rounded-2xl rounded-bl-md bg-card/70 sketch-border shadow-lg max-w-[75%] md:max-w-[65%]">
        {text ? (
          <p className="text-sm text-muted-foreground italic break-words leading-relaxed font-body">
            {text.slice(0, 120)}
            <span className="inline-block w-0.5 h-3.5 ml-0.5 bg-muted-foreground animate-pulse align-middle" />
          </p>
        ) : (
          <div className="flex items-center gap-1 py-0.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-muted-foreground"
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
```

## File: src/components/chat/VoiceRecorder.jsx

```text
import { useState, useRef, useEffect } from 'react';
import { Mic, X, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function VoiceRecorder({ onSend, disabled, onStateChange }) {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    onStateChange?.(recording);
  }, [recording, onStateChange]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        if (chunksRef.current.length === 0) return;
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], `voice-${Date.now()}.webm`, { type: 'audio/webm' });
        onSend(file);
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      toast.error('Microphone access denied');
    }
  };

  const stopRecording = (send) => {
    if (mediaRecorderRef.current) {
      if (!send) mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    if (timerRef.current) clearInterval(timerRef.current);
    setRecording(false);
    setDuration(0);
  };

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
  }, []);

  const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (recording) {
    return (
      <div className="flex items-center gap-2 w-full flex-1">
        <button onClick={() => stopRecording(false)} className="p-2.5 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors shrink-0" title="Cancel">
          <X size={20} />
        </button>
        <div className="flex-1 flex items-center gap-2 px-2 min-w-0">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span className="text-sm font-body text-muted-foreground tabular-nums shrink-0">{fmt(duration)}</span>
          <div className="flex-1 h-1.5 bg-foreground/10 rounded-full overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${Math.min(duration * 4, 100)}%` }} transition={{ ease: 'linear' }} />
          </div>
          <span className="text-xs text-muted-foreground font-body shrink-0 hidden sm:inline">Recording...</span>
        </div>
        <button onClick={() => stopRecording(true)} disabled={duration === 0} className="p-2.5 rounded-xl sketch-fill shrink-0 disabled:opacity-40" title="Send voice message">
          <Send size={18} />
        </button>
      </div>
    );
  }

  return (
    <button onClick={startRecording} disabled={disabled} className="p-2.5 rounded-xl hover:bg-card/40 transition-colors text-muted-foreground disabled:opacity-40 shrink-0" title="Voice message">
      <Mic size={20} />
    </button>
  );
}
```

## File: src/components/messages/ConversationItem.jsx

```text
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import Avatar from '@/components/Avatar';
import { formatRelativeTime } from '@/lib/chat-utils';

export default function ConversationItem({ convo, myName }) {
  const navigate = useNavigate();
  const { room, display } = convo;
  const preview = room.last_message_preview || 'Say hi 👋';
  const senderName = room.last_sender_name;
  const prefix = senderName === myName
    ? 'You: '
    : display.isGroup && senderName
    ? `${senderName.split(' ')[0]}: `
    : '';

  return (
    <button
      onClick={() => navigate(`/chat/${room.room_id}`)}
      className="w-full flex items-center gap-3 p-3 hover:bg-card/40 transition-colors text-left"
    >
      {display.isGroup ? (
        <div className="w-12 h-12 rounded-full sketch-border bg-card/50 flex items-center justify-center shrink-0">
          <Users size={22} />
        </div>
      ) : (
        <Avatar name={display.name} color={display.color} avatarUrl={display.avatar_url} size={48} />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-body font-medium truncate">{display.name}</p>
        <p className="text-xs text-muted-foreground truncate">{prefix}{preview}</p>
      </div>
      {room.last_message_at && (
        <span className="text-[10px] text-muted-foreground shrink-0 font-body">
          {formatRelativeTime(room.last_message_at)}
        </span>
      )}
    </button>
  );
}
```

## File: src/components/messages/NewChatModal.jsx

```text
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { X, User, Users, Link2, Plus, Search, Loader2, Check } from 'lucide-react';

import { generateRoomId, getLocalProfile, setLocalParticipant, sanitizeUsername } from '@/lib/chat-utils';
import { LANGUAGES } from '@/lib/languages';

export default function NewChatModal({ onClose }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('direct');
  const [username, setUsername] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState([]);
  const [memberInput, setMemberInput] = useState('');
  const [joinLink, setJoinLink] = useState('');
  const [busy, setBusy] = useState(false);
  const [createdRoomId, setCreatedRoomId] = useState(null);
  const [groupLang, setGroupLang] = useState('');

  const me = getLocalProfile();

  const searchUser = async (value) => {
    const clean = sanitizeUsername(value);
    if (clean.length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const matches = await db.entities.Profile.filter({ username: clean });
      setResults(matches.filter((m) => m.profile_id !== me?.profile_id).slice(0, 6));
    } catch {
      setResults([]);
    }
    setSearching(false);
  };

  const startDirect = async (other) => {
    if (!me) return;
    setBusy(true);
    try {
      const roomId = generateRoomId();
      await db.entities.ChatRoom.create({
        room_id: roomId, owner_id: me.profile_id, room_name: '', max_participants: 2,
        allow_file_sharing: true, allow_new_joins: true, typing_preview_visible: true,
        message_notifications: true, status: 'active',
        last_message_preview: '', last_message_at: '',
      });
      await db.entities.RoomParticipant.create({
        room_id: roomId, participant_id: me.profile_id, name: me.display_name,
        avatar_color: me.avatar_color, avatar_url: me.avatar_url || '',
        online: true, typing: false, typing_text: '', is_owner: true,
      });
      await db.entities.RoomParticipant.create({
        room_id: roomId, participant_id: other.profile_id, name: other.display_name,
        avatar_color: other.avatar_color, avatar_url: other.avatar_url || '',
        online: false, typing: false, typing_text: '', is_owner: false,
      });
      setLocalParticipant(roomId, {
        id: me.profile_id, name: me.display_name, color: me.avatar_color,
        avatar_url: me.avatar_url, username: me.username,
      });
      await db.entities.Notification.create({
        recipient_id: other.profile_id, actor_id: me.profile_id, actor_name: me.username,
        actor_avatar_color: me.avatar_color, actor_avatar_url: me.avatar_url || '',
        type: 'message', text: 'started a conversation with you.', target_id: roomId,
      }).catch(() => {});
      navigate(`/chat/${roomId}`);
    } catch {
      toast.error('Failed to start chat');
    }
    setBusy(false);
  };

  const addMember = async () => {
    const u = sanitizeUsername(memberInput);
    if (!u) return;
    if (members.find((m) => m.username === u)) {
      toast.error('Already added');
      return;
    }
    try {
      const matches = await db.entities.Profile.filter({ username: u });
      const found = matches.find((m) => m.profile_id !== me?.profile_id);
      if (!found) {
        toast.error('User not found');
        return;
      }
      setMembers((prev) => [...prev, found]);
      setMemberInput('');
    } catch {
      toast.error('Search failed');
    }
  };

  const createGroup = async () => {
    if (!me) return;
    setBusy(true);
    try {
      const roomId = generateRoomId();
      await db.entities.ChatRoom.create({
        room_id: roomId, owner_id: me.profile_id,
        room_name: groupName.trim() || 'Group', max_participants: 50,
        allow_file_sharing: true, allow_new_joins: true, typing_preview_visible: true,
        message_notifications: true, status: 'active',
        last_message_preview: '', last_message_at: '',
        language: groupLang,
      });
      await db.entities.RoomParticipant.create({
        room_id: roomId, participant_id: me.profile_id, name: me.display_name,
        avatar_color: me.avatar_color, avatar_url: me.avatar_url || '',
        online: true, typing: false, typing_text: '', is_owner: true,
      });
      await Promise.all(
        members.map((m) =>
          db.entities.RoomParticipant.create({
            room_id: roomId, participant_id: m.profile_id, name: m.display_name,
            avatar_color: m.avatar_color, avatar_url: m.avatar_url || '',
            online: false, typing: false, typing_text: '', is_owner: false,
          })
        )
      );
      setLocalParticipant(roomId, {
        id: me.profile_id, name: me.display_name, color: me.avatar_color,
        avatar_url: me.avatar_url, username: me.username,
      });
      await Promise.all(
        members.map((m) =>
          db.entities.Notification.create({
            recipient_id: m.profile_id, actor_id: me.profile_id, actor_name: me.username,
            actor_avatar_color: me.avatar_color, actor_avatar_url: me.avatar_url || '',
            type: 'message', text: `added you to "${groupName.trim() || 'Group'}".`, target_id: roomId,
          }).catch(() => {})
        )
      );
      setCreatedRoomId(roomId);
    } catch {
      toast.error('Failed to create group');
    }
    setBusy(false);
  };

  const joinRoom = () => {
    let id = joinLink.trim();
    if (!id) return;
    if (id.includes('/chat/')) id = id.split('/chat/')[1].split(/[/?#]/)[0];
    if (id) {
      if (me) {
        setLocalParticipant(id, {
          id: me.profile_id, name: me.display_name, color: me.avatar_color,
          avatar_url: me.avatar_url, username: me.username,
        });
      }
      navigate(`/chat/${id}`);
    }
  };

  const groupLink = createdRoomId ? `${window.location.origin}/chat/${createdRoomId}` : '';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(groupLink);
      toast.success('Link copied');
    } catch {
      toast.error('Could not copy');
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: groupName.trim() || 'Group chat', url: groupLink });
      } catch {
        // cancelled
      }
    } else {
      copyLink();
    }
  };

  const tabs = [['direct', 'Direct', User], ['group', 'Group', Users], ['join', 'Join', Link2]];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.92, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card w-full max-w-md p-5 max-h-[85vh] overflow-y-auto scrollbar-thin"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-bold">New</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-card/40">
              <X size={18} />
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            {tabs.map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => { setTab(key); setCreatedRoomId(null); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-body transition-colors ${
                  tab === key ? 'sketch-fill' : 'sketch-border bg-card/30'
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {tab === 'direct' && (
            <div>
              <p className="text-xs text-muted-foreground font-body mb-2">Search by @username</p>
              <div className="flex items-center gap-2 px-3 py-2 sketch-border rounded-xl bg-card/30 mb-3">
                <Search size={16} className="text-muted-foreground" />
                <input
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    searchUser(e.target.value);
                  }}
                  placeholder="username"
                  className="flex-1 bg-transparent outline-none text-sm font-body lowercase"
                />
              </div>
              {searching && (
                <p className="text-xs text-muted-foreground text-center py-2">Searching…</p>
              )}
              <div className="space-y-1">
                {results.map((r) => (
                  <button
                    key={r.profile_id}
                    onClick={() => startDirect(r)}
                    disabled={busy}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-card/40 transition-colors text-left"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shrink-0"
                      style={{ background: r.avatar_color || 'linear-gradient(135deg,#667eea,#764ba2)' }}
                    >
                      {(r.display_name || '?').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body font-medium truncate">{r.display_name}</p>
                      <p className="text-xs text-muted-foreground truncate">@{r.username}</p>
                    </div>
                  </button>
                ))}
                {!searching && username && results.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-3">No users found</p>
                )}
              </div>
            </div>
          )}

          {tab === 'group' && (
            createdRoomId ? (
              <div className="text-center py-2">
                <div className="w-14 h-14 rounded-full sketch-fill mx-auto flex items-center justify-center mb-3">
                  <Check size={28} className="text-primary-foreground" />
                </div>
                <p className="text-sm font-body font-medium mb-1">Group created!</p>
                <p className="text-xs text-muted-foreground font-body mb-4">
                  Share this link — anyone who opens it can join and chat with you.
                </p>
                <div className="flex items-center gap-2 px-3 py-2 sketch-border rounded-xl bg-card/30 mb-3">
                  <Link2 size={14} className="text-muted-foreground shrink-0" />
                  <input
                    readOnly
                    value={groupLink}
                    onClick={(e) => e.target.select()}
                    className="flex-1 bg-transparent outline-none text-xs font-body truncate"
                  />
                  <button onClick={copyLink} className="text-xs font-body text-primary shrink-0">
                    Copy
                  </button>
                </div>
                <div className="flex gap-2">
                  <button onClick={shareLink} className="flex-1 py-2.5 sketch-border rounded-xl text-sm font-body">
                    Share
                  </button>
                  <button
                    onClick={() => navigate(`/chat/${createdRoomId}`)}
                    className="flex-1 py-2.5 sketch-fill rounded-xl text-sm font-heading font-bold"
                  >
                    Open chat
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground font-body mb-1.5 block">Group name</label>
                  <input
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="My Group"
                    maxLength={30}
                    className="w-full px-3 py-2.5 glass-input text-sm font-body"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-body mb-1.5 block">Group language (what you'll write in)</label>
                  <select
                    value={groupLang}
                    onChange={(e) => setGroupLang(e.target.value)}
                    className="w-full px-3 py-2.5 glass-input text-sm font-body bg-card/30"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>{l.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-body mb-1.5 block">
                    Add members by @username (optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={memberInput}
                      onChange={(e) => setMemberInput(e.target.value.toLowerCase())}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addMember();
                        }
                      }}
                      placeholder="username"
                      className="flex-1 px-3 py-2.5 glass-input text-sm font-body lowercase"
                    />
                    <button onClick={addMember} className="px-3 sketch-fill rounded-xl">
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                {members.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {members.map((m) => (
                      <span
                        key={m.profile_id}
                        className="flex items-center gap-1 px-2 py-1 sketch-border rounded-full text-xs font-body"
                      >
                        @{m.username}
                        <button
                          onClick={() => setMembers((prev) => prev.filter((x) => x.profile_id !== m.profile_id))}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <button
                  onClick={createGroup}
                  disabled={busy}
                  className="w-full py-3 sketch-fill font-heading font-bold disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {busy ? <Loader2 size={18} className="animate-spin" /> : null}
                  Create Group
                </button>
              </div>
            )
          )}

          {tab === 'join' && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground font-body">
                Paste a room link or ID to join an existing room.
              </p>
              <input
                value={joinLink}
                onChange={(e) => setJoinLink(e.target.value)}
                placeholder="Room link or ID"
                className="w-full px-3 py-2.5 glass-input text-sm font-body"
              />
              <button
                onClick={joinRoom}
                disabled={!joinLink.trim()}
                className="w-full py-3 sketch-fill font-heading font-bold disabled:opacity-40"
              >
                Join
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
```

## File: src/components/stories/PostStory.jsx

```text
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { X, Loader2, Camera } from 'lucide-react';

import { getLocalProfile } from '@/lib/chat-utils';

export default function PostStory({ onClose, onPosted }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const me = getLocalProfile();

  const pick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 25 * 1024 * 1024) {
      toast.error('Max 25MB');
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const post = async () => {
    if (!file || !me) return;
    setUploading(true);
    try {
      const res = await db.integrations.Core.UploadFile({ file });
      const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
      await db.entities.Story.create({
        profile_id: me.profile_id,
        username: me.username,
        display_name: me.display_name,
        avatar_color: me.avatar_color,
        avatar_url: me.avatar_url || '',
        media_url: res.file_url,
        media_type: mediaType,
        caption: caption.trim(),
      });
      toast.success('Story shared');
      onPosted();
    } catch {
      toast.error('Failed to post story');
    }
    setUploading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.92 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.92 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card w-full max-w-sm p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-bold">Add story</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-card/40">
              <X size={18} />
            </button>
          </div>
          {!preview ? (
            <label className="flex flex-col items-center justify-center gap-2 h-48 sketch-dashed rounded-xl cursor-pointer hover:bg-card/30 transition-colors">
              <Camera size={28} />
              <span className="text-sm font-body">Tap to add photo or video</span>
              <input type="file" accept="image/*,video/*" className="hidden" onChange={pick} />
            </label>
          ) : (
            <div>
              {file?.type.startsWith('video/') ? (
                <video src={preview} className="w-full max-h-64 rounded-xl sketch-border" controls />
              ) : (
                <img src={preview} alt="preview" className="w-full max-h-64 object-contain rounded-xl sketch-border" />
              )}
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption…"
                maxLength={100}
                rows={2}
                className="w-full mt-3 px-3 py-2 glass-input text-sm font-body resize-none"
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="flex-1 py-2 sketch-border rounded-xl text-sm font-body"
                >
                  Change
                </button>
                <button
                  onClick={post}
                  disabled={uploading}
                  className="flex-1 py-2 sketch-fill rounded-xl text-sm font-heading font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : null}
                  Share
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
```

## File: src/components/stories/StoriesTray.jsx

```text
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Avatar from '@/components/Avatar';
import StoryViewer from './StoryViewer';
import PostStory from './PostStory';
import { getLocalProfile } from '@/lib/chat-utils';

export default function StoriesTray() {
  const [groups, setGroups] = useState([]);
  const [viewing, setViewing] = useState(null);
  const [posting, setPosting] = useState(false);
  const me = getLocalProfile();

  const load = async () => {
    try {
      const all = await db.entities.Story.list('-created_date', 200);
      const cutoff = new Date(Date.now() - 24 * 3600 * 1000);
      const recent = all.filter((s) => new Date(s.created_date) > cutoff);
      const map = {};
      recent.forEach((s) => {
        if (!map[s.profile_id]) {
          map[s.profile_id] = {
            profile_id: s.profile_id,
            username: s.username,
            display_name: s.display_name,
            avatar_color: s.avatar_color,
            avatar_url: s.avatar_url,
            stories: [],
          };
        }
        map[s.profile_id].stories.push(s);
      });
      setGroups(Object.values(map));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    load();
    const unsub = db.entities.Story.subscribe(() => load());
    return unsub;
  }, []);

  if (!me) return null;

  const viewingGroup = groups.find((x) => x.profile_id === viewing);

  return (
    <div className="mb-3">
      <div className="flex gap-3 overflow-x-auto scrollbar-thin pb-1">
        <button onClick={() => setPosting(true)} className="flex flex-col items-center gap-1 shrink-0">
          <div className="relative">
            <Avatar name={me.display_name} color={me.avatar_color} avatarUrl={me.avatar_url} size={56} />
            <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full sketch-fill flex items-center justify-center border-2 border-background">
              <Plus size={12} className="text-primary-foreground" />
            </span>
          </div>
          <span className="text-[10px] font-body text-muted-foreground">Your story</span>
        </button>
        {groups.map((g) => (
          <button
            key={g.profile_id}
            onClick={() => setViewing(g.profile_id)}
            className="flex flex-col items-center gap-1 shrink-0"
          >
            <div
              className="p-0.5 rounded-full"
              style={{ background: 'linear-gradient(135deg,#f093fb,#f5576c,#ffd700)' }}
            >
              <div className="bg-background rounded-full p-0.5">
                <Avatar name={g.display_name} color={g.avatar_color} avatarUrl={g.avatar_url} size={52} />
              </div>
            </div>
            <span className="text-[10px] font-body text-muted-foreground truncate max-w-[64px]">
              {g.username}
            </span>
          </button>
        ))}
      </div>
      {posting && (
        <PostStory onClose={() => setPosting(false)} onPosted={() => { setPosting(false); load(); }} />
      )}
      {viewingGroup && <StoryViewer group={viewingGroup} onClose={() => setViewing(null)} />}
    </div>
  );
}
```

## File: src/components/stories/StoryViewer.jsx

```text
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Avatar from '@/components/Avatar';

export default function StoryViewer({ group, onClose }) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);
  const story = group.stories[idx];

  const next = () => setIdx((i) => (i + 1 < group.stories.length ? i + 1 : i));
  const prev = () => setIdx((i) => (i > 0 ? i - 1 : i));

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (idx >= group.stories.length - 1) return;
    timerRef.current = setTimeout(() => next(), story?.media_type === 'video' ? 12000 : 5000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [idx]);

  if (!story) {
    onClose();
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-[60] flex items-center justify-center"
      >
        <div className="absolute top-0 left-0 right-0 flex gap-1 p-3 z-10">
          {group.stories.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: i < idx ? '100%' : i === idx ? '50%' : '0%' }}
              />
            </div>
          ))}
        </div>
        <div className="absolute top-6 left-0 right-0 flex items-center gap-2 px-4 z-10">
          <Avatar name={group.display_name} color={group.avatar_color} avatarUrl={group.avatar_url} size={36} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-body font-medium text-white truncate">@{group.username}</p>
            <p className="text-[10px] text-white/60">
              {new Date(story.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
            <X size={22} className="text-white" />
          </button>
        </div>
        {story.media_type === 'video' ? (
          <video src={story.media_url} autoPlay className="max-w-full max-h-full" />
        ) : (
          <img src={story.media_url} className="max-w-full max-h-full object-contain" alt="story" />
        )}
        {story.caption && (
          <div className="absolute bottom-10 left-0 right-0 text-center px-6">
            <p className="text-white text-sm font-body drop-shadow-lg">{story.caption}</p>
          </div>
        )}
        <button onClick={prev} className="absolute left-0 top-16 bottom-16 w-1/3" aria-label="previous" />
        <button onClick={next} className="absolute right-0 top-16 bottom-16 w-1/3" aria-label="next" />
      </motion.div>
    </AnimatePresence>
  );
}
```

## File: src/components/ui/button.jsx

```text
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }

```

## File: src/components/ui/image.jsx

```text
import * as React from "react"
import { useSize } from "@/hooks/use-size"
import { cn } from "@/lib/utils"

const FALLBACK_IMAGE_URL =
  "https://static.wixstatic.com/media/12d367_4f26ccd17f8f4e3a8958306ea08c2332~mv2.png"

// Wix Media Platform hosts whose images support /v1/ transform URLs
// (resize, focal-point crop, and format conversion via the OUTPUT FILENAME
// EXTENSION — a .webp output re-encodes JPG/PNG uploads to WebP on the fly).
const WIX_MEDIA_HOSTS = ["media.db.com", "static.wixstatic.com"]
// First-paint width before the container is measured.
const DEFAULT_TRANSFORM_WIDTH = 1024
const DEVICE_PIXEL_RATIOS = [1, 2, 3]
// Not a documented CDN limit — verified live that w_/h_ up to 10000 succeed
// and requests start failing somewhere between 10000 and 15000. This is a
// defensive ceiling with generous headroom (a 3x DPR request needs a
// ~2000px container to reach it), not a real constraint we expect to hit.
const MAX_DIMENSION = 6000

/**
 * Detects a Wix Media URL and strips any existing /v1/ transform so it can be
 * rebuilt. Returns null for other hosts and for SVGs (vectors — a raster
 * transform only downgrades them).
 */
function parseWixMediaUrl(src) {
  try {
    const url = new URL(src)
    if (!WIX_MEDIA_HOSTS.includes(url.hostname)) return null
    const v1 = url.pathname.indexOf("/v1/")
    const basePath = v1 === -1 ? url.pathname : url.pathname.slice(0, v1)
    const filename = basePath.split("/").pop()
    if (!filename || /\.svg$/i.test(filename)) return null
    return { baseUrl: `${url.origin}${basePath}`, filename }
  } catch {
    return null
  }
}

const clampDim = (n) => Math.min(Math.max(Math.round(n), 1), MAX_DIMENSION)
const clamp01 = (n) => Math.min(1, Math.max(0, n))

/**
 * Builds a Wix Media transform URL:
 * `<base>/v1/{fill|fit}/w_,h_[,fp_x_y|al_c],q_,usm_…/<name>.webp`
 * GIFs keep their extension (WebP output could drop animation).
 */
function buildTransformUrl({ baseUrl, filename }, { width, height, crop, focalPoint, quality }) {
  const params = [`w_${clampDim(width)}`, `h_${clampDim(height || width)}`]
  if (crop) {
    params.push(
      focalPoint
        ? `fp_${clamp01(focalPoint.x).toFixed(2)}_${clamp01(focalPoint.y).toFixed(2)}`
        : "al_c"
    )
  }
  params.push(`q_${quality}`, "usm_0.66_1.00_0.01", "enc_webp", "quality_auto")
  const outputName = /\.gif$/i.test(filename)
    ? filename
    : filename.replace(/\.[a-z0-9]+$/i, "") + ".webp"
  return `${baseUrl}/v1/${crop ? "fill" : "fit"}/${params.join(",")}/${outputName}`
}

function buildSrcSet(parsed, options) {
  return DEVICE_PIXEL_RATIOS.map(
    (dpr) =>
      `${buildTransformUrl(parsed, {
        ...options,
        width: options.width * dpr,
        height: options.height ? options.height * dpr : undefined,
      })} ${dpr}x`
  ).join(", ")
}

const ImageWrapper = React.forwardRef(({ aspectRatio, className, style, children }, ref) => (
  <span
    ref={ref}
    className={cn("inline-block relative", className)}
    style={{ aspectRatio, ...style }}
  >
    {children}
  </span>
))
ImageWrapper.displayName = "ImageWrapper"

const ResponsiveImage = React.forwardRef(
  ({ parsed, fittingType, focalPoint, quality, className, style, aspectRatio, onLoad, ...props }, parentRef) => {
    const wrapperRef = React.useRef(null)
    const imgRef = React.useRef(null)
    const size = useSize(wrapperRef)
    const [loaded, setLoaded] = React.useState(false)

    React.useImperativeHandle(parentRef, () => imgRef.current)

    // Reset the blur-up when the underlying image changes.
    React.useEffect(() => {
      setLoaded(false)
    }, [parsed.baseUrl])

    const crop = fittingType !== "fit"
    // `size` is null exactly once: the pre-measurement first render, which we
    // never let reach the network (see below — useSize measures before paint).
    // A *measured* zero (content-sized wrapper with no CSS dimensions) falls
    // back to a fixed transform width so the image itself can size the box.
    const options = size && {
      width: size.width || DEFAULT_TRANSFORM_WIDTH,
      height: size.height ? size.height : undefined,
      crop,
      focalPoint: crop ? focalPoint : undefined,
      quality,
    }

    // Both layers render only once the container is measured, so the first
    // URL the browser ever fetches is already the right size — never a
    // DEFAULT_TRANSFORM_WIDTH guess that gets replaced a frame later (a
    // wasted full-size download per image). useSize measures in
    // useLayoutEffect, so nothing is lost: measurement lands before the
    // first paint.
    return (
      <ImageWrapper ref={wrapperRef} aspectRatio={aspectRatio} className={className} style={style}>
        {/* Tiny blurred placeholder (a few hundred bytes) covering the main
            image's load time. Same crop shape and focal anchor as the main
            image — fp_ is relative to the crop box, so a square or centered
            placeholder would blur-preview a different region. */}
        {options && !loaded && (
          <img
            src={buildTransformUrl(parsed, {
              ...options,
              width: 20,
              height: options.height
                ? Math.max(1, Math.round((20 * options.height) / options.width))
                : undefined,
              quality: 20,
            })}
            alt=""
            aria-hidden="true"
            className="w-full h-full inset-0 absolute"
            style={{
              objectFit: fittingType === "fit" ? "contain" : "cover",
              filter: "blur(10px)",
              transform: "scale(1.1)",
            }}
          />
        )}
        {options && (
          <img
            ref={imgRef}
            src={buildTransformUrl(parsed, options)}
            srcSet={buildSrcSet(parsed, options)}
            loading="lazy"
            className={cn(
              "w-full h-full inset-0 absolute",
              fittingType === "fit" ? "object-contain" : "object-cover"
            )}
            onLoad={(e) => {
              setLoaded(true)
              onLoad?.(e)
            }}
            {...props}
          />
        )}
      </ImageWrapper>
    )
  }
)
ResponsiveImage.displayName = "ResponsiveImage"

/**
 * Image with built-in Wix Media Platform support: URLs on media.db.com /
 * static.wixstatic.com are served resized to the rendered container (per
 * device pixel ratio) and re-encoded to WebP; `fittingType="fill"` crops
 * server-side, optionally anchored at a focal point. Other URLs render as a
 * plain <img>. Failed loads swap to a fallback image.
 */
const Image = React.forwardRef(
  (
    {
      src,
      fittingType = "fill",
      originWidth,
      originHeight,
      focalPointX,
      focalPointY,
      quality = 90,
      ...props
    },
    ref
  ) => {
    const [imgSrc, setImgSrc] = React.useState(src)

    React.useEffect(() => {
      setImgSrc(src)
    }, [src])

    const imageProps = {
      ...props,
      onError: () => setImgSrc(FALLBACK_IMAGE_URL),
    }

    if (!src) {
      // Renders as a real <img> (not a <div>) — the visual editor's
      // click-to-edit toolbar keys its "Replace Image" action off the DOM
      // tag being `img`, so a placeholder div would be unrecoverable in the
      // editor. FALLBACK_IMAGE_URL doubles as the "no image chosen" graphic.
      return <img ref={ref} src={FALLBACK_IMAGE_URL} {...imageProps} data-empty-image />
    }

    // The fallback renders as a plain <img> so a broken upload can't cascade
    // into a second (transformed) failing request.
    const parsed = imgSrc === FALLBACK_IMAGE_URL ? null : parseWixMediaUrl(imgSrc)

    if (!parsed) {
      const isErrorUrl = imgSrc === FALLBACK_IMAGE_URL
      return (
        <img ref={ref} src={imgSrc} {...imageProps} data-error-image={isErrorUrl || undefined} />
      )
    }

    const focalPoint =
      typeof focalPointX === "number" && typeof focalPointY === "number"
        ? { x: focalPointX, y: focalPointY }
        : undefined
    // Origin dimensions are optional — when known they stabilize layout via
    // the wrapper's aspect-ratio before the image loads.
    const aspectRatio =
      originWidth && originHeight ? `${originWidth} / ${originHeight}` : undefined

    return (
      <ResponsiveImage
        ref={ref}
        parsed={parsed}
        fittingType={fittingType}
        focalPoint={focalPoint}
        quality={quality}
        aspectRatio={aspectRatio}
        {...imageProps}
      />
    )
  }
)
Image.displayName = "Image"

export { Image }

```

## File: src/components/ui/input-otp.jsx

```text
import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Minus } from "lucide-react"

import { cn } from "@/lib/utils"

const InputOTP = React.forwardRef(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName)}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props} />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    (<div
      ref={ref}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-1 ring-ring",
        className
      )}
      {...props}>
      {char}
      {hasFakeCaret && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>)
  );
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Minus />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }

```

## File: src/components/ui/input.jsx

```text
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }

```

## File: src/components/ui/label.jsx

```text
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }

```

## File: src/components/ui/toast.jsx

```text
import * as React from "react";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastProvider = React.forwardRef(({ ...props }, ref) => (
  <div
    ref={ref}
    className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
    {...props}
  />
));
ToastProvider.displayName = "ToastProvider";

const ToastViewport = React.forwardRef(({ ...props }, ref) => (
  <div
    ref={ref}
    className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
    {...props}
  />
));
ToastViewport.displayName = "ToastViewport";

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = "Toast";

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = "ToastAction";

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </button>
));
ToastClose.displayName = "ToastClose";

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
));
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = "ToastDescription";

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}; 
```

## File: src/components/ui/toaster.jsx

```text
import { useToast } from "@/components/ui/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
} 
```

## File: src/components/ui/use-toast.jsx

```text
// Inspired by react-hot-toast library
import { useState, useEffect } from "react";

const TOAST_LIMIT = 20;
const TOAST_REMOVE_DELAY = 1000000;

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const toastTimeouts = new Map();

const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

const _clearFromRemoveQueue = (toastId) => {
  const timeout = toastTimeouts.get(toastId);
  if (timeout) {
    clearTimeout(timeout);
    toastTimeouts.delete(toastId);
  }
};

export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners = [];

let memoryState = { toasts: [] };

function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function toast({ ...props }) {
  const id = genId();

  const update = (props) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    });

  const dismiss = () =>
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = useState(memoryState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  };
}

export { useToast, toast }; 
```

## File: src/hooks/use-size.jsx

```text
import * as React from "react"

export function useSize(ref) {
  const [size, setSize] = React.useState(null)

  // useLayoutEffect (not useEffect): the initial measurement must land before
  // the browser paints, so consumers can render their real content on the
  // very first painted frame instead of a guess. A ResizeObserver's first
  // callback arrives too late for that — by then an <img> src guess has
  // already been dispatched to the network.
  React.useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    const rect = element.getBoundingClientRect()
    setSize({ width: rect.width, height: rect.height })

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  return size
}

```

## File: src/hooks/useTranslation.js

```text
import { useState, useEffect, useRef } from 'react';
import { translateText, getCachedTranslation } from '@/lib/openrouter';

function clean(s) {
  let t = String(s || '').trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    t = t.slice(1, -1).trim();
  }
  return t;
}

export function useTranslation(text, targetLang, enabled) {
  // Synchronous L1/L2 cache check for instant 0ms render
  const initialCached = (enabled && targetLang && text) ? getCachedTranslation(text, targetLang) : null;
  const [translated, setTranslated] = useState(initialCached);
  const [loading, setLoading] = useState(Boolean(enabled && targetLang && text && !initialCached));
  const [error, setError] = useState(null);
  const lastKeyRef = useRef('');

  useEffect(() => {
    if (!enabled || !targetLang || !text) {
      setTranslated(null);
      setLoading(false);
      setError(null);
      return;
    }

    const normText = text.trim();
    const key = `${targetLang}::${normText}`;
    lastKeyRef.current = key;

    // Check instant cache first
    const cached = getCachedTranslation(normText, targetLang);
    if (cached) {
      setTranslated(cached !== normText ? cached : null);
      setLoading(false);
      setError(null);
      return;
    }

    let isCancelled = false;
    setLoading(true);
    setError(null);

    translateText(normText, targetLang)
      .then((out) => {
        if (isCancelled || lastKeyRef.current !== key) return;
        const cleaned = clean(out || '');
        if (cleaned && cleaned !== normText) {
          setTranslated(cleaned);
        } else {
          setTranslated(null);
        }
        setLoading(false);
      })
      .catch(() => {
        if (isCancelled || lastKeyRef.current !== key) return;
        setTranslated(null);
        setLoading(false);
        setError('ERROR');
      });

    return () => {
      isCancelled = true;
    };
  }, [text, targetLang, enabled]);

  return { translated, loading, error };
}

```

## File: src/index.css

```text
@import url('https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&family=Patrick+Hand&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 43 37% 96%;
    --foreground: 239 31% 25%;
    --card: 44 85% 95%;
    --card-foreground: 239 31% 25%;
    --popover: 43 37% 96%;
    --popover-foreground: 239 31% 25%;
    --primary: 239 31% 25%;
    --primary-foreground: 43 37% 96%;
    --secondary: 44 60% 92%;
    --secondary-foreground: 239 31% 25%;
    --muted: 44 30% 90%;
    --muted-foreground: 239 15% 42%;
    --accent: 44 85% 95%;
    --accent-foreground: 239 31% 25%;
    --destructive: 0 72% 45%;
    --destructive-foreground: 43 37% 96%;
    --border: 239 31% 25%;
    --input: 239 25% 45%;
    --ring: 239 31% 25%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
    --font-heading: 'Kalam', cursive;
    --font-body: 'Patrick Hand', 'Kalam', cursive;
    --font-display: 'Kalam', cursive;
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    --sidebar-background: 43 37% 96%;
    --sidebar-foreground: 239 31% 25%;
    --sidebar-primary: 239 31% 25%;
    --sidebar-primary-foreground: 43 37% 96%;
    --sidebar-accent: 44 85% 95%;
    --sidebar-accent-foreground: 239 31% 25%;
    --sidebar-border: 239 31% 25%;
    --sidebar-ring: 239 31% 25%;
  }

  .dark {
    --background: 238 37% 14%;
    --foreground: 43 37% 96%;
    --card: 238 30% 19%;
    --card-foreground: 43 37% 96%;
    --popover: 238 37% 14%;
    --popover-foreground: 43 37% 96%;
    --primary: 43 37% 96%;
    --primary-foreground: 239 31% 25%;
    --secondary: 238 30% 19%;
    --secondary-foreground: 43 37% 96%;
    --muted: 238 30% 22%;
    --muted-foreground: 43 20% 72%;
    --accent: 238 30% 22%;
    --accent-foreground: 43 37% 96%;
    --destructive: 0 62% 40%;
    --destructive-foreground: 43 37% 96%;
    --border: 43 37% 96%;
    --input: 43 20% 72%;
    --ring: 43 37% 96%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
    --sidebar-background: 238 30% 19%;
    --sidebar-foreground: 43 37% 96%;
    --sidebar-primary: 43 37% 96%;
    --sidebar-primary-foreground: 239 31% 25%;
    --sidebar-accent: 238 30% 22%;
    --sidebar-accent-foreground: 43 37% 96%;
    --sidebar-border: 43 37% 96%;
    --sidebar-ring: 43 37% 96%;
  }
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground font-body;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html {
    scroll-behavior: smooth;
  }
}

@layer components {
  .glass-card {
    border: 2px solid hsl(var(--foreground));
    border-radius: 22px 14px 28px 16px / 16px 28px 14px 22px;
    background-color: hsl(var(--card) / 0.55);
    box-shadow: 5px 5px 0px hsl(var(--foreground) / 0.08);
  }

  .glass-input {
    background: transparent;
    border-bottom: 2px solid hsl(var(--foreground));
    outline: none;
  }

  .sketch-border {
    border: 2px solid hsl(var(--foreground));
    border-radius: 14px 8px 16px 10px / 10px 16px 8px 14px;
  }

  .sketch-fill {
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    border: 2.5px solid hsl(var(--primary));
    border-radius: 14px 10px 18px 12px / 12px 18px 10px 14px;
    box-shadow: 4px 4px 0px hsl(var(--foreground) / 0.2);
  }

  .sketch-toggle {
    border: 2px solid hsl(var(--foreground));
    border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%;
  }

  .sketch-dashed {
    border: 2px dashed hsl(var(--foreground));
    border-radius: 14px 8px 16px 10px / 10px 16px 8px 14px;
  }
}

@layer utilities {
  .scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--foreground) / 0.3) transparent;
  }
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: hsl(var(--foreground) / 0.3);
    border-radius: 3px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background-color: hsl(var(--foreground) / 0.5);
  }

  .paper-texture {
    background-image: url('https://media.db.com/images/public/6a52400c850310aa9301674e/paper_texture.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
}
```

## File: src/lib/AuthContext.jsx

```text
import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '@/api/base44Client';
import { appParams } from '@/lib/app-params';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(false);
      setAuthError(null);
      await checkUserAuth();
    } catch (error) {
      console.error('Unexpected error in auth initialization:', error);
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const currentUser = await db.auth.me();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoadingAuth(false);
      setAuthChecked(true);
    } catch (error) {
      console.warn('User auth status:', error?.message || 'anonymous');
      setUser(null);
      setIsAuthenticated(false);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    
    if (shouldRedirect) {
      db.auth.logout(window.location.href);
    } else {
      db.auth.logout();
    }
  };

  const navigateToLogin = () => {
    db.auth.redirectToLogin(window.location.href);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth, 
      isLoadingPublicSettings, 
      authError, 
      appPublicSettings, 
      authChecked, 
      logout, 
      navigateToLogin, 
      checkUserAuth, 
      checkAppState 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

```

## File: src/lib/PageNotFound.jsx

```text
import { useLocation } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

export default function PageNotFound({}) {
    const location = useLocation();
    const pageName = location.pathname.substring(1);

    const { data: authData, isFetched } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                const user = await db.auth.me();
                return { user, isAuthenticated: true };
            } catch (error) {
                return { user: null, isAuthenticated: false };
            }
        }
    });
    
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
            <div className="max-w-md w-full">
                <div className="text-center space-y-6">
                    {/* 404 Error Code */}
                    <div className="space-y-2">
                        <h1 className="text-7xl font-light text-slate-300">404</h1>
                        <div className="h-0.5 w-16 bg-slate-200 mx-auto"></div>
                    </div>
                    
                    {/* Main Message */}
                    <div className="space-y-3">
                        <h2 className="text-2xl font-medium text-slate-800">
                            Page Not Found
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            The page <span className="font-medium text-slate-700">"{pageName}"</span> could not be found in this application.
                        </p>
                    </div>
                    
                    {/* Admin Note */}
                    {isFetched && authData.isAuthenticated && authData.user?.role === 'admin' && (
                        <div className="mt-8 p-4 bg-slate-100 rounded-lg border border-slate-200">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                                </div>
                                <div className="text-left space-y-1">
                                    <p className="text-sm font-medium text-slate-700">Admin Note</p>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        This could mean that the AI hasn't implemented this page yet. Ask it to implement it in the chat.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Action Button */}
                    <div className="pt-6">
                        <button 
                            onClick={() => window.location.href = '/'} 
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
```

## File: src/lib/app-params.js

```text
const isNode = typeof window === 'undefined';
const windowObj = isNode ? { localStorage: new Map() } : window;
const storage = windowObj.localStorage;

const toSnakeCase = (str) => {
	return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

const getAppParamValue = (paramName, { defaultValue = undefined, removeFromUrl = false } = {}) => {
	if (isNode) {
		return defaultValue;
	}
	const storageKey = `base44_${toSnakeCase(paramName)}`;
	const urlParams = new URLSearchParams(window.location.search);
	const searchParam = urlParams.get(paramName);
	if (removeFromUrl) {
		urlParams.delete(paramName);
		const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""
			}${window.location.hash}`;
		window.history.replaceState({}, document.title, newUrl);
	}
	if (searchParam) {
		storage.setItem(storageKey, searchParam);
		return searchParam;
	}
	if (defaultValue) {
		storage.setItem(storageKey, defaultValue);
		return defaultValue;
	}
	const storedValue = storage.getItem(storageKey);
	if (storedValue) {
		return storedValue;
	}
	return null;
}

const getAppParams = () => {
	if (getAppParamValue("clear_access_token") === 'true') {
		storage.removeItem('base44_access_token');
		storage.removeItem('token');
	}
	return {
		appId: getAppParamValue("app_id", { defaultValue: import.meta.env.VITE_BASE44_APP_ID }),
		token: getAppParamValue("access_token", { removeFromUrl: true }),
		fromUrl: getAppParamValue("from_url", { defaultValue: window.location.href }),
		functionsVersion: getAppParamValue("functions_version", { defaultValue: import.meta.env.VITE_BASE44_FUNCTIONS_VERSION }),
		appBaseUrl: getAppParamValue("app_base_url", { defaultValue: import.meta.env.VITE_BASE44_APP_BASE_URL }),
	}
}

export const appParams = {
	...getAppParams()
}

```

## File: src/lib/authReturnTo.js

```text
// Shared by the auth pages (Login, Register, and any page that resumes a flow
// after sign-in, e.g. the MCP OAuth consent page). Keep the redirect
// validation in one place — it is security-sensitive and easy to drift.

// Resolve ?returnTo= to a safe same-origin path, else "/".
//
// The same-origin check alone is not enough: a value like /.//evil.com or
// /\evil.com parses same-origin but normalizes to a protocol-relative
// //evil.com when assigned to location.href — an open redirect. So require the
// resolved path to be exactly one leading slash (no "//" prefix, no backslash).
export function safeReturnTo() {
  const raw = new URLSearchParams(window.location.search).get("returnTo");
  if (!raw) return "/";
  try {
    const url = new URL(raw, window.location.origin);
    if (url.origin !== window.location.origin) return "/";
    // Strip app-bootstrap params: app-params.js persists these from the URL into
    // localStorage before the SDK initializes, so a crafted returnTo could
    // otherwise poison the freshly issued session — repointing the app at an
    // attacker's backend (app_base_url/app_id/functions_version) or overwriting
    // the token. Normal app-flow params (e.g. the OAuth consent ctx) are kept.
    // The full app-params.js bootstrap set (src/lib/app-params.js) — any of
    // these in a crafted returnTo would be persisted at next load.
    for (const p of ["access_token", "clear_access_token", "app_id", "app_base_url", "functions_version", "from_url"]) {
      url.searchParams.delete(p);
    }
    const path = url.pathname + url.search;
    if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return "/";
    return path;
  } catch {
    return "/";
  }
}

```

## File: src/lib/chat-utils.js

```text
const ADJECTIVES = [
  'Blue', 'Silver', 'Ocean', 'Crimson', 'Golden', 'Emerald', 'Violet', 'Cosmic',
  'Mystic', 'Lunar', 'Solar', 'Frost', 'Amber', 'Jade', 'Onyx', 'Ruby',
  'Pearl', 'Sage', 'Storm', 'Dawn', 'Coral', 'Cobalt', 'Ivory', 'Indigo',
  'Copper', 'Cedar', 'Mint', 'Lavender', 'Amber', 'Velvet',
];

const NOUNS = [
  'Fox', 'Wolf', 'Bird', 'Falcon', 'Lynx', 'Bear', 'Hawk', 'Deer',
  'Owl', 'Crane', 'Seal', 'Otter', 'Raven', 'Heron', 'Puma', 'Koala',
  'Swan', 'Wren', 'Stag', 'Kite', 'Dove', 'Finch', 'Lark', 'Moth',
  'Orca', 'Lamb', 'Stork', 'Drake', 'Eagle', 'Hare',
];

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #30cfd0, #330867)',
  'linear-gradient(135deg, #a8edea, #fed6e3)',
  'linear-gradient(135deg, #ff9a9e, #fecfef)',
  'linear-gradient(135deg, #ffecd2, #fcb69f)',
  'linear-gradient(135deg, #84fab0, #8fd3f4)',
  'linear-gradient(135deg, #c471f5, #fa71cd)',
  'linear-gradient(135deg, #fcb045, #fd1d1d, #833ab4)',
  'linear-gradient(135deg, #5ee7df, #b490ca)',
  'linear-gradient(135deg, #d299c2, #fef9d7)',
  'linear-gradient(135deg, #89f7fe, #66a6ff)',
  'linear-gradient(135deg, #fddb92, #d1fdff)',
];

export function generateRoomId() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function generateParticipantId() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function generateNickname() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return adj + noun;
}

export function generateAvatarColor() {
  return AVATAR_GRADIENTS[Math.floor(Math.random() * AVATAR_GRADIENTS.length)];
}

export function getRoomSettings(roomId) {
  try {
    const data = localStorage.getItem(`whisper_room_settings_${roomId}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setRoomSettings(roomId, settings) {
  try {
    localStorage.setItem(`whisper_room_settings_${roomId}`, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function clearRoomSettings(roomId) {
  try {
    localStorage.removeItem(`whisper_room_settings_${roomId}`);
  } catch {
    // ignore
  }
}

export function getLocalParticipant(roomId) {
  try {
    const data = localStorage.getItem(`whisper_participant_${roomId}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setLocalParticipant(roomId, participant) {
  try {
    localStorage.setItem(`whisper_participant_${roomId}`, JSON.stringify(participant));
  } catch {
    // ignore
  }
}

export function formatTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function getInitials(name) {
  if (!name) return '?';
  if (name.length <= 2) return name.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// Saved rooms
export function getSavedRooms() {
  try {
    const data = localStorage.getItem('whisper_saved_rooms');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveRoom(roomId, roomName = '') {
  try {
    const rooms = getSavedRooms();
    if (!rooms.find((r) => r.room_id === roomId)) {
      rooms.push({ room_id: roomId, room_name: roomName, saved_at: Date.now() });
      localStorage.setItem('whisper_saved_rooms', JSON.stringify(rooms));
    }
  } catch {
    // ignore
  }
}

export function removeSavedRoom(roomId) {
  try {
    const rooms = getSavedRooms();
    const filtered = rooms.filter((r) => r.room_id !== roomId);
    localStorage.setItem('whisper_saved_rooms', JSON.stringify(filtered));
  } catch {
    // ignore
  }
}

// ===== Profile (Instagram-style anonymous identity) =====

const HANDLE_ADJ = [
  'blue', 'silver', 'ocean', 'crimson', 'golden', 'emerald', 'violet', 'cosmic',
  'mystic', 'lunar', 'solar', 'frost', 'amber', 'jade', 'onyx', 'ruby',
  'pearl', 'sage', 'storm', 'dawn', 'coral', 'cobalt', 'ivory', 'indigo',
  'copper', 'cedar', 'mint', 'velvet', 'neon', 'quiet',
];
const HANDLE_NOUN = [
  'fox', 'wolf', 'bird', 'falcon', 'lynx', 'bear', 'hawk', 'deer',
  'owl', 'crane', 'seal', 'otter', 'raven', 'heron', 'puma', 'koala',
  'swan', 'wren', 'stag', 'dove', 'finch', 'lark', 'moth', 'orca',
  'lamb', 'stork', 'drake', 'eagle', 'hare', 'ghost',
];

export function generateUsername() {
  const adj = HANDLE_ADJ[Math.floor(Math.random() * HANDLE_ADJ.length)];
  const noun = HANDLE_NOUN[Math.floor(Math.random() * HANDLE_NOUN.length)];
  const num = Math.floor(Math.random() * 9000 + 100);
  return `${adj}_${noun}_${num}`;
}

export function sanitizeUsername(raw) {
  let u = (raw || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_]/g, '')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '');
  if (u.length < 3) u = (u + 'ghost').slice(0, 20);
  return u.slice(0, 20);
}

export function getLocalProfile() {
  try {
    const data = localStorage.getItem('whisper_profile');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setLocalProfile(profile) {
  try {
    localStorage.setItem('whisper_profile', JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export async function ensureProfile() {
  const { base44 } = await import('@/api/base44Client');

  // If logged in, use the profile linked to this account
  let user = null;
  try {
    user = await db.auth.me();
  } catch {
    user = null;
  }

  if (user && user.id) {
    try {
      const matches = await db.entities.Profile.filter({ user_id: user.id });
      if (matches.length > 0) {
        const p = matches[0];
        const profile = {
          profile_id: p.profile_id,
          username: p.username,
          display_name: p.display_name || '',
          avatar_color: p.avatar_color || '',
          avatar_url: p.avatar_url || '',
          bio: p.bio || '',
          language: p.language || '',
          auto_translate: !!p.auto_translate,
          user_id: user.id,
        };
        setLocalProfile(profile);
        return profile;
      }
    } catch {
      // ignore — fall through to create
    }

    // No linked profile yet — create one for this account
    let username = generateUsername();
    try {
      let taken = await db.entities.Profile.filter({ username });
      let attempts = 0;
      while (taken.length > 0 && attempts < 10) {
        username = generateUsername();
        taken = await db.entities.Profile.filter({ username });
        attempts++;
      }
    } catch {
      // ignore
    }
    const profile_id = generateParticipantId();
    const profile = {
      profile_id,
      username,
      display_name: generateNickname(),
      avatar_color: generateAvatarColor(),
      avatar_url: '',
      bio: '',
      language: '',
      auto_translate: false,
      user_id: user.id,
    };
    try {
      await db.entities.Profile.create({
        profile_id,
        username,
        display_name: profile.display_name,
        avatar_color: profile.avatar_color,
        avatar_url: '',
        bio: '',
        user_id: user.id,
      });
    } catch {
      // ignore
    }
    setLocalProfile(profile);
    return profile;
  }

  // Fallback: no logged-in user — use local/ephemeral profile
  let profile = getLocalProfile();
  if (profile && profile.profile_id && profile.username) return profile;
  const profile_id = generateParticipantId();
  const newProfile = {
    profile_id,
    username: generateUsername(),
    display_name: generateNickname(),
    avatar_color: generateAvatarColor(),
    avatar_url: '',
    bio: '',
    language: '',
    auto_translate: false,
  };
  setLocalProfile(newProfile);
  return newProfile;
}

export async function updateProfile(updates) {
  const profile = getLocalProfile();
  if (!profile) return null;
  const { base44 } = await import('@/api/base44Client');
  try {
    const existing = await db.entities.Profile.filter({
      profile_id: profile.profile_id,
    });
    if (existing.length > 0) {
      await db.entities.Profile.update(existing[0].id, updates);
    } else {
      await db.entities.Profile.create({
        profile_id: profile.profile_id,
        username: profile.username,
        user_id: profile.user_id,
        ...updates,
      });
    }
  } catch {
    // ignore — local copy still updates
  }
  const merged = { ...profile, ...updates };
  setLocalProfile(merged);
  return merged;
}

export function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h';
  if (diff < 604800) return Math.floor(diff / 86400) + 'd';
  return d.toLocaleDateString();
}

export function clearAllLocal() {
  try {
    localStorage.removeItem('whisper_profile');
    localStorage.removeItem('whisper_saved_rooms');
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith('whisper_participant_') || k.startsWith('whisper_room_settings_')) {
        localStorage.removeItem(k);
      }
    });
  } catch {
    // ignore
  }
}
```

## File: src/lib/languages.js

```text
export const LANGUAGES = [
  { code: '', label: 'Off' },
  { code: 'en', label: 'English' },
  { code: 'hinglish', label: 'Hinglish (Hindi in Roman script)' },
  { code: 'vi', label: 'Vietnamese' },
];

export function languageLabel(code) {
  if (!code) return '';
  return LANGUAGES.find((l) => l.code === code)?.label || code;
}
```

## File: src/lib/openrouter.js

```text
// Ultra-fast translation engine with multi-tier instant cache, dictionary lookup,
// ultra-fast OpenRouter LLM (Gemini 2.0 Flash), and zero-key web fallback.

const KEY_STORAGE = 'openrouter_api_key';
const CACHE_STORAGE = 'whisper_translations_v2';
const MAX_LOCAL_CACHE = 500;

// Ultra-fast model aliases on OpenRouter
const FAST_MODELS = [
  'google/gemini-2.0-flash-001',
  'google/gemini-2.0-flash-lite-001',
  'meta-llama/llama-3.2-3b-instruct',
  'google/gemini-flash-1.5-8b'
];

export const LANGUAGE_MAP = {
  en: 'English',
  vi: 'Vietnamese',
  hi: 'Hindi',
  hinglish: 'Hinglish (Hindi in English/Roman script)',
  es: 'Spanish',
  fr: 'French',
};

// In-Memory Fast L1 Cache (0ms)
const memCache = new Map();

// Load persistent L2 Cache from LocalStorage
function loadPersistentCache() {
  try {
    const raw = localStorage.getItem(CACHE_STORAGE);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      Object.entries(parsed).forEach(([k, v]) => {
        if (typeof v === 'string') memCache.set(k, v);
      });
    }
  } catch {
    // ignore
  }
}

// Save persistent cache with LRU truncation
function savePersistentCache(key, value) {
  try {
    memCache.set(key, value);
    const raw = localStorage.getItem(CACHE_STORAGE);
    let obj = raw ? JSON.parse(raw) : {};
    obj[key] = value;
    const keys = Object.keys(obj);
    if (keys.length > MAX_LOCAL_CACHE) {
      const trimmed = {};
      keys.slice(-MAX_LOCAL_CACHE).forEach((k) => {
        trimmed[k] = obj[k];
      });
      obj = trimmed;
    }
    localStorage.setItem(CACHE_STORAGE, JSON.stringify(obj));
  } catch {
    // ignore
  }
}

loadPersistentCache();

// Built-in Instant Dictionary Matrix for common chat terms (0ms, zero network)
const INSTANT_DICT = {
  // English -> Translations
  hello: { vi: 'Xin chào', hi: 'नमस्ते', hinglish: 'Namaste / Hello', es: 'Hola', fr: 'Bonjour', en: 'Hello' },
  hi: { vi: 'Chào', hi: 'नमस्ते', hinglish: 'Hi / Namaste', es: 'Hola', fr: 'Salut', en: 'Hi' },
  hey: { vi: 'Này', hi: 'अरे', hinglish: 'Arey / Hey', es: 'Oye', fr: 'Hé', en: 'Hey' },
  'how are you': { vi: 'Bạn khỏe không?', hi: 'आप कैसे हैं?', hinglish: 'Aap kaise ho?', es: '¿Cómo estás?', fr: 'Comment vas-tu ?', en: 'How are you?' },
  'how are you?': { vi: 'Bạn khỏe không?', hi: 'आप कैसे हैं?', hinglish: 'Aap kaise ho?', es: '¿Cómo estás?', fr: 'Comment vas-tu ?', en: 'How are you?' },
  "what's up": { vi: 'Có chuyện gì thế?', hi: 'क्या चल रहा है?', hinglish: 'Kya chal raha hai?', es: '¿Qué pasa?', fr: 'Quoi de neuf ?', en: "What's up" },
  "what's up?": { vi: 'Có chuyện gì thế?', hi: 'क्या चल रहा है?', hinglish: 'Kya chal raha hai?', es: '¿Qué pasa?', fr: 'Quoi de neuf ?', en: "What's up?" },
  good: { vi: 'Tốt', hi: 'अच्छा', hinglish: 'Achha', es: 'Bien', fr: 'Bien', en: 'Good' },
  'i am good': { vi: 'Tôi khỏe', hi: 'मैं ठीक हूँ', hinglish: 'Main theek hoon', es: 'Estoy bien', fr: 'Je vais bien', en: 'I am good' },
  'i am fine': { vi: 'Tôi ổn', hi: 'मैं ठीक हूँ', hinglish: 'Main theek hoon', es: 'Estoy bien', fr: 'Je vais bien', en: 'I am fine' },
  thanks: { vi: 'Cảm ơn', hi: 'धन्यवाद', hinglish: 'Dhanyawaad / Thanks', es: 'Gracias', fr: 'Merci', en: 'Thanks' },
  'thank you': { vi: 'Cảm ơn bạn', hi: 'आपका धन्यवाद', hinglish: 'Aapka dhanyawaad', es: 'Muchas gracias', fr: 'Merci beaucoup', en: 'Thank you' },
  'good morning': { vi: 'Chào buổi sáng', hi: 'सुप्रभात', hinglish: 'Shubh prabhat / Good morning', es: 'Buenos días', fr: 'Bonjour', en: 'Good morning' },
  'good night': { vi: 'Chúc ngủ ngon', hi: 'शुभ रात्रि', hinglish: 'Shubh ratri / Good night', es: 'Buenas noches', fr: 'Bonne nuit', en: 'Good night' },
  yes: { vi: 'Có / Vâng', hi: 'हाँ', hinglish: 'Haan', es: 'Sí', fr: 'Oui', en: 'Yes' },
  no: { vi: 'Không', hi: 'नहीं', hinglish: 'Nahi', es: 'No', fr: 'Non', en: 'No' },
  ok: { vi: 'Được rồi', hi: 'ठीक है', hinglish: 'Theek hai / OK', es: 'Está bien', fr: 'D\'accord', en: 'OK' },
  okay: { vi: 'Được', hi: 'ठीक है', hinglish: 'Theek hai', es: 'Vale', fr: 'OK', en: 'Okay' },
  bye: { vi: 'Tạm biệt', hi: 'अलविदा', hinglish: 'Alvida / Bye', es: 'Adiós', fr: 'Au revoir', en: 'Bye' },
  'see you': { vi: 'Hẹn gặp lại', hi: 'फिर मिलेंगे', hinglish: 'Phir milenge', es: 'Nos vemos', fr: 'À plus', en: 'See you' },
  'see you later': { vi: 'Hẹn gặp lại sau', hi: 'बाद में मिलते हैं', hinglish: 'Baad mein milte hain', es: 'Hasta luego', fr: 'À plus tard', en: 'See you later' },
  cool: { vi: 'Tuyệt vời', hi: 'बढ़िया', hinglish: 'Badhiya / Cool', es: 'Genial', fr: 'Cool', en: 'Cool' },
  great: { vi: 'Tuyệt', hi: 'शानदार', hinglish: 'Shaandaar', es: 'Excelente', fr: 'Super', en: 'Great' },
  nice: { vi: 'Tuyệt', hi: 'अच्छा', hinglish: 'Achha', es: 'Agradable', fr: 'Sympa', en: 'Nice' },
  sure: { vi: 'Chắc chắn rồi', hi: 'ज़रूर', hinglish: 'Zaroor / Sure', es: 'Seguro', fr: 'Bien sûr', en: 'Sure' },
  why: { vi: 'Tại sao?', hi: 'क्यों?', hinglish: 'Kyun?', es: '¿Por qué?', fr: 'Pourquoi ?', en: 'Why?' },
  'why?': { vi: 'Tại sao?', hi: 'क्यों?', hinglish: 'Kyun?', es: '¿Por qué?', fr: 'Pourquoi ?', en: 'Why?' },
  where: { vi: 'Ở đâu?', hi: 'कहाँ?', hinglish: 'Kahan?', es: '¿Dónde?', fr: 'Où ?', en: 'Where?' },
  'where?': { vi: 'Ở đâu?', hi: 'कहाँ?', hinglish: 'Kahan?', es: '¿Dónde?', fr: 'Où ?', en: 'Where?' },
  who: { vi: 'Ai?', hi: 'कौन?', hinglish: 'Kaun?', es: '¿Quién?', fr: 'Qui ?', en: 'Who?' },
  'who?': { vi: 'Ai?', hi: 'कौन?', hinglish: 'Kaun?', es: '¿Quién?', fr: 'Qui ?', en: 'Who?' },
  when: { vi: 'Khi nào?', hi: 'कब?', hinglish: 'Kab?', es: '¿Cuándo?', fr: 'Quand ?', en: 'When?' },
  'when?': { vi: 'Khi nào?', hi: 'कब?', hinglish: 'Kab?', es: '¿Cuándo?', fr: 'Quand ?', en: 'When?' },
  'where are you': { vi: 'Bạn đang ở đâu?', hi: 'आप कहाँ हैं?', hinglish: 'Aap kahan ho?', es: '¿Dónde estás?', fr: 'Où es-tu ?', en: 'Where are you?' },
  'where are you?': { vi: 'Bạn đang ở đâu?', hi: 'आप कहाँ हैं?', hinglish: 'Aap kahan ho?', es: '¿Dónde estás?', fr: 'Où es-tu ?', en: 'Where are you?' },
  'i love you': { vi: 'Tôi yêu bạn', hi: 'मैं तुमसे प्यार करता हूँ', hinglish: 'Main tumse pyar karta hoon', es: 'Te quiero', fr: 'Je t\'aime', en: 'I love you' },
  'welcome': { vi: 'Chào mừng', hi: 'स्वागत है', hinglish: 'Swagat hai / Welcome', es: 'Bienvenido', fr: 'Bienvenue', en: 'Welcome' },
  'sorry': { vi: 'Xin lỗi', hi: 'माफ़ करना', hinglish: 'Maaf karna / Sorry', es: 'Lo siento', fr: 'Désolé', en: 'Sorry' },
  'please': { vi: 'Làm ơn', hi: 'कृपया', hinglish: 'Kripya / Please', es: 'Por favor', fr: 'S\'il vous plaît', en: 'Please' },
  'congratulations': { vi: 'Chúc mừng', hi: 'बधाई हो', hinglish: 'Badhai ho / Congrats', es: 'Felicidades', fr: 'Félicitations', en: 'Congratulations' }
};

export function getOpenRouterKey() {
  try {
    const stored = localStorage.getItem(KEY_STORAGE);
    if (stored) return stored;
  } catch {
    // ignore
  }
  return import.meta.env.VITE_OPENROUTER_API_KEY || '';
}

export function setOpenRouterKey(value) {
  try {
    const v = (value || '').trim();
    if (v) localStorage.setItem(KEY_STORAGE, v);
    else localStorage.removeItem(KEY_STORAGE);
    return v;
  } catch {
    return '';
  }
}

export function hasOpenRouterKey() {
  return !!getOpenRouterKey();
}

export function getCachedTranslation(text, targetLang) {
  if (!text || !targetLang) return null;
  const normText = text.trim();
  const key = `${targetLang}::${normText}`;
  if (memCache.has(key)) return memCache.get(key);

  // Instant Dictionary lookup (0ms)
  const lower = normText.toLowerCase().replace(/^[!.,\s]+|[!.,\s]+$/g, '');
  if (INSTANT_DICT[lower] && INSTANT_DICT[lower][targetLang]) {
    const res = INSTANT_DICT[lower][targetLang];
    savePersistentCache(key, res);
    return res;
  }

  return null;
}

// Ultra-fast OpenRouter direct translation call
async function translateViaOpenRouter(text, targetLang, apiKey) {
  const targetLabel = LANGUAGE_MAP[targetLang] || targetLang;
  const maxTokens = Math.max(32, Math.min(256, Math.ceil(text.length * 1.5)));

  // Try the primary ultra-fast Gemini 2.0 Flash model
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);

  try {
    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Whisper Chat',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: FAST_MODELS[0],
        messages: [
          {
            role: 'system',
            content: `You are an instant ultra-fast translator. Translate the text into ${targetLabel}. Output ONLY the raw translated text. Never add quotes, prefixes, or explanations.`
          },
          { role: 'user', content: text }
        ],
        temperature: 0,
        max_tokens: maxTokens,
      }),
    });

    clearTimeout(timeout);

    if (resp.ok) {
      const data = await resp.json();
      const content = data?.choices?.[0]?.message?.content?.trim();
      if (content) return content;
    }
  } catch {
    clearTimeout(timeout);
  }

  // Fast fallback to second ultra-fast model if available
  try {
    const fallbackResp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: FAST_MODELS[1] || FAST_MODELS[2],
        messages: [
          { role: 'user', content: `Translate into ${targetLabel}. Output translation only:\n${text}` }
        ],
        temperature: 0,
        max_tokens: maxTokens,
      }),
    });

    if (fallbackResp.ok) {
      const data = await fallbackResp.json();
      const content = data?.choices?.[0]?.message?.content?.trim();
      if (content) return content;
    }
  } catch {
    // fallback to web
  }

  return null;
}

// Zero-key ultra-fast web translation fallback (sub-200ms)
async function translateViaWeb(text, targetLang) {
  // Map targetLang to API language codes
  let targetCode = targetLang;
  if (targetLang === 'hinglish') targetCode = 'hi';

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=autodetect|${targetCode}`;
    const resp = await fetch(url);
    if (resp.ok) {
      const data = await resp.json();
      const translated = data?.responseData?.translatedText;
      if (translated && !translated.startsWith('MYMEMORY WARNING')) {
        return translated;
      }
    }
  } catch {
    // ignore
  }

  return null;
}

// Core translation dispatcher with concurrent inflight sharing
const inflightRequests = new Map();

export async function translateText(text, targetLang) {
  if (!text || !targetLang) return text;
  const normText = text.trim();
  if (!normText) return text;

  // 1. Check instant L1 & L2 cache (0ms)
  const cached = getCachedTranslation(normText, targetLang);
  if (cached) return cached;

  const key = `${targetLang}::${normText}`;
  if (inflightRequests.has(key)) {
    return inflightRequests.get(key);
  }

  const task = (async () => {
    const apiKey = getOpenRouterKey();

    // 2. If API Key is present, query ultra-fast OpenRouter LLM
    if (apiKey) {
      const aiResult = await translateViaOpenRouter(normText, targetLang, apiKey);
      if (aiResult) {
        savePersistentCache(key, aiResult);
        return aiResult;
      }
    }

    // 3. Ultra-fast Web Fallback
    const webResult = await translateViaWeb(normText, targetLang);
    if (webResult) {
      savePersistentCache(key, webResult);
      return webResult;
    }

    // 4. Return original if completely untranslatable
    return normText;
  })().finally(() => {
    inflightRequests.delete(key);
  });

  inflightRequests.set(key, task);
  return task;
}

// Background prefetch function to warm the cache for incoming messages
export function prefetchTranslation(text, targetLang) {
  if (!text || !targetLang) return;
  const cached = getCachedTranslation(text, targetLang);
  if (cached) return;
  translateText(text, targetLang).catch(() => {});
}

```

## File: src/lib/query-client.js

```text
import { QueryClient } from '@tanstack/react-query';

export const queryClientInstance = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1,
		},
	},
});
```

## File: src/lib/utils.js

```text
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
} 

export const isIframe = window.self !== window.top;

```

## File: src/main.jsx

```text
import '@/api/base44Client'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)

```

## File: src/pages/Activity.jsx

```text
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, UserPlus, MessageCircle, Eye } from 'lucide-react';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import Avatar from '@/components/Avatar';
import { getLocalProfile, formatRelativeTime } from '@/lib/chat-utils';

const ICONS = {
  follow: UserPlus,
  message: MessageCircle,
  story_view: Eye,
  reaction: Heart,
  mention: Heart,
};

export default function Activity() {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const me = getLocalProfile();

  const load = async () => {
    if (!me) return;
    try {
      const list = await db.entities.Notification.filter({ recipient_id: me.profile_id }, '-created_date', 50);
      setNotifs(list);
    } catch {
      // ignore
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const unsub = db.entities.Notification.subscribe((e) => {
      if (e.data?.recipient_id === me?.profile_id) load();
    });
    return unsub;
  }, []);

  const markAll = async () => {
    try {
      await db.entities.Notification.updateMany(
        { recipient_id: me.profile_id, read: false },
        { $set: { read: true } }
      );
      load();
    } catch {
      // ignore
    }
  };

  const open = (n) => {
    if (n.type === 'message' && n.target_id) navigate(`/chat/${n.target_id}`);
    else if (n.actor_id) navigate(`/profile/${n.actor_id}`);
  };

  return (
    <div className="min-h-screen relative">
      <BackgroundOrbs />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-heading font-bold">Activity</h1>
          {notifs.some((n) => !n.read) && (
            <button onClick={markAll} className="text-xs text-primary font-body">
              Mark all read
            </button>
          )}
        </div>
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-foreground/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : notifs.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={36} className="mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground font-body">No activity yet</p>
            <p className="text-xs text-muted-foreground/70 font-body mt-1">
              Follows and new messages will show up here
            </p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden divide-y divide-foreground/10">
            {notifs.map((n) => {
              const Icon = ICONS[n.type] || Heart;
              return (
                <button
                  key={n.id}
                  onClick={() => open(n)}
                  className={`w-full flex items-center gap-3 p-3 hover:bg-card/40 text-left ${
                    !n.read ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="relative shrink-0">
                    <Avatar name={n.actor_name} color={n.actor_avatar_color} avatarUrl={n.actor_avatar_url} size={44} />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full sketch-fill flex items-center justify-center">
                      <Icon size={11} className="text-primary-foreground" />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body">
                      <span className="font-medium">@{n.actor_name || 'someone'}</span> {n.text}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{formatRelativeTime(n.created_date)}</p>
                  </div>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
```

## File: src/pages/Chat.jsx

```text
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Menu, LogOut, Users, ChevronDown, Search, Languages } from 'lucide-react';

import MessageBubble from '@/components/chat/MessageBubble';
import ChatInput from '@/components/chat/ChatInput';
import TypingIndicator from '@/components/chat/TypingIndicator';
import RoomInfo from '@/components/chat/RoomInfo';
import SettingsPanel from '@/components/chat/SettingsPanel';
import EmptyChatState from '@/components/chat/EmptyChatState';
import DateSeparator from '@/components/chat/DateSeparator';
import MessageSearch from '@/components/chat/MessageSearch';
import StarredMessages from '@/components/chat/StarredMessages';
import PinnedMessages from '@/components/chat/PinnedMessages';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import { ensureProfile, getLocalProfile, getRoomSettings, saveRoom } from '@/lib/chat-utils';
import { languageLabel } from '@/lib/languages';
import { prefetchTranslation } from '@/lib/openrouter';

export default function Chat() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showStarred, setShowStarred] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(null);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const participantRef = useRef(null);
  const participantEntityIdRef = useRef(null);
  const roomEntityIdRef = useRef(null);
  const typingDebounceRef = useRef(null);
  const typingClearRef = useRef(null);

  // Auto-scroll
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    setShowScrollButton(!isAtBottom);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, participants, scrollToBottom]);

  // Main room init
  useEffect(() => {
    let unsubMessages = null;
    let unsubRoom = null;
    let unsubParticipants = null;
    let heartbeat = null;
    let cancelled = false;

    async function init() {
      try {
        let profile = participantRef.current;
        if (!profile) {
          const p0 = await ensureProfile();
          setProfileLoaded(p0);
          participantRef.current = {
            id: p0.profile_id,
            name: p0.display_name,
            color: p0.avatar_color,
            avatar_url: p0.avatar_url || '',
            username: p0.username || '',
          };
        }
        const p = participantRef.current;
        const settings = getRoomSettings(roomId);

        // Check / create ChatRoom
        const existingRooms = await db.entities.ChatRoom.filter({ room_id: roomId });
        let chatRoom;

        if (existingRooms.length === 0) {
          chatRoom = await db.entities.ChatRoom.create({
            room_id: roomId,
            owner_id: settings?.owner_id || p.id,
            room_name: settings?.room_name || '',
            max_participants: settings?.max_participants || 2,
            allow_file_sharing: settings?.allow_file_sharing ?? true,
            allow_new_joins: settings?.allow_new_joins ?? true,
            typing_preview_visible: settings?.typing_preview_visible ?? true,
            message_notifications: settings?.message_notifications ?? true,
            status: 'waiting',
          });
        } else {
          chatRoom = existingRooms[0];
          if (chatRoom.status === 'ended') {
            setError('This room has been ended by the owner.');
            setLoading(false);
            return;
          }
        }

        if (cancelled) return;
        roomEntityIdRef.current = chatRoom.id;
        setRoom(chatRoom);
        saveRoom(roomId, chatRoom.room_name || '');

        // Check / create RoomParticipant
        const existingParticipants = await db.entities.RoomParticipant.filter({
          room_id: roomId,
        });
        if (cancelled) return;

        const myExisting = existingParticipants.find(
          (rp) => rp.participant_id === p.id
        );

        if (myExisting) {
          await db.entities.RoomParticipant.update(myExisting.id, {
            online: true,
            typing: false,
            typing_text: '',
          });
          participantEntityIdRef.current = myExisting.id;
        } else {
          // Check if room is full
          if (existingParticipants.length >= (chatRoom.max_participants || 2)) {
            setError('This room is full.');
            setLoading(false);
            return;
          }
          if (!chatRoom.allow_new_joins && chatRoom.owner_id !== p.id) {
            setError('The owner has locked this room.');
            setLoading(false);
            return;
          }

          const newPart = await db.entities.RoomParticipant.create({
            room_id: roomId,
            participant_id: p.id,
            name: p.name,
            avatar_color: p.color,
            avatar_url: p.avatar_url || '',
            online: true,
            typing: false,
            typing_text: '',
            is_owner: chatRoom.owner_id === p.id,
          });
          participantEntityIdRef.current = newPart.id;

          // Notify room
          if (chatRoom.message_notifications && existingParticipants.length > 0) {
            toast.success(`${p.name} joined the room`);
          }

          // Update room status
          if (chatRoom.status === 'waiting') {
            await db.entities.ChatRoom.update(chatRoom.id, { status: 'active' });
          }
        }

        // Reload participants
        const allParticipants = await db.entities.RoomParticipant.filter({
          room_id: roomId,
        });
        if (cancelled) return;
        setParticipants(allParticipants);

        // Load messages
        const existingMessages = await db.entities.ChatMessage.filter(
          { room_id: roomId },
          'created_date',
          200
        );
        if (cancelled) return;
        setMessages(existingMessages);

        // Warm translation cache for recent messages
        if (p.language && p.auto_translate) {
          existingMessages.slice(-10).forEach((m) => {
            if (m.content && m.sender_id !== p.id) {
              prefetchTranslation(m.content, p.language);
            }
          });
        }

        // Mark unseen messages from others
        const toMarkSeen = existingMessages.filter(
          (m) => m.sender_id !== p.id && !m.seen
        );
        toMarkSeen.forEach((msg) => {
          db.entities.ChatMessage.update(msg.id, { seen: true }).catch(() => {});
        });

        // Subscribe to messages
        unsubMessages = db.entities.ChatMessage.subscribe((event) => {
          if (event.data.room_id !== roomId) return;
          if (event.type === 'create') {
            setMessages((prev) => {
              if (prev.some((m) => m.id === event.data.id)) return prev;
              return [...prev, event.data];
            });
            if (event.data.sender_id !== participantRef.current?.id) {
              const myProfile = participantRef.current;
              if (myProfile?.language && (myProfile?.auto_translate || true) && event.data.content) {
                prefetchTranslation(event.data.content, myProfile.language);
              }
              db.entities.ChatMessage
                .update(event.data.id, { seen: true })
                .catch(() => {});
            }
          } else if (event.type === 'update') {
            setMessages((prev) =>
              prev.map((m) => (m.id === event.data.id ? event.data : m))
            );
          } else if (event.type === 'delete') {
            setMessages((prev) => prev.filter((m) => m.id !== event.data.id));
          }
        });

        // Subscribe to room updates
        unsubRoom = db.entities.ChatRoom.subscribe((event) => {
          if (event.data.room_id !== roomId) return;
          if (event.type === 'update') {
            setRoom(event.data);
            if (event.data.status === 'ended') {
              setError('The owner has ended this room.');
              setLoading(false);
            }
          }
        });

        // Subscribe to participant changes
        unsubParticipants = db.entities.RoomParticipant.subscribe((event) => {
          if (event.data.room_id !== roomId) return;
          if (event.type === 'create') {
            setParticipants((prev) => {
              if (prev.some((p) => p.id === event.data.id)) return prev;
              return [...prev, event.data];
            });
          } else if (event.type === 'update') {
            setParticipants((prev) =>
              prev.map((p) => (p.id === event.data.id ? event.data : p))
            );
          } else if (event.type === 'delete') {
            setParticipants((prev) => prev.filter((p) => p.id !== event.data.id));
          }
        });

        // Heartbeat
        heartbeat = setInterval(async () => {
          try {
            if (!participantEntityIdRef.current) return;
            await db.entities.RoomParticipant.update(
              participantEntityIdRef.current,
              { online: true }
            );
          } catch {
            // ignore
          }
        }, 15000);

        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError('Failed to join room. Please try again.');
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      if (unsubMessages) unsubMessages();
      if (unsubRoom) unsubRoom();
      if (unsubParticipants) unsubParticipants();
      if (heartbeat) clearInterval(heartbeat);
      if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
      if (typingClearRef.current) clearTimeout(typingClearRef.current);

      // Mark offline on leave
      if (participantEntityIdRef.current) {
        db.entities.RoomParticipant
          .update(participantEntityIdRef.current, {
            online: false,
            typing: false,
            typing_text: '',
          })
          .catch(() => {});
      }
    };
  }, [roomId]);

  // beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (participantEntityIdRef.current) {
        db.entities.RoomParticipant
          .update(participantEntityIdRef.current, {
            online: false,
            typing: false,
            typing_text: '',
          })
          .catch(() => {});
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Send message
  const sendMessage = async (content, messageType = 'text', fileUrl = null, fileName = null, replyTo = null) => {
    const p = participantRef.current;
    if (!p) return;
    try {
      await db.entities.ChatMessage.create({
        room_id: roomId,
        sender_id: p.id,
        sender_name: p.name,
        sender_avatar_color: p.color,
        sender_avatar_url: p.avatar_url || '',
        content: content || '',
        message_type: messageType,
        file_url: fileUrl,
        file_name: fileName,
        seen: false,
        reply_to: replyTo ? JSON.stringify(replyTo) : '',
      });
      if (roomEntityIdRef.current) {
        const preview = messageType === 'text'
          ? (content || '').slice(0, 80)
          : messageType === 'image' ? '📷 Photo'
          : messageType === 'video' ? '🎥 Video'
          : messageType === 'audio' ? '🎙️ Voice message'
          : `📎 ${fileName || 'File'}`;
        db.entities.ChatRoom.update(roomEntityIdRef.current, {
          last_message_preview: preview,
          last_message_at: new Date().toISOString(),
          last_sender_name: p.name,
          last_message_type: messageType,
          last_sender_avatar_url: p.avatar_url || '',
        }).catch(() => {});
      }
    } catch {
      toast.error('Failed to send message');
    }
  };

  const handleSend = (text, replyTo = null) => {
    sendMessage(text, 'text', null, null, replyTo);
    handleTyping('');
    setReplyingTo(null);
  };

  const handleFileUpload = async (file) => {
    if (room && !room.allow_file_sharing) {
      toast.error('File sharing is disabled in this room');
      return;
    }
    setUploading(true);
    try {
      const result = await db.integrations.Core.UploadFile({ file });
      let messageType = 'file';
      if (file.type.startsWith('image/')) messageType = 'image';
      else if (file.type.startsWith('video/')) messageType = 'video';
      else if (file.type.startsWith('audio/')) messageType = 'audio';
      await sendMessage(file.name, messageType, result.file_url, file.name);
    } catch {
      toast.error('Failed to upload file');
    }
    setUploading(false);
  };

  // Typing
  const handleTyping = useCallback((text) => {
    const isTyping = text.length > 0;
    const entityId = participantEntityIdRef.current;
    if (!entityId) return;

    if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
    if (typingClearRef.current) clearTimeout(typingClearRef.current);

    if (!isTyping) {
      db.entities.RoomParticipant
        .update(entityId, { typing: false, typing_text: '' })
        .catch(() => {});
      return;
    }

    typingDebounceRef.current = setTimeout(() => {
      db.entities.RoomParticipant
        .update(entityId, { typing: true, typing_text: text })
        .catch(() => {});
    }, 300);

    typingClearRef.current = setTimeout(() => {
      db.entities.RoomParticipant
        .update(entityId, { typing: false, typing_text: '' })
        .catch(() => {});
    }, 4000);
  }, []);

  // Settings actions
  const updateRoomSettings = async (settings) => {
    if (!roomEntityIdRef.current) return;
    await db.entities.ChatRoom.update(roomEntityIdRef.current, settings);
  };

  const clearMessages = async () => {
    await db.entities.ChatMessage.deleteMany({ room_id: roomId });
    setMessages([]);
  };

  const endRoom = async () => {
    await db.entities.ChatMessage.deleteMany({ room_id: roomId });
    await db.entities.RoomParticipant.deleteMany({ room_id: roomId });
    await db.entities.ChatRoom.update(roomEntityIdRef.current, { status: 'ended' });
    navigate('/');
  };

  const handleLeave = () => navigate('/');

  // Message actions
  const handleReaction = async (message, emoji) => {
    const p = participantRef.current;
    if (!p) return;
    let reactions = {};
    try { reactions = JSON.parse(message.reactions || '{}'); } catch { reactions = {}; }
    const users = reactions[emoji] || [];
    if (users.includes(p.id)) {
      reactions[emoji] = users.filter((id) => id !== p.id);
      if (reactions[emoji].length === 0) delete reactions[emoji];
    } else {
      reactions[emoji] = [...users, p.id];
    }
    await db.entities.ChatMessage.update(message.id, { reactions: JSON.stringify(reactions) });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard');
    }).catch(() => {});
  };

  const handleDeleteMessage = async (messageId) => {
    await db.entities.ChatMessage.delete(messageId);
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  };

  const handleReply = (message) => {
    setReplyingTo(JSON.stringify({
      id: message.id,
      name: message.sender_name,
      content: message.content || message.file_name || 'File',
    }));
  };

  const handleStar = async (message) => {
    await db.entities.ChatMessage.update(message.id, { starred: !message.starred });
  };

  const handleEdit = async (messageId, newContent) => {
    await db.entities.ChatMessage.update(messageId, { content: newContent, edited: true });
  };

  const handlePin = async (message) => {
    if (message.pinned) {
      await db.entities.ChatMessage.update(message.id, { pinned: false });
    } else {
      const pinned = messages.filter((m) => m.pinned);
      for (const p of pinned) {
        await db.entities.ChatMessage.update(p.id, { pinned: false });
      }
      await db.entities.ChatMessage.update(message.id, { pinned: true });
    }
  };

  const handleVoiceMessage = async (file) => {
    setUploading(true);
    try {
      const result = await db.integrations.Core.UploadFile({ file });
      await sendMessage(file.name, 'audio', result.file_url, file.name);
    } catch {
      toast.error('Failed to send voice message');
    }
    setUploading(false);
  };

  // Derived values
  const me = participantRef.current;
  const myProfile = profileLoaded || getLocalProfile();
  const viewerLang = myProfile?.language || '';
  const autoTranslate = !!myProfile?.auto_translate;
  const myParticipant = participants.find((p) => p.participant_id === me?.id);
  const isOwner = myParticipant?.is_owner || false;
  const typingParticipants = participants.filter(
    (p) => p.typing && p.participant_id !== me?.id
  );
  const onlineCount = participants.filter((p) => p.online).length;
  const showTypingText = isOwner && room?.typing_preview_visible;
  const isWaiting = participants.length < 2 || room?.status === 'waiting';
  const pinnedMessages = messages.filter((m) => m.pinned);
  const starredMessages = messages.filter((m) => m.starred);
  const displayedMessages = searchQuery
    ? messages.filter((m) => m.content?.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <BackgroundOrbs />
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-foreground/20 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Joining room...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <BackgroundOrbs />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 max-w-md text-center"
        >
          <h2 className="text-xl font-semibold mb-2">Oops!</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 rounded-xl sketch-fill font-heading font-bold shadow-lg"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  const roomInfoProps = {
    room,
    roomId,
    participant: me,
    participants,
    isOwner,
    messages,
    starredCount: starredMessages.length,
    onShowStarred: () => setShowStarred(true),
    onLeave: handleLeave,
    onOpenSettings: () => setShowSettings(true),
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      <BackgroundOrbs />

      {/* Starred Messages */}
      {showStarred && (
        <StarredMessages messages={starredMessages} onClose={() => setShowStarred(false)} />
      )}

      {/* Settings Panel */}
      <SettingsPanel
        room={room}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onUpdate={updateRoomSettings}
        onClearMessages={clearMessages}
        onEndRoom={endRoom}
      />

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-80 shrink-0 p-3">
        <RoomInfo {...roomInfoProps} />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSidebar(false)}
              className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] z-50 p-3"
            >
              <RoomInfo {...roomInfoProps} onClose={() => setShowSidebar(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col p-3 min-w-0">
        <div className="glass-card flex-1 flex flex-col overflow-hidden relative">
          {/* Header */}
          <div className="px-4 py-3 border-b border-foreground/20 flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(true)}
              className="md:hidden p-2 rounded-xl hover:bg-card/40 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shrink-0">
                <span className="text-white font-bold text-sm">
                  {(room?.room_name || 'W').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">
                  {room?.room_name || 'Whisper Room'}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users size={10} />
                  {participants.length} {participants.length === 1 ? 'member' : 'members'}
                  <span className="w-1 h-1 rounded-full bg-muted-foreground mx-0.5" />
                  <span className="text-green-500">{onlineCount} online</span>
                  {viewerLang && (
                    <span className="inline-flex items-center gap-0.5 ml-1 text-[10px] text-muted-foreground">
                      <Languages size={10} /> {languageLabel(viewerLang)}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-xl hover:bg-card/40 text-muted-foreground transition-colors shrink-0"
              title="Search messages"
            >
              <Search size={18} />
            </button>
            <button
              onClick={handleLeave}
              className="p-2 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors shrink-0"
              title="Leave room"
            >
              <LogOut size={18} />
            </button>
          </div>

          {/* Search bar */}
          <AnimatePresence>
            {showSearch && (
              <MessageSearch
                query={searchQuery}
                onQueryChange={setSearchQuery}
                onClose={() => { setShowSearch(false); setSearchQuery(''); }}
                resultCount={searchQuery ? displayedMessages.length : 0}
              />
            )}
          </AnimatePresence>

          {/* Pinned messages */}
          {pinnedMessages.length > 0 && (
            <PinnedMessages pinnedMessages={pinnedMessages} onUnpin={(id) => {
              const msg = messages.find((m) => m.id === id);
              if (msg) handlePin(msg);
            }} />
          )}

          {/* Messages */}
          <div ref={messagesContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 flex flex-col gap-3">
            {messages.length === 0 ? (
              <EmptyChatState roomId={roomId} isWaiting={isWaiting} />
            ) : (
              <>
                {displayedMessages.map((msg, idx) => {
                  const isMine = msg.sender_id === me?.id;
                  const prevMsg = displayedMessages[idx - 1];
                  const showAvatar = !prevMsg || prevMsg.sender_id !== msg.sender_id;
                  const showDateSeparator = !prevMsg ||
                    new Date(prevMsg.created_date).toDateString() !== new Date(msg.created_date).toDateString();
                  return (
                    <div key={msg.id}>
                      {showDateSeparator && <DateSeparator date={msg.created_date} />}
                      <MessageBubble
                        message={msg}
                        isMine={isMine}
                        showAvatar={showAvatar}
                        onReact={handleReaction}
                        onCopy={handleCopy}
                        onDelete={handleDeleteMessage}
                        onReply={handleReply}
                        onStar={handleStar}
                        onEdit={handleEdit}
                        onPin={handlePin}
                        isOwner={isOwner}
                        currentUserId={me?.id}
                        viewerLang={viewerLang}
                        autoTranslate={autoTranslate}
                      />
                    </div>
                  );
                })}
                <AnimatePresence>
                  {typingParticipants.map((tp) => (
                    <TypingIndicator
                      key={tp.id}
                      name={tp.name}
                      color={tp.avatar_color}
                      avatarUrl={tp.avatar_url}
                      text={showTypingText ? tp.typing_text : ''}
                    />
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Scroll to bottom */}
          <AnimatePresence>
            {showScrollButton && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={scrollToBottom}
                className="absolute bottom-20 right-6 p-3 rounded-full sketch-fill shadow-lg z-10"
              >
                <ChevronDown size={20} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Input */}
          <div className="p-3 border-t border-foreground/20">
            <ChatInput
              onSend={handleSend}
              onTyping={handleTyping}
              onFileUpload={handleFileUpload}
              onVoiceMessage={handleVoiceMessage}
              disabled={uploading}
              uploading={uploading}
              allowFiles={room?.allow_file_sharing ?? true}
              replyingTo={replyingTo}
              onReplyCancel={() => setReplyingTo(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

## File: src/pages/ForgotPassword.jsx

```text
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await db.auth.resetPasswordRequest(email);
    } catch {
      // Always show success regardless
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <AuthLayout
      icon={Mail}
      title="Reset password"
      subtitle="We'll send you a link to reset it"
      footer={
        <Link to="/login" className="text-primary font-medium hover:underline">
          <ArrowLeft className="w-3 h-3 inline mr-1" />Back to log in
        </Link>
      }
    >
      {sent ? (
        <p className="text-sm text-foreground text-center">
          If an account exists with that email, you'll receive a password reset link shortly.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}

```

## File: src/pages/Home.jsx

```text
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shield, Zap, Lock, Settings, Users, ChevronDown, Pencil } from 'lucide-react';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import ThemeToggle from '@/components/ThemeToggle';
import { Image } from '@/components/ui/image';
import SavedRooms from '@/components/SavedRooms';
import Avatar from '@/components/Avatar';
import {
  generateRoomId,
  generateParticipantId,
  generateNickname,
  generateAvatarColor,
  ensureProfile,
  getLocalProfile,
  updateProfile,
  setLocalParticipant,
  setRoomSettings,
} from '@/lib/chat-utils';

const MAX_OPTIONS = [2, 5, 10, 25, 50];

const HERO_IMG = 'https://media.db.com/images/public/6a52400c850310aa9301674e/bc69eca05_generated_image.png';
const LEANING_IMG = 'https://media.db.com/images/public/6a52400c850310aa9301674e/4d047077c_generated_image.png';
const PEEKING_IMG = 'https://media.db.com/images/public/6a52400c850310aa9301674e/5f00e1c71_generated_image.png';

export default function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [joinLink, setJoinLink] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(2);
  const [allowFileSharing, setAllowFileSharing] = useState(true);
  const [typingPreview, setTypingPreview] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    ensureProfile()
      .then((p) => {
        setProfile(p);
        if (p?.display_name) setName((cur) => cur || p.display_name);
      })
      .catch(() => setProfile(getLocalProfile()));
  }, []);

  const initParticipant = (roomId) => {
    const p = getLocalProfile();
    const participant = {
      id: p?.profile_id || generateParticipantId(),
      name: name.trim() || p?.display_name || generateNickname(),
      color: p?.avatar_color || generateAvatarColor(),
      avatar_url: p?.avatar_url || '',
      username: p?.username || '',
    };
    setLocalParticipant(roomId, participant);
    if (name.trim() && name.trim() !== p?.display_name) {
      updateProfile({ display_name: name.trim() }).catch(() => {});
    }
    return participant;
  };

  const createRoom = () => {
    const roomId = generateRoomId();
    const participant = initParticipant(roomId);
    setRoomSettings(roomId, {
      owner_id: participant.id,
      room_name: roomName.trim(),
      max_participants: maxParticipants,
      allow_file_sharing: allowFileSharing,
      allow_new_joins: true,
      typing_preview_visible: typingPreview,
      message_notifications: true,
    });
    navigate(`/chat/${roomId}`);
  };

  const joinRoom = (e) => {
    e.preventDefault();
    let id = joinLink.trim();
    if (!id) return;
    if (id.includes('/chat/')) {
      id = id.split('/chat/')[1].split(/[/?#]/)[0];
    }
    if (id) {
      initParticipant(id);
      navigate(`/chat/${id}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8 relative">
      <BackgroundOrbs />
      <ThemeToggle />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass-card p-6 md:p-10 w-full max-w-lg"
      >
        {/* Title */}
        <div className="text-center mb-6">
          <svg width="48" height="44" viewBox="0 0 48 44" fill="none" className="mx-auto mb-2">
            <path
              d="M14 30 C7 30 3 26 3 20 C3 13 8 9 14 9 C15 4 20 2 26 2 C33 2 38 6 39 11 C44 11 47 15 47 20 C47 25 43 29 38 29 L16 29 Z"
              fill="hsl(var(--primary))"
              stroke="hsl(var(--foreground))"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <circle cx="18" cy="38" r="3.5" fill="hsl(var(--primary))" stroke="hsl(var(--foreground))" strokeWidth="2"/>
            <circle cx="11" cy="42" r="2" fill="hsl(var(--primary))" stroke="hsl(var(--foreground))" strokeWidth="1.5"/>
          </svg>
          <h1 className="text-4xl font-heading font-bold text-primary tracking-tight">Whisper</h1>
        </div>

        {/* Hero illustration with speech bubble */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3 mb-8">
          <div className="relative max-w-[220px]">
            <div className="sketch-border bg-card/50 px-4 py-3 rounded-2xl">
              <p className="text-sm font-body leading-relaxed text-foreground">
                Anonymous, instant, real-time chat. No signup required.
              </p>
            </div>
            <svg
              className="absolute top-1/2 -translate-y-1/2 -right-2"
              width="14"
              height="16"
              viewBox="0 0 14 16"
              fill="none"
            >
              <path
                d="M0 0 L14 8 L0 16 Z"
                fill="hsl(var(--card))"
                stroke="hsl(var(--foreground))"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="w-28 md:w-40 shrink-0">
            <Image
              src={HERO_IMG}
              alt="Person chatting on phone"
              fittingType="fit"
              className="w-full"
            />
          </div>
        </div>

        {/* Profile identity */}
        {profile && (
          <Link
            to="/profile"
            className="flex items-center gap-3 p-3 mb-4 sketch-border rounded-xl bg-card/40 hover:bg-card/60 transition-colors group"
          >
            <Avatar
              name={profile.display_name}
              color={profile.avatar_color}
              avatarUrl={profile.avatar_url}
              size={42}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body font-medium truncate">
                {profile.display_name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                @{profile.username}
              </p>
            </div>
            <Pencil
              size={16}
              className="text-muted-foreground group-hover:text-primary transition-colors shrink-0"
            />
          </Link>
        )}

        {/* Name input */}
        <div className="mb-4">
          <label className="text-xs text-muted-foreground mb-1.5 block font-body">
            Display name <span className="opacity-50">(optional)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="BlueFox"
            maxLength={20}
            className="w-full px-2 py-2.5 glass-input text-sm font-body placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Room Options */}
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="w-full flex items-center justify-between px-4 py-2.5 sketch-border rounded-xl bg-card/40 hover:bg-card/60 transition-colors text-sm font-body mb-3"
        >
          <span className="flex items-center gap-2">
            <Settings size={16} /> Room Options
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform ${showOptions ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mb-4"
            >
              <div className="space-y-4 p-4 sketch-dashed">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block font-body">
                    Room name <span className="opacity-50">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="My Secret Room"
                    maxLength={30}
                    className="w-full px-3 py-2 glass-input text-sm font-body"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block font-body flex items-center gap-1.5">
                    <Users size={12} /> Max participants
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {MAX_OPTIONS.map((n) => (
                      <button
                        key={n}
                        onClick={() => setMaxParticipants(n)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-body transition-colors ${
                          maxParticipants === n
                            ? 'sketch-fill'
                            : 'sketch-border bg-card/30 hover:bg-card/50'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <ToggleRow label="Allow file sharing" value={allowFileSharing} onChange={setAllowFileSharing} />
                <ToggleRow label="Show typing preview" desc="Others can see what you type" value={typingPreview} onChange={setTypingPreview} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Room section with leaning character */}
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            onClick={createRoom}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 sketch-fill text-base font-heading font-bold"
          >
            Create New Room <ArrowRight size={20} />
          </motion.button>
          <div className="w-20 md:w-24 shrink-0 hidden sm:block">
            <Image src={LEANING_IMG} alt="Leaning character" fittingType="fit" className="w-full" />
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-0 border-t-2 border-dashed border-foreground/30" />
          <span className="text-xs text-muted-foreground font-body">or join existing</span>
          <div className="flex-1 h-0 border-t-2 border-dashed border-foreground/30" />
        </div>

        {/* Join section */}
        <div className="flex items-end gap-2 mb-6">
          <div className="w-14 shrink-0 hidden sm:block">
            <Image src={PEEKING_IMG} alt="Peeking character" fittingType="fit" className="w-full" />
          </div>
          <form onSubmit={joinRoom} className="flex-1 flex gap-2">
            <input
              type="text"
              value={joinLink}
              onChange={(e) => setJoinLink(e.target.value)}
              placeholder="Paste room link or ID"
              className="flex-1 px-3 py-2.5 sketch-border rounded-xl bg-card/30 text-sm font-body placeholder:text-muted-foreground/50 focus:bg-card/50 transition-colors"
            />
            <button
              type="submit"
              disabled={!joinLink.trim()}
              className="px-5 py-2.5 sketch-fill rounded-xl text-sm font-heading font-bold disabled:opacity-40"
            >
              Join
            </button>
          </form>
        </div>

        {/* Saved Rooms */}
        <SavedRooms onJoin={(id) => { initParticipant(id); navigate(`/chat/${id}`); }} />

        {/* Footer */}
        <div className="pt-6 border-t-2 border-dashed border-foreground/20 grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <Shield size={18} className="text-foreground/70" />
            <p className="text-[11px] text-muted-foreground font-body">No signup</p>
          </div>
          <div className="flex flex-col items-center gap-1.5 border-x-2 border-dashed border-foreground/20">
            <Zap size={18} className="text-foreground/70" />
            <p className="text-[11px] text-muted-foreground font-body">Real-time</p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Lock size={18} className="text-foreground/70" />
            <p className="text-[11px] text-muted-foreground font-body">Anonymous</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-body">{label}</p>
        {desc && <p className="text-xs text-muted-foreground font-body">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 border-2 ${
          value ? 'bg-primary border-primary' : 'bg-transparent border-foreground'
        }`}
      >
        <motion.div
          animate={{ x: value ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={`absolute top-0.5 w-4 h-4 rounded-full shadow-md ${value ? 'bg-primary-foreground' : 'bg-foreground'}`}
        />
      </button>
    </div>
  );
}
```

## File: src/pages/Login.jsx

```text
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await db.auth.loginViaEmailPassword(email, password);
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    db.auth.loginWithProvider("google", "/");
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="Welcome back"
      subtitle="Log in to your account"
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <Button
        variant="outline"
        className="w-full h-12 text-sm font-medium mb-6"
        onClick={handleGoogle}
      >
        <GoogleIcon className="w-5 h-5 mr-2" />
        Continue with Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">or</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Logging in...
            </>
          ) : (
            "Log in"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}

```

## File: src/pages/Messages.jsx

```text
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit, Settings as SettingsIcon, Search, MessageCircle } from 'lucide-react';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import Avatar from '@/components/Avatar';
import ConversationItem from '@/components/messages/ConversationItem';
import NewChatModal from '@/components/messages/NewChatModal';
import StoriesTray from '@/components/stories/StoriesTray';
import { ensureProfile, getLocalProfile } from '@/lib/chat-utils';

export default function Messages() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [convos, setConvos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    const me = getLocalProfile();
    if (!me) return;
    try {
      const myParts = await db.entities.RoomParticipant.filter({ participant_id: me.profile_id });
      const built = await Promise.all(
        myParts.map(async (mp) => {
          const [rooms, participants] = await Promise.all([
            db.entities.ChatRoom.filter({ room_id: mp.room_id }),
            db.entities.RoomParticipant.filter({ room_id: mp.room_id }),
          ]);
          const room = rooms[0];
          if (!room || room.status === 'ended') return null;
          const others = participants.filter((p) => p.participant_id !== me.profile_id);
          const isGroup = participants.length > 2 || (room.max_participants || 2) > 2;
          let display;
          if (isGroup) {
            display = { name: room.room_name || 'Group chat', isGroup: true };
          } else {
            const other = others[0] || {};
            display = { name: other.name || 'Anonymous', color: other.avatar_color, avatar_url: other.avatar_url, isGroup: false };
          }
          return { room, display };
        })
      );
      const valid = built
        .filter(Boolean)
        .sort((a, b) => (b.room.last_message_at || '').localeCompare(a.room.last_message_at || ''));
      setConvos(valid);
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    ensureProfile().then((p) => {
      setProfile(p);
      load();
    }).catch(() => setLoading(false));
  }, [load]);

  useEffect(() => {
    if (!profile) return;
    const unsubRoom = db.entities.ChatRoom.subscribe((event) => {
      const data = event.data;
      if (!data || !data.room_id) return;
      if (event.type === 'create') {
        load();
      } else if (event.type === 'update') {
        setConvos((prev) => {
          if (!prev.find((c) => c.room.room_id === data.room_id)) {
            load();
            return prev;
          }
          return prev
            .map((c) => (c.room.room_id === data.room_id ? { ...c, room: data } : c))
            .sort((a, b) => (b.room.last_message_at || '').localeCompare(a.room.last_message_at || ''));
        });
      }
    });
    const unsubPart = db.entities.RoomParticipant.subscribe((event) => {
      if (event.data && event.data.participant_id === profile.profile_id) load();
    });
    return () => {
      unsubRoom();
      unsubPart();
    };
  }, [profile, load]);

  const filtered = query
    ? convos.filter((c) => c.display.name.toLowerCase().includes(query.toLowerCase()))
    : convos;

  return (
    <div className="min-h-screen relative">
      <BackgroundOrbs />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => navigate('/profile')} className="flex items-center gap-2">
            <Avatar name={profile?.display_name} color={profile?.avatar_color} avatarUrl={profile?.avatar_url} size={40} />
            <div className="text-left hidden sm:block">
              <p className="text-sm font-body font-medium leading-tight">{profile?.display_name}</p>
              <p className="text-xs text-muted-foreground leading-tight">@{profile?.username}</p>
            </div>
          </button>
          <h1 className="text-xl font-heading font-bold">Messages</h1>
          <div className="flex items-center gap-1">
            <button onClick={() => setShowNew(true)} className="p-2 rounded-xl hover:bg-card/40 transition-colors" title="New message">
              <Edit size={20} />
            </button>
            <button onClick={() => navigate('/settings')} className="p-2 rounded-xl hover:bg-card/40 transition-colors" title="Settings">
              <SettingsIcon size={20} />
            </button>
          </div>
        </div>

        <StoriesTray />

        <div className="flex items-center gap-2 px-3 py-2 sketch-border rounded-xl bg-card/40 mb-3">
          <Search size={16} className="text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations"
            className="flex-1 bg-transparent outline-none text-sm font-body placeholder:text-muted-foreground/50"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-foreground/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <MessageCircle size={40} className="text-muted-foreground/40 mb-3" />
            <p className="text-sm font-body text-muted-foreground mb-1">No conversations yet</p>
            <p className="text-xs text-muted-foreground/70 mb-4">Start a new message or create a group</p>
            <button onClick={() => setShowNew(true)} className="px-5 py-2.5 sketch-fill text-sm font-heading font-bold">
              New Message
            </button>
          </div>
        ) : (
          <motion.div layout className="glass-card overflow-hidden divide-y divide-foreground/10">
            {filtered.map((c) => (
              <ConversationItem key={c.room.room_id} convo={c} myName={profile?.display_name} />
            ))}
          </motion.div>
        )}
      </div>

      {showNew && <NewChatModal onClose={() => setShowNew(false)} />}
    </div>
  );
}
```

## File: src/pages/OAuthConsent.jsx

```text
import React, { useEffect, useState } from "react";
import { appParams } from "@/lib/app-params";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

// App-side OAuth consent page for the app's MCP server. The platform redirects
// AI clients here (see base44/mcp/config.json `consent_path`) with an opaque
// `ctx` handle — the authorization request itself lives on the server. This page
// gates on the app-user session, fetches the display info for that handle, shows
// the categories of access being granted, and posts the approve/deny decision.
// Do not change the fetch calls, headers, or the `ctx` handle handling — styling
// and copy are safe to edit.
export default function OAuthConsent() {
  const ctx = new URLSearchParams(window.location.search).get("ctx");
  const [info, setInfo] = useState(null);
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [decided, setDecided] = useState("");
  const [error, setError] = useState("");
  const [reconnect, setReconnect] = useState("");

  useEffect(() => {
    (async () => {
      let redirecting = false;
      try {
        if (!ctx) {
          setError("This authorization link is invalid or has expired.");
          return;
        }
        // Resolve the handle first: a dead handle must never render
        // approve/deny, and the response carries the app's configured login
        // route for the signed-out redirect below. Send the session (cookie +
        // bearer token) so the server can list the granted tools for a
        // signed-in user — the same auth the approve/deny call sends; without
        // it the display request is anonymous and shows no tools.
        const infoHeaders = {};
        if (appParams.token) infoHeaders.Authorization = "Bearer " + appParams.token;
        const res = await fetch(
          `/api/apps/${appParams.appId}/mcp/consent-info?handle=${encodeURIComponent(ctx)}`,
          { credentials: "include", headers: infoHeaders },
        );
        if (!res.ok) {
          setError("This authorization link is invalid or has expired.");
          return;
        }
        const data = await res.json();
        // Gate on the server's auth result, NOT db.auth.isAuthenticated():
        // the SDK check runs the bearer path, so a cookie-only session (platform
        // login/SSO, or a private app with a stale localStorage token) would read
        // as signed-out and redirect — even though /consent-info just
        // authenticated this same request via its cookie fallback. data.authenticated
        // keeps the redirect decision in agreement with what the server returned.
        if (!data.authenticated) {
          // The short handle rides back in returnTo; login_path is
          // owner-configured and validated server-side as a same-origin path.
          // Send from_url too: a custom-auth app coerced to platform auth (e.g.
          // public_without_login under workspace SSO) serves the platform login,
          // which honors from_url rather than returnTo. Rebuild the query from
          // `ctx` alone — never forward window.location.search raw: the platform
          // resume returns from_url verbatim, so crafted extras on the consent
          // link (app_base_url, access_token, …) would ride through the login
          // round-trip and app-params.js would persist them into the freshly
          // authenticated session.
          const returnTo =
            window.location.pathname + "?ctx=" + encodeURIComponent(ctx);
          const encoded = encodeURIComponent(returnTo);
          redirecting = true; // keep the spinner while the browser navigates
          window.location.href =
            (data.login_path || "/login") + "?returnTo=" + encoded + "&from_url=" + encoded;
          return;
        }
        setInfo(data);
      } catch (e) {
        setError("Could not load this authorization request. Please try again.");
      } finally {
        if (!redirecting) setChecking(false);
      }
    })();
  }, [ctx]);

  const respond = async (action) => {
    setSubmitting(true);
    setError("");
    try {
      const headers = { "Content-Type": "application/json" };
      // Cookie-backed sessions carry no token; sending "Bearer null" would
      // shadow the valid cookie, so add the header only when a token exists.
      if (appParams.token) headers.Authorization = "Bearer " + appParams.token;
      const res = await fetch(`/api/apps/${appParams.appId}/mcp/authorize-grant`, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({ ctx, action }),
      });
      if (!res.ok) {
        // 401 = the session expired before the (single-use, still-unconsumed)
        // handle was spent; retrying the same controls re-sends the dead session
        // forever. Send the user back through login preserving `ctx` — the same
        // redirect the initial signed-out path uses — so they can return and
        // approve the still-valid handle.
        if (res.status === 401) {
          const returnTo = window.location.pathname + "?ctx=" + encodeURIComponent(ctx);
          const encoded = encodeURIComponent(returnTo);
          window.location.href =
            ((info && info.login_path) || "/login") + "?returnTo=" + encoded + "&from_url=" + encoded;
          return;
        }
        // These all come AFTER the single-use handle is atomically consumed
        // (409 tool set changed; 403 host/resource/app mismatch; 404 access
        // gone; 400 malformed/handle already used), so retrying can only 404.
        // Show a terminal reconnect state, not an impossible "try again".
        if ([400, 403, 404, 409].includes(res.status)) {
          let detail = "";
          try { detail = (await res.json()).detail; } catch (_) { /* keep default */ }
          setReconnect(detail || "This authorization can no longer be completed. Reconnect from your AI client to try again.");
          setSubmitting(false);
          return;
        }
        throw new Error("Could not complete authorization. Please try again.");
      }
      const data = await res.json();
      window.location.href = data.redirect_url;
      if (!/^https?:/i.test(data.redirect_url)) {
        // Custom-scheme redirect (native AI clients, e.g. cursor://): browsers
        // may block or not visibly navigate, so show a terminal state instead
        // of an eternal spinner.
        setDecided(action);
        setSubmitting(false);
      }
    } catch (e) {
      setError(e.message);
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <AuthLayout icon={ShieldCheck} title="Authorize access">
        <div className="flex items-center justify-center py-6 text-muted-foreground">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
          Loading…
        </div>
      </AuthLayout>
    );
  }

  const client = (info && info.client_name) || "An AI client";
  const appName = (info && info.app_name) || "this app";

  if (decided) {
    return (
      <AuthLayout
        icon={ShieldCheck}
        title={decided === "approve" ? "Access granted" : "Access denied"}
        subtitle={`You can return to ${client} and close this window.`}
      />
    );
  }

  // Terminal: the authorization request is no longer valid (tool set changed +
  // handle consumed). Retrying can't succeed, so show reconnect guidance with
  // no approve/deny controls.
  if (reconnect) {
    return (
      <AuthLayout icon={ShieldCheck} title="Reconnect required">
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {reconnect}
        </div>
      </AuthLayout>
    );
  }

  // No consent details means nothing trustworthy to approve: a failed
  // consent-info load (expired handle, rate limit, transient error) renders
  // the error alone, never the approve/deny controls.
  if (error && !info) {
    return (
      <AuthLayout icon={ShieldCheck} title="Authorize access">
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      </AuthLayout>
    );
  }

  const tools = Array.isArray(info.tools) ? info.tools : [];

  return (
    <AuthLayout
      icon={ShieldCheck}
      title="Authorize access"
      subtitle={`${client} wants to access ${appName} on your behalf`}
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <p className="text-sm font-medium text-foreground mb-2">
        {tools.length ? `It will be able to use these tools in ${appName}:` : "No tools requested"}
      </p>
      {tools.length > 0 && (
        <ul className="space-y-2 text-sm mb-6">
          {tools.map((tool) => (
            <li key={tool.name} className="flex flex-col">
              <span className="text-foreground font-medium">
                {tool.title || tool.name}
              </span>
              {tool.description && (
                <span className="text-muted-foreground">{tool.description}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 h-12 font-medium"
          disabled={submitting}
          onClick={() => respond("deny")}
        >
          Deny
        </Button>
        <Button
          className="flex-1 h-12 font-medium"
          disabled={submitting}
          onClick={() => respond("approve")}
        >
          {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Approve
        </Button>
      </div>
    </AuthLayout>
  );
}

```

## File: src/pages/Profile.jsx

```text
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Settings as SettingsIcon, MessageCircle, Camera } from 'lucide-react';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import Avatar from '@/components/Avatar';
import StoryViewer from '@/components/stories/StoryViewer';
import {
  ensureProfile,
  generateRoomId,
  setLocalParticipant,
} from '@/lib/chat-utils';

export default function Profile() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [target, setTarget] = useState(null);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [stories, setStories] = useState([]);
  const [viewStory, setViewStory] = useState(false);
  const [loading, setLoading] = useState(true);

  const isOwn = !profileId;

  useEffect(() => {
    ensureProfile().then(setMe);
  }, []);

  useEffect(() => {
    if (!me) return;
    const id = profileId || me.profile_id;
    let cancelled = false;
    (async () => {
      try {
        const matches = await db.entities.Profile.filter({ profile_id: id });
        if (cancelled) return;
        const t = matches[0] || (isOwn ? me : null);
        setTarget(t);
        if (!t) {
          setLoading(false);
          return;
        }
        const [fols, folg] = await Promise.all([
          db.entities.Follow.filter({ followee_id: id }),
          db.entities.Follow.filter({ follower_id: id }),
        ]);
        if (cancelled) return;
        setFollowers(fols.length);
        setFollowing(folg.length);
        if (!isOwn) {
          setIsFollowing(!!fols.find((f) => f.follower_id === me.profile_id));
        }
        const cutoff = new Date(Date.now() - 24 * 3600 * 1000);
        const st = await db.entities.Story.filter({ profile_id: id });
        if (cancelled) return;
        setStories(st.filter((s) => new Date(s.created_date) > cutoff).sort((a, b) => new Date(a.created_date) - new Date(b.created_date)));
      } catch {
        // ignore
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [me, profileId]);

  const toggleFollow = async () => {
    if (!me || !target) return;
    if (isFollowing) {
      try {
        await db.entities.Follow.deleteMany({ follower_id: me.profile_id, followee_id: target.profile_id });
        setIsFollowing(false);
        setFollowers((f) => Math.max(0, f - 1));
      } catch {
        toast.error('Failed');
      }
    } else {
      try {
        await db.entities.Follow.create({ follower_id: me.profile_id, followee_id: target.profile_id });
        setIsFollowing(true);
        setFollowers((f) => f + 1);
        await db.entities.Notification.create({
          recipient_id: target.profile_id,
          actor_id: me.profile_id,
          actor_name: me.username,
          actor_avatar_color: me.avatar_color,
          actor_avatar_url: me.avatar_url || '',
          type: 'follow',
          text: 'started following you.',
        }).catch(() => {});
      } catch {
        toast.error('Failed');
      }
    }
  };

  const message = async () => {
    if (!me || !target) return;
    try {
      const myParts = await db.entities.RoomParticipant.filter({ participant_id: me.profile_id });
      for (const mp of myParts) {
        const parts = await db.entities.RoomParticipant.filter({ room_id: mp.room_id });
        if (parts.length === 2 && parts.find((p) => p.participant_id === target.profile_id)) {
          setLocalParticipant(mp.room_id, {
            id: me.profile_id, name: me.display_name, color: me.avatar_color,
            avatar_url: me.avatar_url, username: me.username,
          });
          navigate(`/chat/${mp.room_id}`);
          return;
        }
      }
      const roomId = generateRoomId();
      await db.entities.ChatRoom.create({
        room_id: roomId, owner_id: me.profile_id, room_name: '', max_participants: 2,
        allow_file_sharing: true, allow_new_joins: true, typing_preview_visible: true,
        message_notifications: true, status: 'active', last_message_preview: '', last_message_at: '',
      });
      await db.entities.RoomParticipant.create({
        room_id: roomId, participant_id: me.profile_id, name: me.display_name,
        avatar_color: me.avatar_color, avatar_url: me.avatar_url || '',
        online: true, typing: false, typing_text: '', is_owner: true,
      });
      await db.entities.RoomParticipant.create({
        room_id: roomId, participant_id: target.profile_id, name: target.display_name,
        avatar_color: target.avatar_color, avatar_url: target.avatar_url || '',
        online: false, typing: false, typing_text: '', is_owner: false,
      });
      await db.entities.Notification.create({
        recipient_id: target.profile_id, actor_id: me.profile_id, actor_name: me.username,
        actor_avatar_color: me.avatar_color, actor_avatar_url: me.avatar_url || '',
        type: 'message', text: 'started a conversation with you.', target_id: roomId,
      }).catch(() => {});
      setLocalParticipant(roomId, {
        id: me.profile_id, name: me.display_name, color: me.avatar_color,
        avatar_url: me.avatar_url, username: me.username,
      });
      navigate(`/chat/${roomId}`);
    } catch {
      toast.error('Failed to start chat');
    }
  };

  if (loading || !target) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundOrbs />
        <div className="w-8 h-8 border-4 border-foreground/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const hasStories = stories.length > 0;
  const storyGroup = hasStories
    ? {
        profile_id: target.profile_id,
        username: target.username,
        display_name: target.display_name,
        avatar_color: target.avatar_color,
        avatar_url: target.avatar_url,
        stories,
      }
    : null;

  return (
    <div className="min-h-screen relative">
      <BackgroundOrbs />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-heading font-bold truncate">@{target.username}</h1>
          <button onClick={() => navigate('/settings')} className="p-2 rounded-xl hover:bg-card/40 transition-colors">
            <SettingsIcon size={20} />
          </button>
        </div>

        <div className="flex items-center gap-5 mb-5">
          <button
            onClick={() => hasStories && setViewStory(true)}
            disabled={!hasStories}
            className="shrink-0"
          >
            <div
              className={hasStories ? 'p-0.5 rounded-full' : ''}
              style={hasStories ? { background: 'linear-gradient(135deg,#f093fb,#f5576c,#ffd700)' } : {}}
            >
              <div className={hasStories ? 'bg-background rounded-full p-0.5' : ''}>
                <Avatar name={target.display_name} color={target.avatar_color} avatarUrl={target.avatar_url} size={84} />
              </div>
            </div>
          </button>
          <div className="flex-1 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-heading font-bold">{stories.length || 0}</p>
              <p className="text-xs text-muted-foreground font-body">stories</p>
            </div>
            <div>
              <p className="text-lg font-heading font-bold">{followers}</p>
              <p className="text-xs text-muted-foreground font-body">followers</p>
            </div>
            <div>
              <p className="text-lg font-heading font-bold">{following}</p>
              <p className="text-xs text-muted-foreground font-body">following</p>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-base font-body font-medium">{target.display_name}</p>
          {target.bio && (
            <p className="text-sm text-muted-foreground font-body mt-1 whitespace-pre-wrap">{target.bio}</p>
          )}
        </div>

        <div className="flex gap-2 mb-8">
          {isOwn ? (
            <button
              onClick={() => navigate('/profile/edit')}
              className="flex-1 py-2.5 sketch-border rounded-xl text-sm font-body font-medium hover:bg-card/40 transition-colors flex items-center justify-center gap-1.5"
            >
              <Camera size={15} /> Edit profile
            </button>
          ) : (
            <>
              <button
                onClick={toggleFollow}
                className={`flex-1 py-2.5 rounded-xl text-sm font-heading font-bold transition-colors ${
                  isFollowing ? 'sketch-border bg-card/40 hover:bg-card/60' : 'sketch-fill'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button
                onClick={message}
                className="flex-1 py-2.5 sketch-border rounded-xl text-sm font-body font-medium hover:bg-card/40 transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageCircle size={16} /> Message
              </button>
            </>
          )}
        </div>

        <div className="border-t-2 border-dashed border-foreground/20 pt-4 text-center">
          <p className="text-sm text-muted-foreground font-body">No posts — this is a messaging-first profile.</p>
        </div>
      </div>

      {viewStory && storyGroup && (
        <StoryViewer group={storyGroup} onClose={() => setViewStory(false)} />
      )}
    </div>
  );
}
```

## File: src/pages/ProfileEdit.jsx

```text
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, Check, Camera, AtSign, Loader2, User } from 'lucide-react';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import Avatar from '@/components/Avatar';

import {
  ensureProfile,
  updateProfile,
  sanitizeUsername,
  generateAvatarColor,
} from '@/lib/chat-utils';
import { LANGUAGES } from '@/lib/languages';

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #30cfd0, #330867)',
  'linear-gradient(135deg, #a8edea, #fed6e3)',
  'linear-gradient(135deg, #ff9a9e, #fecfef)',
  'linear-gradient(135deg, #fcb045, #fd1d1d, #833ab4)',
  'linear-gradient(135deg, #5ee7df, #b490ca)',
  'linear-gradient(135deg, #89f7fe, #66a6ff)',
  'linear-gradient(135deg, #c471f5, #fa71cd)',
];

export default function ProfileEdit() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarColor, setAvatarColor] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [useImage, setUseImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [checking, setChecking] = useState(false);
  const [lang, setLang] = useState('');
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    ensureProfile().then((p) => {
      setProfile(p);
      setUsername(p.username || '');
      setDisplayName(p.display_name || '');
      setBio(p.bio || '');
      setAvatarColor(p.avatar_color || generateAvatarColor());
      setAvatarUrl(p.avatar_url || '');
      setUseImage(!!p.avatar_url);
      setLang(p.language || '');
      setAuto(!!p.auto_translate);
    });
  }, []);

  useEffect(() => {
    const clean = sanitizeUsername(username);
    if (!profile || clean === profile.username) {
      setUsernameTaken(false);
      return;
    }
    setChecking(true);
    const t = setTimeout(async () => {
      try {
        const matches = await db.entities.Profile.filter({ username: clean });
        setUsernameTaken(matches.some((m) => m.profile_id !== profile.profile_id));
      } catch {
        setUsernameTaken(false);
      }
      setChecking(false);
    }, 500);
    return () => clearTimeout(t);
  }, [username, profile]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image too large (max 5MB)');
      return;
    }
    setUploading(true);
    try {
      const res = await db.integrations.Core.UploadFile({ file });
      setAvatarUrl(res.file_url);
      setUseImage(true);
    } catch {
      toast.error('Upload failed');
    }
    setUploading(false);
  };

  const handleSave = async () => {
    const clean = sanitizeUsername(username);
    if (clean.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }
    if (usernameTaken) {
      toast.error('That username is taken');
      return;
    }
    setSaving(true);
    try {
      const updated = await updateProfile({
        username: clean,
        display_name: displayName.trim() || profile.display_name,
        bio: bio.trim(),
        avatar_color: avatarColor,
        avatar_url: useImage ? avatarUrl : '',
        language: lang,
        auto_translate: auto,
      });
      setProfile(updated);
      toast.success('Profile saved');
      navigate('/profile');
    } catch {
      toast.error('Failed to save profile');
    }
    setSaving(false);
  };

  if (!profile) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <BackgroundOrbs />
        <div className="w-10 h-10 border-4 border-foreground/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const cleanUsername = sanitizeUsername(username);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8 relative">
      <BackgroundOrbs />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card p-6 md:p-8 w-full max-w-md"
      >
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/profile')} className="p-2 rounded-xl hover:bg-card/40 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-heading font-bold">Edit Profile</h1>
        </div>

        <p className="text-xs text-muted-foreground font-body mb-6">
          Your anonymous identity — no signup. It stays on this device and follows you everywhere.
        </p>

        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <Avatar
              name={displayName || profile.display_name}
              color={avatarColor}
              avatarUrl={useImage ? avatarUrl : undefined}
              size={96}
            />
            <label className="absolute bottom-0 right-0 p-2 rounded-full sketch-fill cursor-pointer shadow-lg">
              <Camera size={16} />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
            {uploading && (
              <div className="absolute inset-0 rounded-full bg-background/60 flex items-center justify-center">
                <Loader2 size={20} className="animate-spin" />
              </div>
            )}
          </div>
          {useImage && avatarUrl && (
            <button
              onClick={() => {
                setUseImage(false);
                setAvatarUrl('');
              }}
              className="mt-2 text-xs text-muted-foreground hover:text-destructive font-body"
            >
              Remove photo
            </button>
          )}
        </div>

        {!useImage && (
          <div className="mb-5">
            <label className="text-xs text-muted-foreground mb-2 block font-body">Avatar color</label>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_GRADIENTS.map((g) => (
                <button
                  key={g}
                  onClick={() => setAvatarColor(g)}
                  className={`h-9 rounded-full transition-transform ${
                    avatarColor === g
                      ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ background: g }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="text-xs text-muted-foreground mb-1.5 block font-body flex items-center gap-1">
            <AtSign size={12} /> Username
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="bluefox_42"
              maxLength={20}
              className="w-full pl-7 pr-3 py-2.5 glass-input text-sm font-body lowercase"
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className={`text-[11px] font-body ${usernameTaken ? 'text-destructive' : 'text-muted-foreground'}`}>
              {checking ? 'checking…' : usernameTaken ? 'taken — try another' : cleanUsername.length >= 3 ? 'available' : '3–20 chars, letters / numbers / _'}
            </p>
            {!checking && !usernameTaken && cleanUsername.length >= 3 && (
              <Check size={12} className="text-green-500" />
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs text-muted-foreground mb-1.5 block font-body flex items-center gap-1">
            <User size={12} /> Display name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Blue Fox"
            maxLength={30}
            className="w-full px-3 py-2.5 glass-input text-sm font-body"
          />
        </div>

        <div className="mb-6">
          <label className="text-xs text-muted-foreground mb-1.5 block font-body">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell people a little about you…"
            maxLength={150}
            rows={3}
            className="w-full px-3 py-2.5 glass-input text-sm font-body resize-none"
          />
          <p className="text-[11px] text-muted-foreground font-body text-right mt-0.5">{bio.length}/150</p>
        </div>

        <div className="mb-4">
          <label className="text-xs text-muted-foreground mb-1.5 block font-body">My language</label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="w-full px-3 py-2.5 glass-input text-sm font-body bg-card/30"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-body font-medium">Auto-translate messages</p>
            <p className="text-xs text-muted-foreground">Show others' messages in your language</p>
          </div>
          <button
            type="button"
            onClick={() => setAuto(!auto)}
            className={`relative w-11 h-6 rounded-full border-2 transition-colors shrink-0 ${
              auto ? 'bg-primary border-primary' : 'border-foreground'
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform ${
                auto ? 'translate-x-6 bg-primary-foreground' : 'translate-x-0.5 bg-foreground'
              }`}
            />
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || checking || usernameTaken || cleanUsername.length < 3}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 sketch-fill font-heading font-bold disabled:opacity-40"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
          Save Profile
        </button>
      </motion.div>
    </div>
  );
}
```

## File: src/pages/Register.jsx

```text
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { toast } from "@/components/ui/use-toast";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await db.auth.register({ email, password });
      setShowOtp(true);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await db.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        db.auth.setToken(result.access_token);
      }
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await db.auth.resendOtp(email);
      toast({
        title: "Code sent",
        description: "Check your email for the new code.",
      });
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  };

  const handleGoogle = () => {
    db.auth.loginWithProvider("google", "/");
  };

  if (showOtp) {
    return (
      <AuthLayout
        icon={Mail}
        title="Verify your email"
        subtitle={`We sent a code to ${email}`}
      >
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}
        <div className="flex justify-center mb-6">
          <InputOTP
            maxLength={6}
            value={otpCode}
            onChange={setOtpCode}
            autoFocus
            autoComplete="one-time-code"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button
          className="w-full h-12 font-medium"
          onClick={handleVerify}
          disabled={loading || otpCode.length < 6}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Didn't receive the code?{" "}
          <button onClick={handleResend} className="text-primary font-medium hover:underline">
            Resend
          </button>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={UserPlus}
      title="Create your account"
      subtitle="Sign up to get started"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <Button
        variant="outline"
        className="w-full h-12 text-sm font-medium mb-6"
        onClick={handleGoogle}
      >
        <GoogleIcon className="w-5 h-5 mr-2" />
        Continue with Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">or</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}

```

## File: src/pages/ResetPassword.jsx

```text
import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, AlertTriangle } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await db.auth.resetPassword({ resetToken, newPassword });
      window.location.href = "/login";
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <AuthLayout
        icon={AlertTriangle}
        title="Invalid reset link"
        subtitle="This password reset link is missing or invalid"
        footer={
          <Link to="/forgot-password" className="text-primary font-medium hover:underline">
            Request a new link
          </Link>
        }
      >
        <p className="text-sm text-foreground text-center">
          The link you used appears to be incomplete. Please request a new password reset email.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={Lock}
      title="New password"
      subtitle="Enter your new password below"
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              autoFocus
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset password"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}

```

## File: src/pages/Search.jsx

```text
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import Avatar from '@/components/Avatar';
import { getLocalProfile, sanitizeUsername } from '@/lib/chat-utils';

export default function Search() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const me = getLocalProfile();

  useEffect(() => {
    const clean = sanitizeUsername(q);
    if (clean.length < 1) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const all = await db.entities.Profile.list('-created_date', 100);
        const filtered = all
          .filter((p) => p.username && p.username.includes(clean) && p.profile_id !== me?.profile_id)
          .slice(0, 20);
        setResults(filtered);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="min-h-screen relative">
      <BackgroundOrbs />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-heading font-bold mb-4">Search</h1>
        <div className="flex items-center gap-2 px-3 py-2.5 sketch-border rounded-xl bg-card/40 mb-4">
          <SearchIcon size={18} className="text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value.toLowerCase())}
            placeholder="Search usernames"
            className="flex-1 bg-transparent outline-none text-sm font-body lowercase"
            autoFocus
          />
          {q && (
            <button onClick={() => setQ('')}>
              <X size={16} className="text-muted-foreground" />
            </button>
          )}
        </div>
        {loading && <p className="text-center text-sm text-muted-foreground py-6">Searching…</p>}
        {!loading && q && results.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-6">No users found</p>
        )}
        <div className="space-y-1">
          {results.map((p) => (
            <button
              key={p.profile_id}
              onClick={() => navigate(`/profile/${p.profile_id}`)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-card/40 transition-colors text-left"
            >
              <Avatar name={p.display_name} color={p.avatar_color} avatarUrl={p.avatar_url} size={44} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body font-medium truncate">@{p.username}</p>
                <p className="text-xs text-muted-foreground truncate">{p.display_name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## File: src/pages/Settings.jsx

```text
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, User, Palette, Link2, Trash2, Info, LogOut, Languages, Key } from 'lucide-react';
import BackgroundOrbs from '@/components/BackgroundOrbs';

import { ensureProfile, clearAllLocal, updateProfile } from '@/lib/chat-utils';
import { LANGUAGES } from '@/lib/languages';
import { getOpenRouterKey, setOpenRouterKey } from '@/lib/openrouter';

export default function Settings() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(document.documentElement.classList.contains('dark'));
  const [profile, setProfile] = useState(null);
  const [lang, setLang] = useState('');
  const [auto, setAuto] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [keySaved, setKeySaved] = useState(false);

  useEffect(() => {
    ensureProfile().then((p) => {
      setProfile(p);
      setLang(p?.language || '');
      setAuto(!!p?.auto_translate);
    }).catch(() => {});
    setApiKey(getOpenRouterKey());
  }, []);

  const saveKey = () => {
    setOpenRouterKey(apiKey);
    toast.success(apiKey.trim() ? 'OpenRouter API key saved' : 'OpenRouter API key removed');
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 1500);
  };

  const handleLangChange = async (e) => {
    const v = e.target.value;
    setLang(v);
    try {
      await updateProfile({ language: v });
      toast.success(v ? `Language set to ${LANGUAGES.find((l) => l.code === v)?.label || v}` : 'Translation language turned off');
    } catch {
      toast.error('Failed to save language');
    }
  };

  const toggleAuto = async () => {
    const v = !auto;
    setAuto(v);
    try {
      await updateProfile({ auto_translate: v });
      toast.success(v ? 'Auto-translate enabled' : 'Auto-translate disabled');
    } catch {
      toast.error('Failed to update setting');
    }
  };

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('whisper_theme', next ? 'dark' : 'light');
    } catch {
      // ignore
    }
  };

  const clearData = () => {
    if (confirm('Reset your local identity and saved rooms? This cannot be undone.')) {
      clearAllLocal();
      window.location.href = '/';
    }
  };

  const logout = () => {
    db.auth.logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen relative">
      <BackgroundOrbs />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/')} className="p-2 rounded-xl hover:bg-card/40 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-heading font-bold">Settings</h1>
        </div>

        <div className="glass-card overflow-hidden">
          <Row
            icon={<User size={18} />}
            label="Account"
            desc={profile ? `@${profile.username}` : ''}
            onClick={() => navigate('/profile')}
          />
          <Row
            icon={<Palette size={18} />}
            label="Dark mode"
            desc="Toggle appearance"
            right={
              <button
                onClick={toggleDark}
                className={`relative w-11 h-6 rounded-full border-2 transition-colors shrink-0 ${
                  dark ? 'bg-primary border-primary' : 'border-foreground'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform ${
                    dark ? 'translate-x-6 bg-primary-foreground' : 'translate-x-0.5 bg-foreground'
                  }`}
                />
              </button>
            }
          />
        </div>

        <div className="glass-card overflow-hidden mt-4 p-4 space-y-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl sketch-border text-foreground">
              <Languages size={18} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body font-medium">Translation</p>
              <p className="text-xs text-muted-foreground">Read incoming messages in your language</p>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-body mb-1.5 block">My language</label>
            <select
              value={lang}
              onChange={handleLangChange}
              className="w-full px-3 py-2.5 glass-input text-sm font-body bg-card/30"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-body font-medium">Auto-translate messages</p>
              <p className="text-xs text-muted-foreground">Show others' messages in your chosen language</p>
            </div>
            <button
              onClick={toggleAuto}
              className={`relative w-11 h-6 rounded-full border-2 transition-colors shrink-0 ${
                auto ? 'bg-primary border-primary' : 'border-foreground'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform ${
                  auto ? 'translate-x-6 bg-primary-foreground' : 'translate-x-0.5 bg-foreground'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="glass-card overflow-hidden mt-4 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl sketch-border text-foreground">
              <Key size={18} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body font-medium">OpenRouter API key</p>
              <p className="text-xs text-muted-foreground">Powers message translation (stored on this device)</p>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-or-v1-..."
              className="flex-1 px-3 py-2.5 glass-input text-sm font-body bg-card/30"
            />
            <button
              onClick={saveKey}
              className="px-4 py-2.5 sketch-fill text-sm font-heading font-bold shrink-0"
            >
              {keySaved ? 'Saved' : 'Save'}
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Get a key at openrouter.ai — it stays in your browser and is sent only to OpenRouter.
          </p>
        </div>

        <div className="glass-card overflow-hidden mt-4">
          <Row
            icon={<Link2 size={18} />}
            label="Join room by link"
            desc="Open a room with a link or ID"
            onClick={() => navigate('/')}
          />
          <Row
            icon={<Trash2 size={18} />}
            label="Clear local data"
            desc="Reset your profile & saved rooms"
            onClick={clearData}
            danger
          />
        </div>

        <div className="glass-card overflow-hidden mt-4">
          <Row icon={<Info size={18} />} label="About Whisper" desc="Real-time messaging" />
        </div>

        <div className="glass-card overflow-hidden mt-4">
          <Row icon={<LogOut size={18} />} label="Log out" desc="Sign out of your account" onClick={logout} danger />
        </div>

        <p className="text-center text-xs text-muted-foreground font-body mt-6">
          Whisper • Real-time messaging
        </p>
      </div>
    </div>
  );
}

function Row({ icon, label, desc, onClick, right, danger }) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className="w-full flex items-center gap-3 p-4 hover:bg-card/40 transition-colors text-left border-b border-foreground/10 last:border-0 disabled:cursor-default"
    >
      <span className={`p-2 rounded-xl sketch-border ${danger ? 'text-destructive' : 'text-foreground'}`}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-body font-medium ${danger ? 'text-destructive' : ''}`}>{label}</p>
        {desc && <p className="text-xs text-muted-foreground truncate">{desc}</p>}
      </div>
      {right}
    </button>
  );
}
```

