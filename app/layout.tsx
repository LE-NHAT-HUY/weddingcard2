import HeartFall from '../components/HeartFall';
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
  description: "Mời bạn tham dự lễ cưới của chúng tôi.",
  openGraph: {
    title: "Thiệp Cưới Khánh Nam & Lan Nhi",
    description: "Mời bạn tham dự lễ cưới của chúng tôi.",
    url: "https://lannhi-khanhnam.vercel.app/",
    siteName: "Wedding Card",
    images: [
      {
        url: "https://lannhi-khanhnam.vercel.app/anh9_2.jpg",
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
    description: "Mời bạn tham dự lễ cưới của chúng tôi.",
    images: ["https://lannhi-khanhnam.vercel.app/anh9_2.jpg"],
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
      <head>
        {/* Facebook App ID */}
        <meta property="fb:app_id" content="1389624622571348" />

        {/* Open Graph meta */}
        <meta property="og:url" content="https://lannhi-khanhnam.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Thiệp Cưới Khánh Nam & Lan Nhi" />
        <meta property="og:description" content="Mời bạn tham dự lễ cưới của chúng tôi." />
        <meta property="og:image" content="https://lannhi-khanhnam.vercel.app/anh9_2.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Thiệp Cưới Khánh Nam & Lan Nhi" />
        <meta property="og:locale" content="vi_VN" />
        <meta property="og:updated_time" content={new Date().toISOString()} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Thiệp Cưới Khánh Nam & Lan Nhi" />
        <meta name="twitter:description" content="Mời bạn tham dự lễ cưới của chúng tôi." />
        <meta name="twitter:image" content="https://lannhi-khanhnam.vercel.app/anh9_2.jpg" />

        {/* ✍️ Handwritten fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Parisienne&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=RetroSignature&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/css2?family=La+Belle+Aurore&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400&display=swap" rel="stylesheet"/>
      </head>
      <body
        className={`${playfair.variable} ${greatVibes.variable} ${quicksand.variable} ${sacramento.variable} font-sans antialiased overflow-x-hidden max-w-[100vw] w-full relative`}
      >
        {children}

        {/* HeartFall animation hiển thị trên tất cả trang */}
        <HeartFall />

        <Analytics />
      </body>
    </html>
  )
}
