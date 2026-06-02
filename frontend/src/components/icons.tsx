interface IconProps {
  className?: string;
}

export function FlameIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      width="16"
      height="16"
    >
      <path d="M12 2C12 2 6 9 6 14c0 3.3 2.7 6 6 6s6-2.7 6-6c0-5-6-12-6-12z" />
    </svg>
  );
}

interface MoodIconProps {
  level: number;
  className?: string;
}

export function MoodIcon({ level, className }: MoodIconProps) {
  const props = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    width: "16",
    height: "16",
  };

  switch (level) {
    case 1:
      return (
        <svg {...props}>
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      );
    case 2:
      return (
        <svg {...props}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      );
    case 3:
      return (
        <svg {...props} strokeLinejoin={undefined}>
          <path d="M5 12h14" />
        </svg>
      );
    case 4:
      return (
        <svg {...props}>
          <path d="M5 13l4 4L19 7" />
        </svg>
      );
    case 5:
      return (
        <svg {...props}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    default:
      return null;
  }
}
