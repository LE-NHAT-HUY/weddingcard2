"use client";

import React, { useState } from "react";
import "./gift-envelope.css";

type Props = {
  titleVisible?: boolean;
  cardVisible?: boolean;
  qrSrc?: string;
  name?: string;
  bank?: string;
  account?: string;
};

export default function GiftEnvelope({
  titleVisible = true,
  cardVisible = true,
  qrSrc = "/donate.png",
  name = "LE KHANH NAM",
  bank = "MB BANK",
  account = "8888 8888 888",
}: Props) {
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleOpen = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Toggle state
    setOpen((v) => !v);

    // Timing must match CSS animation durations (800ms)
    window.setTimeout(() => setIsAnimating(false), 850);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleOpen();
    }
  };

  return (
    <div className="envelope-root">
      {/* Title */}
      <section
        id="gift-title"
        data-animate
        className={`w-full flex justify-center transition-all duration-700 ${
          titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="envelope-title-container">
          <p className="envelope-title" style={{ fontFamily: "'Great Vibes', cursive" }}>
            Gửi Quà Mừng Cưới
          </p>
          <p className="envelope-subtitle">{open ? "" : ""}</p>
        </div>
      </section>

      {/* Envelope area */}
      <section
        id="donate-card"
        data-animate
        className={`w-full flex justify-center mt-6 transition-all duration-700 ${
          cardVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="envelope-wrap">
          <div
            role="button"
            tabIndex={0}
            aria-pressed={open}
            aria-label={open ? "Đóng phong thư" : "Mở phong thư"}
            onClick={toggleOpen}
            onKeyDown={onKey}
            className={`envelope-container ${open ? "is-open" : "is-closed"} ${isAnimating ? "is-animating" : ""}`}
            style={{ pointerEvents: isAnimating ? "none" : "auto" }}
          >
            {/* Base */}
            
            <div className="envelope-base" aria-hidden="true" />

            {/* Letter (controlled class triggers animation) */}
            <div className={`letter ${open ? "letter-open" : "letter-closed"}`} aria-hidden={!open}>
              <div className="letter-content">
                <div className="qr-container">
                  <img
                    src={qrSrc}
                    alt="QR Code chuyển khoản"
                    className="qr-img"
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Crect width='140' height='140' fill='%23f5f5f5'/%3E%3Ctext x='70' y='75' font-family='Arial' font-size='14' text-anchor='middle' fill='%23999'%3EQR Code%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>

                <div className="account-info">
                  <div className="account-name">{name}</div>
                </div>
              </div>
            </div>

            {/* Flap and seal */}
            {/* Flap and wax-seal */}
<div className="envelope-flap" aria-hidden="true" />

{/* Wax-seal thay bằng hình ảnh */}
<div
  className="wax-seal"
  aria-hidden="true"
  style={{
    backgroundImage: 'url("https://assets.cinelove.me/assets/plugins/wax-seal.webp")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
  <div className="seal-heart" style={{ display: 'none' }} />
</div>

          </div>
        </div>
      </section>
    </div>
  );
}

