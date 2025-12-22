"use client";

export default function CustomImage2() {
  return (
    <div className="heart">
      <style jsx>{`
        .heart {
          width: 71.17px;       /* Kích thước ảnh mới */
          height: 154.75px;
          position: absolute;
          top: -43.058px;
          left: 0px;
          background-image: url("https://w.ladicdn.com/s400x500/649340684a3700001217851c/rbg/dau-re-15-20250505092549-fmwbv.png");
          background-size: cover;
          background-position: center;
          transform-origin: bottom center; /* tâm đáy */
          animation: heartbeat 2s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1) rotate(0deg); }
          14% { transform: scale(0.9) rotate(0deg); }       /* thu nhẹ */
          28% { transform: scale(1) rotate(0deg); }       /* phóng lớn */
          
          /* Rung nhanh 5 lần trong 28% → 60% */
          32% { transform: scale(1.3) rotate(-4deg); } 
          36% { transform: scale(1.3) rotate(5deg); } 
          40% { transform: scale(1.3) rotate(-5deg); } 
          44% { transform: scale(1.3) rotate(4deg); } 
          48% { transform: scale(1.3) rotate(-3deg); } 
          
          60% { transform: scale(1.15) rotate(0deg); }      /* bắt đầu thu về */
          84% { transform: scale(1) rotate(0deg); }         /* thu về */
        }
      `}</style>
    </div>
  );
}
