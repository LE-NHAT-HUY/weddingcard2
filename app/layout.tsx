

import type React from "react";
import type { Metadata, Viewport } from "next";
import { Playfair_Display, Great_Vibes, Quicksand, Sacramento } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Cấu hình font Google
const playfair = Playfair_Display({ subsets: ["latin", "vietnamese"], variable: "--font-playfair" });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-great-vibes" });
const quicksand = Quicksand({ subsets: ["latin", "vietnamese"], variable: "--font-quicksand" });
const sacramento = Sacramento({ weight: "400", subsets: ["latin"], variable: "--font-sacramento" });

// Base URL
const SITE_BASE = "https://khanhnam-lannhi.vercel.app";

// Hàm build query string an toàn
function buildQueryString(searchParams?: Record<string, string | string[] | undefined>) {
  if (!searchParams) return "";
  const entries: [string, string][] = [];
  for (const key of Object.keys(searchParams)) {
    const v = searchParams[key];
    if (v === undefined) continue;
    if (Array.isArray(v)) {
      for (const item of v) entries.push([key, String(item)]);
    } else {
      entries.push([key, String(v)]);
    }
  }
  return entries.length ? "?" + new URLSearchParams(entries).toString() : "";
}

// Metadata động, xử lý query string an toàn
export async function generateMetadata({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }): Promise<Metadata> {
  const qs = buildQueryString(searchParams);
  const fullUrl = `${SITE_BASE}/${qs}`.replace(/\/\?/, "?"); // tránh "/?..."
  const image = `${SITE_BASE}/anh6.jpg`;

  return {
    title: "Thiệp Cưới Khánh Nam và Lan Nhi",
    description: "Mời bạn tham dự lễ cưới của chúng tôi.",
    openGraph: {
      title: "Thiệp Cưới Khánh Nam và Lan Nhi",
      description: "Mời bạn tham dự lễ cưới của chúng tôi.",
      url: fullUrl,
      siteName: "Wedding Card",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "Wedding couple",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Thiệp Cưới Khánh Nam và Lan Nhi",
      description: "Mời bạn tham dự lễ cưới của chúng tôi.",
      images: [image],
    },
  };
}

// Viewport chuẩn
export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 1 };

// Root layout
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className="overflow-x-hidden max-w-[100vw] w-full">
      <body
        className={`${playfair.variable} ${greatVibes.variable} ${quicksand.variable} ${sacramento.variable} font-sans antialiased overflow-x-hidden max-w-[100vw] w-full relative`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
