import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowLeft,
  User,
  Palette,
  Link2,
  Trash2,
  Info,
  LogOut,
  Languages,
  Sparkles,
  Bot,
  Zap,
  Brain,
  Cpu,
  Check,
  Eye,
  EyeOff,
  Send,
  Loader2,
  Globe,
  Timer,
} from 'lucide-react';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import AccountLinking from '@/components/AccountLinking';
import { db } from '@/api/base44Client';
import { ensureProfile, clearAllLocal, updateProfile } from '@/lib/chat-utils';
import { LANGUAGES } from '@/lib/languages';
import {
  AI_PROVIDERS,
  OPENROUTER_MODELS,
  GEMINI_MODELS,
  DEEPSEEK_MODELS,
  OPENAI_MODELS,
  getActiveProvider,
  setActiveProvider,
  getProviderApiKey,
  setProviderApiKey,
  getProviderModel,
  setProviderModel,
  translateText,
} from '@/lib/openrouter';

const PROVIDER_ICONS = {
  whisper_slm: Sparkles,
  builtin: Globe,
  openrouter: Cpu,
  gemini: Zap,
  deepseek: Brain,
  openai: Bot,
};

const SAMPLE_PHRASES = [
  'How are you doing today?',
  'wyd right now?',
  'On my way, see you soon!',
  'Aap kaise ho bhai?',
  'Xin chào bạn nhé!',
  'Muchísimas gracias por tu ayuda.',
];

export default function Settings() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(document.documentElement.classList.contains('dark'));
  const [profile, setProfile] = useState(null);
  const [lang, setLang] = useState('en');
  const [auto, setAuto] = useState(true);

  // AI Provider & Translation State
  const [provider, setProvider] = useState(getActiveProvider());
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  // Test translation state
  const [testInput, setTestInput] = useState('How are you doing today? Welcome to Whisper!');
  const [testResult, setTestResult] = useState(null);
  const [testLoading, setTestLoading] = useState(false);

  useEffect(() => {
    ensureProfile()
      .then((p) => {
        setProfile(p);
        setLang(p?.language || 'en');
        setAuto(p?.auto_translate !== false);
      })
      .catch(() => {});

    const active = getActiveProvider();
    setProvider(active);
    setApiKey(getProviderApiKey(active));
    const currentModel = getProviderModel(active);
    setModel(currentModel);
    if (active === 'openrouter' && !OPENROUTER_MODELS.some((m) => m.id === currentModel) && currentModel) {
      setModel('custom');
      setCustomModel(currentModel);
    }
  }, []);

  const handleProviderSelect = (pId) => {
    setProvider(pId);
    setActiveProvider(pId);
    setApiKey(getProviderApiKey(pId));
    const m = getProviderModel(pId);
    setModel(m);
    setTestResult(null);
    toast.success(`Switched to ${AI_PROVIDERS.find((p) => p.id === pId)?.name}`);
  };

  const handleSaveApiKey = () => {
    setProviderApiKey(provider, apiKey);
    if (model === 'custom' && customModel.trim()) {
      setProviderModel(provider, customModel.trim());
    } else if (model && model !== 'custom') {
      setProviderModel(provider, model);
    }
    setKeySaved(true);
    toast.success(`${AI_PROVIDERS.find((p) => p.id === provider)?.name} settings saved!`);
    setTimeout(() => setKeySaved(false), 2000);
  };

  const handleModelChange = (e) => {
    const val = e.target.value;
    setModel(val);
    if (val !== 'custom') {
      setProviderModel(provider, val);
    }
  };

  const handleTestTranslation = async (overrideText = null) => {
    const textToTest = (overrideText || testInput).trim();
    if (!textToTest) return;
    setTestLoading(true);
    setTestResult(null);
    try {
      const target = lang || 'es';
      const res = await translateText(textToTest, target, provider, true);
      setTestResult(res);
      toast.success(`Translated in ${res.latencyMs || 10}ms!`);
    } catch {
      toast.error('Translation failed. Please check network or API settings.');
    } finally {
      setTestLoading(false);
    }
  };

  const handleLangChange = async (e) => {
    const v = e.target.value;
    setLang(v);
    try {
      await updateProfile({ language: v, auto_translate: true });
      setAuto(true);
      toast.success(`Incoming messages will be translated to ${LANGUAGES.find((l) => l.code === v)?.label || v}`);
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
    if (confirm('Reset your local identity and cached translations? This cannot be undone.')) {
      clearAllLocal();
      window.location.href = '/';
    }
  };

  const logout = () => {
    try {
      if (db?.auth?.logout) db.auth.logout();
    } catch {
      // ignore
    }
    clearAllLocal();
    window.location.href = '/';
  };

  const getProviderKeyLink = () => {
    switch (provider) {
      case 'openrouter':
        return { label: 'Get Key at openrouter.ai', url: 'https://openrouter.ai/keys' };
      case 'gemini':
        return { label: 'Get Free Key at Google AI Studio', url: 'https://aistudio.google.com/app/apikey' };
      case 'deepseek':
        return { label: 'Get Key at platform.deepseek.com', url: 'https://platform.deepseek.com/api_keys' };
      case 'openai':
        return { label: 'Get Key at platform.openai.com', url: 'https://platform.openai.com/api-keys' };
      default:
        return null;
    }
  };

  const link = getProviderKeyLink();

  return (
    <div className="page-shell relative">
      <BackgroundOrbs />
      <div className="page-container max-w-6xl">
        <div className="mb-7 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="rounded-xl border border-foreground/10 p-2.5 hover:bg-card/60"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-heading font-bold">Settings</h1>
        </div>

        {/* Account & Appearance */}
        <div className="glass-card overflow-hidden rounded-2xl">
          <Row
            icon={<User size={18} />}
            label="Account"
            desc={profile ? `@${profile.username} • ${profile.display_name || ''}` : 'Manage profile'}
            onClick={() => navigate('/profile')}
          />
          <Row
            icon={<Palette size={18} />}
            label="Dark mode"
            desc="Toggle sketchbook paper or inky night"
            right={
              <button
                onClick={toggleDark}
                className={`relative w-12 h-6 rounded-full border-2 transition-colors shrink-0 ${
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

        {/* Language & Auto-Translate */}
        <div className="glass-card mt-4 space-y-4 overflow-hidden rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl sketch-border text-foreground bg-primary/10">
              <Languages size={18} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-heading font-bold text-foreground">Language & Auto-Translate</p>
              <p className="text-xs text-muted-foreground font-body">Every received message follows your preferred language</p>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground font-body mb-1.5 block">Preferred language for received messages</label>
            <select
              value={lang}
              onChange={handleLangChange}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm font-body bg-card/40 sketch-border"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.label} · {l.native}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="pr-4">
              <p className="text-sm font-heading font-bold text-foreground">Auto-translate incoming messages</p>
              <p className="text-xs text-muted-foreground font-body">
                Real-time zero-delay translation as messages arrive in chat
              </p>
            </div>
            <button
              onClick={toggleAuto}
              className={`relative w-12 h-6 rounded-full border-2 transition-colors shrink-0 ${
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

        <div className="my-5">
          <AccountLinking />
        </div>

        {/* AI Engine & Model Hub */}
        <div className="glass-card mt-4 space-y-4 overflow-hidden rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl sketch-border text-primary bg-primary/10">
                <Sparkles size={18} />
              </span>
              <div>
                <p className="text-sm font-heading font-bold text-foreground">Whisper SLM Engine & Model Hub</p>
                <p className="text-xs text-muted-foreground font-body">High-speed Small Language Model translation pipeline</p>
              </div>
            </div>
          </div>

          {/* Provider Selection Grid */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {AI_PROVIDERS.map((p) => {
              const Icon = PROVIDER_ICONS[p.id] || Sparkles;
              const isSelected = provider === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleProviderSelect(p.id)}
                  className={`p-3 rounded-xl text-left transition-all sketch-border relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-primary/15 border-primary shadow-sm ring-1 ring-primary/40'
                      : 'bg-card/30 hover:bg-card/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Icon size={16} className={isSelected ? 'text-primary' : 'text-muted-foreground'} />
                    {isSelected && <Check size={14} className="text-primary" />}
                  </div>
                  <p className="text-xs font-heading font-bold text-foreground truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground font-body truncate mt-0.5">{p.badge}</p>
                </button>
              );
            })}
          </div>

          {/* Provider Config Details */}
          {provider === 'whisper_slm' && (
            <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-heading font-bold text-primary">
                <Sparkles size={14} />
                <span>Whisper Ultra-Fast SLM Pipeline (Active)</span>
              </div>
              <p className="text-xs text-muted-foreground font-body leading-relaxed">
                Combines a <strong>0ms local conversational lexicon</strong> (for instant greetings, chat slang & common phrases) with a high-throughput <strong>Server Gemini Flash SLM model</strong> and resilient failover. Zero API key setup required!
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-card/60 sketch-border text-foreground">
                  ⚡ Tier 0: L1/L2 Memory Cache (0ms)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-card/60 sketch-border text-foreground">
                  ⚡ Tier 1: Local Lexicon Matcher (0ms)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-card/60 sketch-border text-foreground">
                  ⚡ Tier 2: Gemini 3.7 Flash SLM (~120ms)
                </span>
              </div>
            </div>
          )}

          {provider === 'builtin' && (
            <div className="p-3.5 rounded-xl bg-card/40 sketch-border space-y-2">
              <div className="flex items-center gap-2 text-xs font-heading font-bold text-foreground">
                <Globe size={14} className="text-primary" />
                <span>Free Web Fallback Engine</span>
              </div>
              <p className="text-xs text-muted-foreground font-body leading-relaxed">
                Uses public dictionary and free web translation endpoints without any API key required.
              </p>
            </div>
          )}

          {provider !== 'whisper_slm' && provider !== 'builtin' && (
            <div className="space-y-3 pt-1">
              {/* API Key Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-muted-foreground font-body">
                    {AI_PROVIDERS.find((p) => p.id === provider)?.name} API Key
                  </label>
                  {link && (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-primary hover:underline font-heading font-bold"
                    >
                      {link.label} →
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder={
                        provider === 'openrouter'
                          ? 'sk-or-v1-...'
                          : provider === 'gemini'
                          ? 'AIzaSy...'
                          : provider === 'deepseek'
                          ? 'sk-...'
                          : 'sk-proj-...'
                      }
                      className="w-full pl-3 pr-10 py-2.5 rounded-xl glass-input text-xs font-mono bg-card/40 sketch-border"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                    >
                      {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <button
                    onClick={handleSaveApiKey}
                    className="px-4 py-2.5 sketch-fill text-xs font-heading font-bold shrink-0 rounded-xl"
                  >
                    {keySaved ? 'Saved!' : 'Save Key'}
                  </button>
                </div>
              </div>

              {/* Model Selector */}
              <div>
                <label className="text-xs text-muted-foreground font-body mb-1 block">
                  Select Model
                </label>
                <select
                  value={model}
                  onChange={handleModelChange}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-body bg-card/40 sketch-border"
                >
                  {provider === 'openrouter' &&
                    OPENROUTER_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} {m.isFree ? '✨ (Free Model)' : ''}
                      </option>
                    ))}
                  {provider === 'gemini' &&
                    GEMINI_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  {provider === 'deepseek' &&
                    DEEPSEEK_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  {provider === 'openai' &&
                    OPENAI_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Custom Model Input for OpenRouter */}
              {provider === 'openrouter' && model === 'custom' && (
                <div>
                  <label className="text-xs text-muted-foreground font-body mb-1 block">
                    Custom OpenRouter Model Identifier
                  </label>
                  <input
                    type="text"
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    placeholder="e.g. google/gemini-2.0-flash-exp:free"
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono bg-card/40 sketch-border"
                  />
                </div>
              )}
            </div>
          )}

          {/* Test & Latency Benchmark Studio */}
          <div className="space-y-2.5 border-t border-foreground/10 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-foreground flex items-center gap-1.5">
                <Timer size={14} className="text-primary" />
                <span>SLM Speed & Accuracy Benchmark</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">Target: {lang || 'Spanish (es)'}</span>
            </div>

            {/* Quick Sample Phrase Chips */}
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_PHRASES.map((phrase, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTestInput(phrase);
                    handleTestTranslation(phrase);
                  }}
                  className="text-[11px] font-hand px-2 py-0.5 rounded-lg bg-card/30 hover:bg-card/70 sketch-border text-muted-foreground hover:text-foreground transition-colors"
                >
                  "{phrase}"
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Type a sample sentence or slang (e.g. wyd, how are you)..."
                className="flex-1 px-3 py-2 rounded-xl glass-input text-xs font-body bg-card/40 sketch-border"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTestTranslation();
                }}
              />
              <button
                onClick={() => handleTestTranslation()}
                disabled={testLoading}
                className="px-4 py-2 rounded-xl sketch-fill text-xs font-heading font-bold flex items-center gap-1.5 shrink-0 disabled:opacity-50"
              >
                {testLoading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                <span>Benchmark</span>
              </button>
            </div>

            {testResult && (
              <div className="p-3 rounded-xl bg-card/50 sketch-border space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-primary font-bold">Translated Output:</span>
                  <span className="text-emerald-500 font-bold flex items-center gap-1">
                    ⚡ {testResult.latencyMs}ms ({testResult.tier || 'instant-slm'})
                  </span>
                </div>
                <p className="text-xs font-body text-foreground whitespace-pre-wrap bg-background/50 p-2 rounded-lg sketch-border">
                  {testResult.translatedText}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* General Actions */}
        <div className="glass-card overflow-hidden mt-4 rounded-2xl sketch-border">
          <Row
            icon={<Link2 size={18} />}
            label="Join room by link or ID"
            desc="Open a conversation with a direct invite code"
            onClick={() => navigate('/messages')}
          />
          <Row
            icon={<Trash2 size={18} />}
            label="Clear local cache & data"
            desc="Reset cached translation memory & local identity"
            onClick={clearData}
            danger
          />
        </div>

        <div className="glass-card overflow-hidden mt-4 rounded-2xl sketch-border">
          <Row
            icon={<Info size={18} />}
            label="About Whisper"
            desc="Hand-drawn sketchbook messenger with ultra-fast SLM translation"
          />
        </div>

        <div className="glass-card overflow-hidden mt-4 rounded-2xl sketch-border">
          <Row
            icon={<LogOut size={18} />}
            label="Log out"
            desc="Sign out of your account"
            onClick={logout}
            danger
          />
        </div>

        <p className="text-center text-xs text-muted-foreground font-body mt-6">
          Whisper Sketchbook • Powered by Whisper SLM & Multi-AI Translation Pipeline
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
      className="w-full flex items-center gap-3.5 p-4 hover:bg-card/40 transition-colors text-left border-b border-foreground/10 last:border-0 disabled:cursor-default"
    >
      <span
        className={`p-2.5 rounded-xl sketch-border shrink-0 ${
          danger ? 'text-destructive bg-destructive/10' : 'text-foreground bg-card/40'
        }`}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-heading font-bold ${danger ? 'text-destructive' : 'text-foreground'}`}>
          {label}
        </p>
        {desc && <p className="text-xs text-muted-foreground truncate font-body mt-0.5">{desc}</p>}
      </div>
      {right}
    </button>
  );
}
