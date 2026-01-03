// app/invite/[code]/page.tsx
import WeddingCardView from "@/components/wedding-card-view"
import { createClient } from "@/lib/supabase/client"
import type { Metadata } from "next"

type Props = {
  params: Promise<{ code: string }>
}

// === generateMetadata: Xử lý title và description động ===
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params
  const supabase = createClient()

  let guestName = "Quý khách"
  let honorific = "Thân mời"
  let inviteNote = "Mời bạn" // Giá trị mặc định nếu không có note

  if (code) {
    const { data } = await supabase
      .from("guests")
      .select("name, honorific, note") // <--- Thêm cột note vào đây
      .eq("code", code.toLowerCase().trim())
      .single()

    if (data?.name) guestName = data.name.trim()
    if (data?.honorific) honorific = data.honorific.trim()
    if (data?.note) inviteNote = data.note.trim() // <--- Lấy giá trị note
  }

  const title =
    guestName === "Quý khách"
      ? `${honorific} Quý khách | Tham dự lễ cưới của Nam & Nhi ❤️`
      : `${honorific} ${guestName} | Tham dự lễ cưới của Nam & Nhi ❤️`

  // Thay thế "Mời bạn" bằng giá trị inviteNote lấy từ DB
  const description = `${inviteNote} tham dự lễ cưới của Nam & Nhi`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://weddingnamnhi.vercel.app",
      siteName: "Mời bạn tham dự lễ cưới của Nam & Nhi",
      images: [
        {
          url: "https://weddingnamnhi.vercel.app/anh6.jpg",
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
      images: ["https://weddingnamnhi.vercel.app/anh6.jpg"],
    },
  }
}

// === Trang mời cá nhân ===
export default async function InvitePage({ params }: Props) {
  const { code } = await params
  const supabase = createClient()

  let initialGuestName = "quý khách"

  if (code) {
    const { data } = await supabase
      .from("guests")
      .select("name")
      .eq("code", code.toLowerCase().trim())
      .single()

    if (data?.name) {
      initialGuestName = data.name.trim()
    }
  }

  return (
    <WeddingCardView
      guestCode={code}
      initialGuestName={initialGuestName}
    />
  )
}