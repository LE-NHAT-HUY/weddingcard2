"use client";
export default function HeartImage() {
  return (
    <div className="heart">
      <style jsx>{`
        .heart {
          width: 60px;
          height: 60px;
          background-image: url("https://w.ladicdn.com/s400x400/649340684a3700001217851c/trai-tim-5-20250505093723-oa2dy.png");
          background-size: cover;
          background-position: center;
          transform-origin: bottom center; /* tâm đáy */
          animation: heartbeat 2s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1) rotate(0deg); }
          14% { transform: scale(0.9) rotate(0deg); }
          28% { transform: scale(1.3) rotate(0deg); }
          32% { transform: scale(1.3) rotate(-4deg); }
          36% { transform: scale(1.3) rotate(5deg); }
          40% { transform: scale(1.3) rotate(-5deg); }
          44% { transform: scale(1.3) rotate(4deg); }
          48% { transform: scale(1.3) rotate(-3deg); }
          60% { transform: scale(1.15) rotate(0deg); }
          84% { transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}

