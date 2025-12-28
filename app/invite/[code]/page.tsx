// app/invite/[code]/page.tsx
import WeddingCardView from "@/components/wedding-card-view"
import { createClient } from "@/lib/supabase/client"
import type { Metadata } from "next"

type Props = {
  params: Promise<{ code: string }>
}

// === generateMetadata: luôn có ảnh, dù code đúng/sai/không tồn tại ===
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params
  const supabase = createClient()

  let guestName = "Quý khách"

  // Vẫn cố gắng lấy tên nếu code hợp lệ
  if (code) {
    const { data } = await supabase
      .from("guests")
      .select("name")
      .eq("code", code.toLowerCase().trim())
      .single()

    if (data?.name) {
      guestName = data.name.trim()
    }
  }

  const title = guestName === "Quý khách"
    ? "Thân mời Quý khách | Tham dự đám cưới của Nam & Nhi ❤️"
    : `Thân mời ${guestName} | Tham dự đám cưới của Nam & Nhi ❤️`

  const description = "Mời bạn tham dự đám cưới của chúng tôi"

  // ← QUAN TRỌNG: Luôn dùng ảnh cố định, không phụ thuộc code
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://weddingnamnhi.vercel.app",  // link chung hoặc để trống cũng được
      siteName: "Mời bạn tham dự đám cưới của chúng tôi",
      images: [
        {
          url: "https://weddingnamnhi.vercel.app/result_DSC07102.jpg",
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
      images: ["https://weddingnamnhi.vercel.app/result_DSC07102.jpg"],
    },
  }
}

// === Trang mời cá nhân: vẫn xử lý tên khách bình thường ===
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