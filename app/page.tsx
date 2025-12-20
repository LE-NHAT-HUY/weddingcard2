// app/page.tsx - CẦN SỬA NHƯ SAU
import { Suspense } from 'react'
import WeddingCardView from '@/components/wedding-card-view'

export default function Home() {
  return (
    <Suspense fallback={<div></div>}>
      <WeddingCardView />
    </Suspense>
  )
}