// app/invite/[code]/page.tsx
import WeddingCardView from "@/components/wedding-card-view"
import { createClient } from "@/lib/supabase/client"
import type { Metadata } from "next"

type Props = {
  params: Promise<{ code: string }>  // Next.js 15: params là Promise
}

// === Title + OpenGraph động có tên khách mời ===
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params
  const supabase = createClient()

  let guestName = "Quý khách"

  const { data } = await supabase
    .from("guests")
    .select("name")
    .eq("code", code.toLowerCase().trim())  // linh hoạt: lowercase + trim
    .single()

  if (data?.name) {
    guestName = data.name.trim()
  }

  const title = guestName === "Quý khách"
    ? "Thân mời Quý khách | Tham dự đám cưới của Nam & Nhi❤️"
    : `Thân mời ${guestName} | Tham dự đám cưới của Nam & Nhi❤️`

  const description = "Mời bạn tham dự lễ cưới của chúng tôi"

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://wedding-khanhnam-lannhi.vercel.app/invite/${code}`,
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

// === Trang mời cá nhân ===
export default async function InvitePage({ params }: Props) {
  const { code } = await params
  const supabase = createClient()

  let initialGuestName = "quý khách"

  const { data } = await supabase
    .from("guests")
    .select("name")
    .eq("code", code.toLowerCase().trim())
    .single()

  if (data?.name) {
    initialGuestName = data.name.trim()
  }

  // Truyền đầy đủ: tên + code (nếu cần backup client-side)
  return (
    <WeddingCardView
      guestCode={code}
      initialGuestName={initialGuestName}
    />
  )
}