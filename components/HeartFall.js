"use client"; // bắt buộc khi dùng App Router

import { useEffect } from "react";
import "./heart-fall.css";

export default function HeartFall() {
  useEffect(() => {
    function createHeart() {
      const heart = document.createElement("div");
      heart.innerHTML = "❤️";
      heart.classList.add("heart");

      // Kích thước ngẫu nhiên 4-12px
     const size = Math.random() * 6 + 4; // 4 → 10
heart.style.fontSize = size + "px";


      // Vị trí ngang ngẫu nhiên
      heart.style.left = Math.random() * 100 + "vw";

      // Thời gian rơi 10-15s
      const duration = Math.random() * 5 + 10;
      heart.style.animationDuration = duration + "s";

      document.body.appendChild(heart);

      // Xóa sau khi rơi
      setTimeout(() => heart.remove(), duration * 1000);
    }

    const interval = setInterval(createHeart, 500); // mỗi 0.5s tạo 1 trái tim

    return () => clearInterval(interval); // dọn dẹp khi component unmount
  }, []);

  return null; // component không render gì trực tiếp
}
