// app/invite/[code]/page.tsx
import WeddingCardView from "@/components/wedding-card-view"
import { createClient } from "@/lib/supabase/client"
import type { Metadata } from "next"

type Props = {
  params: Promise<{ code: string }>  // ← Next.js 15: params là Promise
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params
  const supabase = createClient()

  let guestName = "Quý khách"

  const { data } = await supabase
    .from("guests")
    .select("name")
    .eq("code", code.toLowerCase())  // hoặc .ilike nếu cần không phân biệt hoa thường
    .single()

  if (data?.name) {
    guestName = data.name.trim()
  }

  const baseTitle = "Thiệp Cưới Khánh Nam & Lan Nhi"
  const title = guestName === "Quý khách"
    ? baseTitle
    : `Thiệp Mời ${guestName} - ${baseTitle}`

  return {
    title,
    openGraph: { title },
    twitter: { title },
  }
}

export default async function InvitePage({ params }: Props) {
  const { code } = await params
  const supabase = createClient()

  // Fetch tên khách mời từ server để truyền xuống ngay lập tức
  let initialGuestName = "quý khách"

  const { data } = await supabase
    .from("guests")
    .select("name")
    .eq("code", code.toLowerCase())  // điều chỉnh theo cách lưu code của bạn
    .single()

  if (data?.name) {
    initialGuestName = data.name.trim()
  }

  // ← QUAN TRỌNG: Render WeddingCardView, không phải Scroll trực tiếp
  return (
    <WeddingCardView
      guestCode={code}
      initialGuestName={initialGuestName}
    />
  )
}