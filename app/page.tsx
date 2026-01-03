// app/page.tsx
import WeddingCardView from "@/components/wedding-card-view"
import type { Metadata } from "next"

// === generateMetadata: luôn có ảnh, không cần code ===
export async function generateMetadata(): Promise<Metadata> {
  const title = "Thân mời Quý khách | Tham dự lễ cưới của Nam & Nhi ❤️"
  const description = "Mời bạn tham dự lễ cưới của chúng tôi"

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://weddingnamnhi.vercel.app",
      siteName: "Mời bạn tham dự lễ cưới của chúng tôi",
      images: [
        {
          url: "https://weddingnamnhi.vercel.app/anh12-cat.jpg",
          width: 1200,
          height: 630,
          alt: "Thiệp cưới Khánh Nam & Lan Nhi",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://weddingnamnhi.vercel.app/anh12-cat.jpg"],
    },
  }
}

// === Trang giới thiệu / trang share chung ===
export default function Home() {
  return <WeddingCardView initialGuestName="quý khách" />
}
