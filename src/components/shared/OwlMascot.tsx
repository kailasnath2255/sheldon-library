type Props = {
  size?: number;
  className?: string;
};

export default function OwlMascot({ size = 120, className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      aria-label="Sheldon the Owl mascot"
      role="img"
    >
      <defs>
        <linearGradient id="owl-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9B8FF" />
          <stop offset="100%" stopColor="#6C5CE7" />
        </linearGradient>
        <linearGradient id="owl-belly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF6E0" />
          <stop offset="100%" stopColor="#F4B400" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      {/* Body */}
      <ellipse cx="100" cy="115" rx="70" ry="75" fill="url(#owl-body)" />
      {/* Belly */}
      <ellipse cx="100" cy="130" rx="42" ry="50" fill="url(#owl-belly)" />
      {/* Wings */}
      <path d="M40 110 Q30 150 60 165 Z" fill="#5847d6" />
      <path d="M160 110 Q170 150 140 165 Z" fill="#5847d6" />
      {/* Glasses */}
      <circle cx="78" cy="92" r="22" fill="#FFFFFF" stroke="#1B2A4E" strokeWidth="3" />
      <circle cx="122" cy="92" r="22" fill="#FFFFFF" stroke="#1B2A4E" strokeWidth="3" />
      <line x1="100" y1="92" x2="100" y2="92" stroke="#1B2A4E" strokeWidth="3" />
      <path d="M100 92 L100 92" stroke="#1B2A4E" strokeWidth="3" fill="none" />
      <line x1="96" y1="92" x2="104" y2="92" stroke="#1B2A4E" strokeWidth="3" />
      {/* Eyes */}
      <circle
        cx="78"
        cy="92"
        r="7"
        fill="#1B2A4E"
        className="origin-center animate-owl-blink"
        style={{ transformOrigin: "78px 92px" }}
      />
      <circle
        cx="122"
        cy="92"
        r="7"
        fill="#1B2A4E"
        className="origin-center animate-owl-blink"
        style={{ transformOrigin: "122px 92px" }}
      />
      {/* Beak */}
      <path d="M100 105 L92 118 L108 118 Z" fill="#F4B400" stroke="#1B2A4E" strokeWidth="2" />
      {/* Ear tufts */}
      <path d="M55 50 L70 75 L50 70 Z" fill="#5847d6" />
      <path d="M145 50 L130 75 L150 70 Z" fill="#5847d6" />
      {/* Feet */}
      <path d="M82 188 L82 196 M86 188 L86 196 M90 188 L90 196" stroke="#F4B400" strokeWidth="3" />
      <path d="M110 188 L110 196 M114 188 L114 196 M118 188 L118 196" stroke="#F4B400" strokeWidth="3" />
    </svg>
  );
}
