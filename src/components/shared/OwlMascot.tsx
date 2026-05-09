type Props = {
  size?: number;
  className?: string;
};

export default function OwlMascot({ size = 120, className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 220 230"
      width={size}
      height={size}
      className={className}
      aria-label="Sheldon the Owl mascot"
      role="img"
    >
      <defs>
        <linearGradient id="owl-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFA14B" />
          <stop offset="100%" stopColor="#E85A12" />
        </linearGradient>
        <linearGradient id="owl-belly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF1E6" />
          <stop offset="100%" stopColor="#FFE0C7" />
        </linearGradient>
        <linearGradient id="cap-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1F2B3E" />
          <stop offset="100%" stopColor="#0F1115" />
        </linearGradient>
        <linearGradient id="wand-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#FFD43B" />
        </linearGradient>
        <radialGradient id="sparkle-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#FACC15" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Magic sparkles around */}
      <g style={{ animation: "owl-sparkle 3s ease-in-out infinite" }}>
        <circle cx="20" cy="50" r="3" fill="#FACC15" />
        <circle cx="200" cy="120" r="4" fill="#FF7C6B" />
        <circle cx="30" cy="180" r="3" fill="#7C3AED" />
        <text x="195" y="60" fontSize="14" fill="#FACC15">✦</text>
        <text x="15" y="120" fontSize="12" fill="#7C3AED">✧</text>
      </g>

      {/* Body group with float animation */}
      <g style={{ animation: "owl-float 4s ease-in-out infinite", transformOrigin: "110px 130px" }}>
        {/* Body */}
        <ellipse cx="110" cy="135" rx="68" ry="72" fill="url(#owl-body)" stroke="#0F1115" strokeWidth="3" />
        {/* Belly */}
        <ellipse cx="110" cy="148" rx="42" ry="50" fill="url(#owl-belly)" />
        {/* Wing left (animated) */}
        <path
          d="M50 130 Q35 165 65 180 Z"
          fill="#C24808"
          stroke="#0F1115"
          strokeWidth="2.5"
          style={{ animation: "owl-wing-left 2s ease-in-out infinite", transformOrigin: "55px 135px" }}
        />
        {/* Wing right */}
        <path
          d="M170 130 Q185 165 155 180 Z"
          fill="#C24808"
          stroke="#0F1115"
          strokeWidth="2.5"
          style={{ animation: "owl-wing-right 2s ease-in-out infinite", transformOrigin: "165px 135px" }}
        />
        {/* Glasses */}
        <circle cx="88" cy="112" r="22" fill="#FFFFFF" stroke="#0F1115" strokeWidth="3" />
        <circle cx="132" cy="112" r="22" fill="#FFFFFF" stroke="#0F1115" strokeWidth="3" />
        <line x1="106" y1="112" x2="114" y2="112" stroke="#0F1115" strokeWidth="3" />
        {/* Eyes — blink */}
        <ellipse
          cx="88"
          cy="112"
          rx="7"
          ry="8"
          fill="#0F1115"
          style={{ animation: "owl-blink 4s ease-in-out infinite", transformOrigin: "88px 112px" }}
        />
        <ellipse
          cx="132"
          cy="112"
          rx="7"
          ry="8"
          fill="#0F1115"
          style={{ animation: "owl-blink 4s ease-in-out infinite", transformOrigin: "132px 112px" }}
        />
        {/* Eye highlights */}
        <circle cx="91" cy="109" r="2" fill="#FFFFFF" />
        <circle cx="135" cy="109" r="2" fill="#FFFFFF" />
        {/* Beak */}
        <path d="M110 128 L100 142 L120 142 Z" fill="#FACC15" stroke="#0F1115" strokeWidth="2" />
        {/* Ear tufts */}
        <path d="M62 70 L78 95 L55 92 Z" fill="#C24808" stroke="#0F1115" strokeWidth="2" />
        <path d="M158 70 L142 95 L165 92 Z" fill="#C24808" stroke="#0F1115" strokeWidth="2" />
        {/* Feet */}
        <path d="M92 205 L92 213 M96 205 L96 213 M100 205 L100 213" stroke="#FACC15" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M120 205 L120 213 M124 205 L124 213 M128 205 L128 213" stroke="#FACC15" strokeWidth="3.5" strokeLinecap="round" />

        {/* GRADUATION CAP */}
        <g style={{ animation: "owl-cap-tilt 5s ease-in-out infinite", transformOrigin: "110px 60px" }}>
          <ellipse cx="110" cy="62" rx="30" ry="6" fill="url(#cap-grad)" />
          <polygon points="65,55 155,55 145,40 75,40" fill="url(#cap-grad)" stroke="#0F1115" strokeWidth="2" />
          <circle cx="110" cy="47" r="3" fill="#FACC15" stroke="#0F1115" strokeWidth="1.5" />
          <path d="M110 47 Q140 50 145 70" stroke="#FACC15" strokeWidth="2" fill="none" />
          <circle cx="146" cy="73" r="4" fill="#FACC15" stroke="#0F1115" strokeWidth="1.5" />
          <path d="M143 75 L143 80 M146 76 L146 81 M149 75 L149 80" stroke="#FACC15" strokeWidth="1.5" />
        </g>
      </g>

      {/* MAGIC WAND */}
      <g style={{ animation: "owl-wand-wave 3s ease-in-out infinite", transformOrigin: "180px 175px" }}>
        <line x1="172" y1="180" x2="205" y2="135" stroke="url(#wand-grad)" strokeWidth="4" strokeLinecap="round" />
        <g style={{ animation: "owl-star-glow 1.5s ease-in-out infinite" }}>
          <circle cx="207" cy="133" r="10" fill="url(#sparkle-grad)" opacity="0.6" />
          <text x="207" y="139" fontSize="16" fill="#FACC15" textAnchor="middle" stroke="#0F1115" strokeWidth="0.5">★</text>
        </g>
      </g>

      <style>{`
        @keyframes owl-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes owl-blink { 0%, 92%, 100% { transform: scaleY(1); } 96% { transform: scaleY(0.1); } }
        @keyframes owl-wing-left { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-8deg); } }
        @keyframes owl-wing-right { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(8deg); } }
        @keyframes owl-cap-tilt { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
        @keyframes owl-wand-wave { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(15deg); } }
        @keyframes owl-star-glow { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.2); } }
        @keyframes owl-sparkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
      `}</style>
    </svg>
  );
}
