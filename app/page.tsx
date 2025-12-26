// app/page.tsx – chỉ làm trang giới thiệu hoặc redirect
import WeddingCardView from '@/components/wedding-card-view'

export const metadata = {
  title: "Thân mời Quý khách | Tham dự đám cưới của Nam & Nhi",
  description: "Mời bạn tham dự lễ cưới của chúng tôi",
}

export default function Home() {
  return <WeddingCardView initialGuestName="quý khách" />
}