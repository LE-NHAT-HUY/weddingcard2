// app/page.tsx
import { Suspense } from 'react'
import WeddingCardView from '@/components/wedding-card-view'
import { createClient } from '@/lib/supabase/client' // hoặc server client
import type { Metadata } from 'next'

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

// === THÊM generateMetadata ===
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const supabase = createClient()
  const code = searchParams.code as string | undefined

  let guestName = "Quý khách"

  if (code) {
    const { data } = await supabase
      .from("guests")
      .select("name")
      .eq("code", code)
      .single()

    if (data?.name) {
      guestName = data.name.trim()
    }
  }

  // Title theo yêu cầu
  const title = guestName === "Quý khách"
    ? "Thân mời Quý khách | Tham dự đám cưới của Nam & Nhi"
    : `Thân mời ${guestName} | Tham dự đám cưới của Nam & Nhi`

  // Description cố định
  const description = "Mời bạn tham dự lễ cưới của chúng tôi"

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://wedding-khanhnam-lannhi.vercel.app",
      siteName: "Tham dự đám cưới của Nam & Nhi",
      images: [
        {
          url: "https://wedding-khanhnam-lannhi.vercel.app/result_DSC07102.jpg",
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
      images: ["https://wedding-khanhnam-lannhi.vercel.app/result_DSC07102.jpg"],
    },
  }
}

// === Sửa Home để fetch và truyền initialGuestName ===
export default async function Home({ searchParams }: Props) {
  const supabase = createClient()
  const code = searchParams.code as string | undefined

  let initialGuestName = "quý khách"

  if (code) {
    const { data } = await supabase
      .from("guests")
      .select("name")
      .eq("code", code)
      .single()

    if (data?.name) {
      initialGuestName = data.name.trim()
    }
  }

  return (
    <Suspense fallback={<div></div>}>
      {/* Truyền thêm prop */}
      <WeddingCardView initialGuestName={initialGuestName} />
    </Suspense>
  )
}