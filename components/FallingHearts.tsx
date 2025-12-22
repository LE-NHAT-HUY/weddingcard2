import React from "react";

export default function FingerprintHeart() {
  return (
    <>
      <div className="fingerprint-heart-container" aria-hidden="true">
        <div className="fingerprint-heart">
          <div className="heart-pulse"></div>
          <div className="heart-shake"></div>
        </div>
      </div>

      <style jsx>{`
        .fingerprint-heart-container {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: none;
          z-index: 9999;
          background: transparent;
        }

        .fingerprint-heart {
          position: relative;
          width: 200px;
          height: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* Tạo hình trái tim từ hai dấu vân tay bằng CSS */
        .heart-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: url('/traitim.jpg');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          animation: pulse 2.5s ease-in-out infinite;
        }

        .heart-shake {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: url('/traitim.jpg');
          background-repeat: no-repeat;
          background-position: center;
          animation: shake 0.5s ease-in-out infinite;
          opacity: 0.8;
          mix-blend-mode: multiply;
        }

        /* Animation co lại và lớn lên */
        @keyframes pulse {
          0% {
            transform: scale(1);
            filter: brightness(1);
          }
          25% {
            transform: scale(0.85);
            filter: brightness(0.9);
          }
          50% {
            transform: scale(1.15);
            filter: brightness(1.1);
          }
          75% {
            transform: scale(0.95);
            filter: brightness(1);
          }
          100% {
            transform: scale(1);
            filter: brightness(1);
          }
        }

        /* Animation rung nhẹ */
        @keyframes shake {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(0deg);
          }
          25% {
            transform: translateX(-2px) translateY(1px) rotate(-0.5deg);
          }
          50% {
            transform: translateX(1px) translateY(-1px) rotate(0.5deg);
          }
          75% {
            transform: translateX(-1px) translateY(2px) rotate(-0.3deg);
          }
        }

        /* Hiệu ứng đổ bóng 3D nhẹ */
        .fingerprint-heart::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 70%);
          border-radius: 50%;
          z-index: -1;
          opacity: 0.7;
        }

        /* Responsive cho màn hình nhỏ */
        @media (max-width: 768px) {
          .fingerprint-heart {
            width: 150px;
            height: 150px;
          }
        }

        @media (max-width: 480px) {
          .fingerprint-heart {
            width: 120px;
            height: 120px;
          }
        }
      `}</style>
    </>
  );
}