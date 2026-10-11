type IconProps = { className?: string };

export const PlayIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8 5.14v13.72c0 .8.87 1.3 1.56.9l11.1-6.86a1.05 1.05 0 0 0 0-1.8L9.56 4.24A1.05 1.05 0 0 0 8 5.14Z" />
  </svg>
);

export const PauseIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M7 4.5c0-.55.45-1 1-1h2c.55 0 1 .45 1 1v15c0 .55-.45 1-1 1H8c-.55 0-1-.45-1-1v-15Zm6 0c0-.55.45-1 1-1h2c.55 0 1 .45 1 1v15c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1v-15Z" />
  </svg>
);

export const NextIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M6 5.6v12.8c0 .77.84 1.25 1.5.86l10-6.4a1 1 0 0 0 0-1.72l-10-6.4A1 1 0 0 0 6 5.6ZM18 5a1 1 0 0 1 2 0v14a1 1 0 1 1-2 0V5Z" />
  </svg>
);

export const PrevIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18 5.6v12.8c0 .77-.84 1.25-1.5.86l-10-6.4a1 1 0 0 1 0-1.72l10-6.4A1 1 0 0 1 18 5.6ZM4 5a1 1 0 0 1 2 0v14a1 1 0 1 1-2 0V5Z" />
  </svg>
);

export const ShuffleIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
  </svg>
);

export const RepeatIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m17 2 4 4-4 4" />
    <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
    <path d="m7 22-4-4 4-4" />
    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
  </svg>
);

export const HeartIcon = ({
  className = "w-5 h-5",
  filled = false,
}: IconProps & { filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

export const DownloadIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
  </svg>
);

export const CheckCircleIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.78 7.7-5.5 6a.9.9 0 0 1-1.32.02l-2.72-2.86a.9.9 0 1 1 1.3-1.24l2.06 2.16 4.85-5.3a.9.9 0 0 1 1.33 1.22Z" />
  </svg>
);

export const PlusIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const HomeIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.3 2.6a1 1 0 0 1 1.4 0l8.5 8.1c.63.6.2 1.67-.67 1.67H19v7.63c0 .55-.45 1-1 1h-3.5a.5.5 0 0 1-.5-.5V16a2 2 0 1 0-4 0v4.5a.5.5 0 0 1-.5.5H6c-.55 0-1-.45-1-1v-7.63H3.47c-.87 0-1.3-1.06-.67-1.67l8.5-8.1Z" />
  </svg>
);

export const SearchIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const LibraryIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
    <path d="M4 3v18M9 3v18M14 4.5l5.5 15.5" />
  </svg>
);

export const MusicIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20 3.23a1 1 0 0 0-1.2-.98l-9 1.8A1 1 0 0 0 9 5.03v9.52A3.5 3.5 0 1 0 11 17.7V8.85l7-1.4v5.1a3.5 3.5 0 1 0 2 3.17V3.22Z" />
  </svg>
);

export const VolumeIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 5 6 9H2v6h4l5 4V5ZM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
  </svg>
);

export const TrashIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6M10 11v6M14 11v6" />
  </svg>
);

export const PhoneIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
    <rect x="6" y="2" width="12" height="20" rx="2.5" />
    <path d="M11 18.5h2" />
  </svg>
);
