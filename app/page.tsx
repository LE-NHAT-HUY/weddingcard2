"use client";

import { useMemo } from "react";

export default function ShareButton() {
  const baseUrl = "https://weddingcard-beta.vercel.app/";

  // Tạo link "dummy" với timestamp
  const messengerUrl = useMemo(() => {
    return `${baseUrl}?ts=${Date.now()}`;
  }, []);

  return (
    <a
      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(messengerUrl)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-pink-600 text-white px-6 py-3 rounded-lg"
    >
      Chia sẻ trên Messenger
    </a>
  );
}
