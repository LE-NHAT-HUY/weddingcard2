import type React from "react"
import type { Metadata, Viewport } from "next"
import { Playfair_Display, Great_Vibes, Quicksand, Sacramento } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
})

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
})

const quicksand = Quicksand({
  subsets: ["latin", "vietnamese"],
  variable: "--font-quicksand",
})

const sacramento = Sacramento({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sacramento",
})

export const metadata: Metadata = {
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


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className="overflow-x-hidden max-w-[100vw] w-full">
  <body
    className={`${playfair.variable} ${greatVibes.variable} ${quicksand.variable} ${sacramento.variable} font-sans antialiased overflow-x-hidden max-w-[100vw] w-full relative`}
  >
    {children}
    <Analytics />
  </body>
</html>

  )
}
