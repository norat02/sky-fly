// Whisper SLM & AI Multi-Provider Translation Bridge
export * from './slm/slmEngine';
export * from './slm/slmDictionary';
export * from './slm/slmTokenizer';

export const OPENROUTER_MODELS = [
  { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash (Free)', isFree: true },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B (Free)', isFree: true },
  { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1 (Free)', isFree: true },
  { id: 'deepseek/deepseek-chat:free', name: 'DeepSeek V3 (Free)', isFree: true },
  { id: 'qwen/qwen-2.5-72b-instruct:free', name: 'Qwen 2.5 72B (Free)', isFree: true },
  { id: 'mistralai/mistral-small-24b-instruct-2501:free', name: 'Mistral Small 24B (Free)', isFree: true },
  { id: 'google/gemini-2.0-flash-thinking-exp:free', name: 'Gemini 2.0 Flash Thinking (Free)', isFree: true },
  { id: 'microsoft/phi-3-mini-128k-instruct:free', name: 'Phi-3 Mini 128k (Free)', isFree: true },
  { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash (Standard)', isFree: false },
  { id: 'meta-llama/llama-3.2-3b-instruct', name: 'Llama 3.2 3B Ultra Fast', isFree: false },
  { id: 'custom', name: 'Custom Model...', isFree: false },
];

export const GEMINI_MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Recommended)' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
];

export const DEEPSEEK_MODELS = [
  { id: 'deepseek-chat', name: 'DeepSeek-V3 (Fast & Fluent)' },
  { id: 'deepseek-reasoner', name: 'DeepSeek-R1 (Deep Reasoning)' },
];

export const OPENAI_MODELS = [
  { id: 'gpt-4o-mini', name: 'GPT-4o mini (Fast & Efficient)' },
  { id: 'gpt-4o', name: 'GPT-4o (Flagship Model)' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
];

export function getOpenRouterKey() {
  return localStorage.getItem('openrouter_api_key') || import.meta.env.VITE_OPENROUTER_API_KEY || '';
}

export function setOpenRouterKey(value) {
  const k = (value || '').trim();
  if (k) localStorage.setItem('openrouter_api_key', k);
  else localStorage.removeItem('openrouter_api_key');
  return value;
}

export function hasOpenRouterKey() {
  return Boolean(getOpenRouterKey());
}
