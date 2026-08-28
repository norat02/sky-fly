export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'hinglish', label: 'Hinglish', native: 'Hinglish (Hindi in Roman script)', flag: '🇮🇳' },
  { code: 'fr', label: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', label: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: 'Chinese (Simplified)', native: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', label: 'Chinese (Traditional)', native: '繁體中文', flag: '🇹🇼' },
  { code: 'ko', label: 'Korean', native: '한국어', flag: '🇰🇷' },
  { code: 'pt', label: 'Portuguese', native: 'Português', flag: '🇧🇷' },
  { code: 'ru', label: 'Russian', native: 'Русский', flag: '🇷🇺' },
  { code: 'ar', label: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'it', label: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  { code: 'tr', label: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
  { code: 'vi', label: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', label: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', flag: '🇧🇩' },
  { code: 'ur', label: 'Urdu', native: 'اردو', flag: '🇵🇰' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'nl', label: 'Dutch', native: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', label: 'Polish', native: 'Polski', flag: '🇵🇱' },
  { code: 'th', label: 'Thai', native: 'ไทย', flag: '🇹🇭' },
  { code: 'fa', label: 'Persian', native: 'فارسی', flag: '🇮🇷' },
  { code: 'sv', label: 'Swedish', native: 'Svenska', flag: '🇸🇪' },
  { code: 'uk', label: 'Ukrainian', native: 'Українська', flag: '🇺🇦' },
  { code: 'tl', label: 'Filipino', native: 'Filipino', flag: '🇵🇭' },
  { code: 'ms', label: 'Malay', native: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'he', label: 'Hebrew', native: 'עברית', flag: '🇮🇱' },
  { code: 'el', label: 'Greek', native: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'cs', label: 'Czech', native: 'Čeština', flag: '🇨🇿' },
  { code: 'ro', label: 'Romanian', native: 'Română', flag: '🇷🇴' },
  { code: 'hu', label: 'Hungarian', native: 'Magyar', flag: '🇭🇺' },
  { code: 'da', label: 'Danish', native: 'Dansk', flag: '🇩🇰' },
  { code: 'no', label: 'Norwegian', native: 'Norsk', flag: '🇳🇴' },
  { code: 'fi', label: 'Finnish', native: 'Suomi', flag: '🇫🇮' },
];

export function languageLabel(code) {
  if (!code) return 'English';
  const found = LANGUAGES.find((l) => l.code === code);
  return found ? `${found.flag} ${found.label}` : code;
}

export function getLanguageInfo(code) {
  if (!code) return LANGUAGES[0];
  return LANGUAGES.find((l) => l.code === code) || { code, label: code, native: code, flag: '🌐' };
}
