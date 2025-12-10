// app/page.tsx
import type { ReactNode } from "react";

export const metadata = {
  title: "Thiệp Cưới Khánh Nam & Lan Nhi",
  description: "Mời bạn tham dự lễ cưới của chúng tôi vào ngày 20/12/2025.",
  openGraph: {
    title: "Thiệp Cưới Khánh Nam & Lan Nhi",
    description: "Mời bạn tham dự lễ cưới của chúng tôi vào ngày 20/12/2025.",
    url: "https://weddingcard-beta.vercel.app/",
    siteName: "Wedding Card",
    images: [
      {
        url: "https://weddingcard-beta.vercel.app/anh6.jpg",
        width: 1200,
        height: 630,
        alt: "Wedding couple",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thiệp Cưới Khánh Nam & Lan Nhi",
    description: "Mời bạn tham dự lễ cưới của chúng tôi vào ngày 20/12/2025.",
    images: ["https://weddingcard-beta.vercel.app/anh6.jpg"],
  },
};

export default function HomePage(): ReactNode {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-pink-50">
      <h1 className="text-4xl font-bold mb-4">
        Thiệp Cưới Khánh Nam & Lan Nhi
      </h1>
      <p className="text-lg mb-6">
        Chúng tôi hân hạnh mời bạn tham dự lễ cưới vào ngày 20/12/2025
      </p>
      <img
        src="/anh6.jpg"
        alt="Wedding couple"
        className="w-[90%] max-w-lg rounded-lg shadow-lg"
      />
    </main>
  );
}
