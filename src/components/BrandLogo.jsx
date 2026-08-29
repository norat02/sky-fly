export default function BrandLogo({ compact = false, className = '' }) {
  return (
    <img
      src="/brand/whisper-logo.png"
      alt="Whisper"
      className={`${compact ? 'h-9 w-auto max-w-[9rem]' : 'h-12 w-auto max-w-[12rem]'} object-contain object-left ${className}`}
    />
  );
}
