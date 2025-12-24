"use client";

import { useState } from "react";

export default function LoveCardTrigger() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const accountNumber = "1057584059";

  const handleCopy = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      console.error("Clipboard API not available");
      return;
    }
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <>
      {/* ICON TRÁI TIM */}
      <div
        className="heart-trigger"
        onClick={() => setOpen(true)}
        aria-label="Mở thiệp yêu thương"
      />

      {/* MODAL */}
      {open && (
        <>
          {/* overlay mờ */}
          <div className="overlay" onClick={() => setOpen(false)} />

          {/* card modal */}
          <div className="card">
            <h3>Hộp Quà Yêu Thương</h3>
            <p className="sub">
              Quét QR code để gửi yêu thương trực tiếp tới:
            </p>

            <div className="role">Cô dâu chú rể</div>

            <div className="qr-box">
              <img src="/qrcode1.JPG" alt="QR code" />
              <div className="info">
                <strong>Nguyễn Thị Lan Nhi</strong>
                <div>Vietcombank</div>
                <div>1057 584 059</div>

                {copied && <div className="copied">✅ Đã sao chép</div>}
              </div>
            </div>

            <button className="close" onClick={() => setOpen(false)}>
              Đóng
            </button>
          </div>
        </>
      )}

      {/* STYLE */}
      <style jsx>{`
        .heart-trigger {
          width: 150px;
          height: 150px;
          margin: 40px auto;
          cursor: pointer;
          background: url("https://assets.cinelove.me/resources/flowchartIcons/zyryqj33inoq811jkpand.png") center/cover;
          animation: heartbeat 2s ease-in-out infinite;
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(0.9); }
          28%, 36%, 44% { transform: scale(1.25); }
          36% { transform: rotate(-4deg); }
          44% { transform: rotate(5deg); }
          52% { transform: scale(1.15); }
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(4px);
          z-index: 999;
        }

        .card {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
          width: 320px;
          background: #fff;
          border-radius: 18px;
          padding: 20px;
          text-align: center;
          pointer-events: auto;
          animation: cardUp 0.45s cubic-bezier(.2,.8,.3,1);
        }

        @keyframes cardUp {
          from { transform: translate(-50%, -45%) scale(0.95); opacity: 0; }
          to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }

        h3 { margin: 0; font-size: 18px; font-weight: 600; }
        .sub { font-size: 13px; color: #666; margin: 6px 0 10px; }
        .role { font-size: 14px; margin-bottom: 10px; }

        .qr-box {
          display: flex;
          gap: 12px;
          align-items: center;
          border: 1px solid #eee;
          border-radius: 12px;
          padding: 10px;
        }
        .qr-box img {
          width: 80px;
          height: 80px;
          border-radius: 8px;
        }

        .info {
          text-align: left;
          font-size: 12px;
        }
        .info strong {
          display: block;
          font-size: 14px;
        }
        .info div {
          display: block;
        }
        .info button {
          margin-top: 6px;
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 999px;
          border: 1px solid #ff6b9b;
          background: #fff0f6;
          color: #ff3d81;
          cursor: pointer;
        }

        .copied {
          margin-top: 4px;
          font-size: 12px;
          color: #16a34a;
          font-weight: 500;
          animation: pop 0.3s ease;
        }
        @keyframes pop {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .close {
          margin-top: 14px;
          padding: 6px 18px;
          border-radius: 999px;
          border: 1px solid #ddd;
          background: #fff;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
