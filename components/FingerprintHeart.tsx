"use client";

import React from "react";

type Props = {
  size?: number | string;
  colorFilter?: string;
  duration?: number;
  className?: string;
  ariaLabel?: string;
};

export default function FingerprintHeart({
  size = 160,
  colorFilter = "none", // Removed default filter to prevent golden color
  duration = 1.3,
  className = "",
  ariaLabel = "Trái tim dấu vân tay",
}: Props) {
  const s = typeof size === "number" ? `${size}px` : size;
  const dur = `${duration}s`;

  return (
    <div
      className={`fp-heart-root ${className}`}
      role="img"
      aria-label={ariaLabel}
      style={{ width: s, height: s }}
    >
      <svg
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMid slice"
        className="fp-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Single heart-shaped clip path for full fingerprint */}
          <clipPath id="fp-heart-clip" clipPathUnits="userSpaceOnUse">
            <path d="M100,30 C130,0 200,20 200,70 C200,110 140,140 100,170 C60,140 0,110 0,70 C0,20 70,0 100,30 Z" />
          </clipPath>

          {/* Remove soft filter if not needed, or adjust as needed */}
          <filter id="fp-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.4" result="blur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="1" />
            </feComponentTransfer>
          </filter>
        </defs>

        {/* Single image covering the entire heart shape */}
        <g clipPath="url(#fp-heart-clip)">
          <image
            href="/traitim.png"
            x="0"
            y="0"
            width="200"
            height="200"
            preserveAspectRatio="xMidYMid slice"
            style={{ filter: colorFilter }}
            aria-hidden="true"
          />
        </g>

        {/* Optional thin seam / highlight between lobes */}
        <path
          d="M98 126 C100 130 102 132 102 132"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>

   <style jsx>{`
  .fp-heart-root {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    pointer-events: none;
  }

  .fp-svg {
  width: 100%;
  height: 100%;
  display: block;
  overflow: visible;
  transform-origin: 50% 50%;
  animation: fp-heartbeat ${dur} ease-in-out infinite;
}


  /* ❤️ HEART BEAT: phóng → rung → thu → nghỉ */
 @keyframes fp-heartbeat {
  0%, 100% { transform: scale(1) rotate(0deg); }
  14% { transform: scale(0.88) rotate(0deg); }   /* thu nhẹ */
  28% { transform: scale(1.18) rotate(0deg); }   /* phóng mạnh */
  42% { transform: scale(1.12) rotate(-4deg); }  /* rung trái */
  56% { transform: scale(1.12) rotate(4deg); }   /* rung phải */
  70% { transform: scale(1.06) rotate(-2deg); }  /* rung hồi */
  84% { transform: scale(1) rotate(0deg); }      /* thu về */
}


  @media (max-width: 420px) {
    .fp-svg {
      animation-duration: ${dur};
    }
  }
`}</style>

    </div>
  );
}