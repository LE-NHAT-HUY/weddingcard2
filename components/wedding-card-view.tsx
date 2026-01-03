"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import WeddingCardScroll from "./wedding-card-scroll"
import type { WeddingData, Wish } from "@/lib/types"
import { Music, Volume2, VolumeX, MessageCircleHeart, Send, X, Heart } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

// Dữ liệu mặc định của thiệp cưới
export const defaultData: WeddingData = {
  
  groomName: "Khánh Nam",
  brideName: "Lan Nhi",
  groomFullName: "Lê Khánh Nam",
  brideFullName: "Nguyễn Thị Lan Nhi",
  groomFatherName: "LÊ VĂN NĂM",
  groomMotherName: "TRƯƠNG THỊ CÚC",
  brideFatherName: "NGUYỄN NHƯ THOAN",
  brideMotherName: "TƯỞNG THỊ BÍCH THÀNH",
  weddingDate: "2026-01-28",
  weddingDateA:"",
  weddingTime: "11:00",
  lunarDate: "10/12/2025",
  venueName: "Tư Gia Nhà Trai",
  venueAddress: "Thôn Phú Lộc 2, Phú Trạch, Quảng Trị",
  message: "Trân trọng kính mời quý khách đến dự bữa tiệc chung vui cùng gia đình chúng tôi",
  template: "",
  primaryColor: "#9e0a0a",
  accentColor: "#db9999",
  coverPhoto: "/anh15.jpg",
  introText:
  
    "",
  quoteText:
    "",
  songTitle: "",
  songArtist: "",
  loveStory: [
    {
      id: "",
      date: "",
      title: "",
      description:
        "",
      image: "",
    },
    {
      id: "",
      date: "",
      title: "",
      description:
        "",
      image: "",
    },
    {
      id: "",
      date: "",
      title: "",
      description:
        "",
      image: "",
    },
  ],
  gallery: [
    "/anh1.jpg",
    "/anh2.jpg",
    "/anh3.jpg",
    "/anh4.jpg",
    "/anh5.jpg",
    "/anh6.jpg",
    "/anh7.jpg",
    "/anh8.jpg",
    "/anh9.jpg",
    "/reanh10.jpg",
    "/anh12.jpg",
    "/anh13.jpg",
    "/anh14.jpg",
    "/anh15.jpg",
    "/anh16.jpg",
    "/anh17.jpg",
    "/anh18.jpg",
    "/anh19.jpg",
    "/anh20.jpg",
    "/anh21.jpg",
    "/anh22.jpg",
    "/anh23.jpg",
    "/anh24.jpg",
    "/anh25.jpg",
    "/anh26.jpg",
    "/anh15cat1.jpg",
    "/anh15cat2.jpg",
    "/anh15cat3.jpg",
    "/anh15cat4.jpg",
     
    
  ],
}

// Thêm type props
type WeddingCardViewProps = {
  guestCode?: string
  initialGuestName: string
  // các props cũ khác nếu có
}



export default function WeddingCardView({ initialGuestName }: WeddingCardViewProps) {
  const [data, setData] = useState<WeddingData>(defaultData)
  const [showMusicPrompt, setShowMusicPrompt] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const [wishes, setWishes] = useState<Wish[]>([])
  const [showWishModal, setShowWishModal] = useState(false)
  const [showFloatingWishes, setShowFloatingWishes] = useState(true)
  const [activeWishes, setActiveWishes] = useState<Array<Wish & { uniqueKey: string; position: number }>>([])
  const [wishForm, setWishForm] = useState({ name: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const wishIndexRef = useRef(0)

  useEffect(() => {
    const savedData = localStorage.getItem("weddingData")
    if (savedData) {
      try {
        setData(JSON.parse(savedData))
      } catch (e) {
        console.error("Error loading wedding data:", e)
      }
    }

    const loadWishes = async () => {
      const supabase = createClient()
      const { data: wishesData, error } = await supabase
        .from("wishes")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading wishes:", error)
        return
      }
        setWishes(wishesData || [])
        console.log("Loaded wishes:", wishesData?.length)
    }

    loadWishes()

    const supabase = createClient()
    const channel = supabase
      .channel("wishes-changes")
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    if (!showFloatingWishes || wishes.length === 0) {
      setActiveWishes([])
      return
    }

    const interval = setInterval(() => {
      const currentWish = wishes[wishIndexRef.current % wishes.length]
      const position = Math.random() * 60 + 10

      const newActiveWish = {
        ...currentWish,
        uniqueKey: `${Date.now()}-${wishIndexRef.current}`,
        position,
      }

      setActiveWishes((prev) => {
        const updated = [...prev, newActiveWish]
        if (updated.length > 5) {
          return updated.slice(-5)
        }
        return updated
      })

      wishIndexRef.current++
    }, 2000)

    const cleanupInterval = setInterval(() => {
      setActiveWishes((prev) => {
        const now = Date.now()
        return prev.filter((w) => {
          const wishTime = Number.parseInt(w.uniqueKey.split("-")[0])
          return now - wishTime < 6000
        })
      })
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(cleanupInterval)
    }
  }, [showFloatingWishes, wishes])

  const handleStartMusic = () => {
    setShowMusicPrompt(false)
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Không thể phát nhạc:", err))
    }
  }

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.error("Không thể phát nhạc:", err))
      }
    }
  }

  const toggleFloatingWishes = () => {
    setShowFloatingWishes(!showFloatingWishes)
  }

  const handleSubmitWish = async () => {
    if (!wishForm.name.trim() || !wishForm.message.trim()) return

    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("wishes").insert({
        name: wishForm.name.trim(),
        message: wishForm.message.trim(),
      })

      if (error) {
        console.error("Error submitting wish:", error)
        alert("Không thể gửi lời chúc. Vui lòng thử lại!")
        return
      }

      setWishForm({ name: "", message: "" })
      setShowWishModal(false)
      setShowFloatingWishes(true)
    } catch (err) {
      console.error("Error:", err)
      alert("Không thể gửi lời chúc. Vui lòng thử lại!")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f5f0eb]">
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" />




{showFloatingWishes && activeWishes.length > 0 && (
        <div
          // 👇 CÁC THAY ĐỔI QUAN TRỌNG:
          // 1. Bỏ 'left-1/2 -translate-x-1/2' (bỏ căn giữa màn hình)
          // 2. Thêm 'left-2 sm:left-4' (cách lề trái một đoạn nhỏ: 8px ở mobile, 16px ở desktop)
          // 3. Sửa 'items-center' thành 'items-start' (căn tin nhắn về phía trái của khung)
          // 4. Giữ 'bottom-20' để nó nằm phía trên nút nhạc (tránh bị che)
          className="wish-flow-container fixed left-2 sm:left-4 bottom-4 z-40 w-[85vw] sm:w-[350px] h-[45vh] items-start pb-2 overflow-hidden"
        >
          {activeWishes.map((wish) => (
            <div
              key={wish.uniqueKey}
              // 👇 Sửa 'justify-center' thành 'justify-start'
              className="wish-smooth-item relative w-full flex justify-start"
            >
              <div
                // 👇 Sửa 'text-center' thành 'text-left' cho nội dung dễ đọc khi ở góc trái
                className="px-4 py-2 rounded-xl text-left shadow-sm backdrop-blur-[2px]"
                style={{
                  maxWidth: "100%", /* Cho phép bong bóng tin nhắn dài ra nếu cần */
                  backgroundColor: "rgba(243, 121, 121, 0.8)",
                  border: `1px solid ${data.primaryColor}30`,
                  color: "#ffffff",
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                <div className="text-[13px] sm:text-sm leading-snug break-words">
                  <span className="font-bold mr-1">{wish.name}:</span>
                  <span>{wish.message}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

<button
  onClick={toggleFloatingWishes}
  aria-pressed={showFloatingWishes}
  className="
    fixed
    bottom-6
    right-4
    z-50
    bg-white
    shadow-lg
    rounded-full
    p-2.5
    hover:scale-105
    transition
  "
  title={showFloatingWishes ? "Tắt bình luận" : "Bật bình luận"}
>
  <svg
    viewBox="0 0 512 512"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    className={`transition-all duration-300 ${
      showFloatingWishes ? "opacity-100" : "opacity-40"
    }`}
    style={{ color: data.primaryColor }}
  >
    <path
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="48"
      d="M88 152h336M88 256h336M88 360h336"
    />
  </svg>
</button>




      {!showMusicPrompt && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-4 left-2 sm:bottom-6 sm:left-6 z-50 bg-white shadow-lg rounded-full p-2.5 sm:p-4 hover:shadow-xl transition-all flex items-center gap-1.5 sm:gap-2"
          style={{ color: data.primaryColor }}
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              <span className="hidden sm:inline text-xs sm:text-sm font-medium">Đang phát</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline text-xs sm:text-sm font-medium">Tắt tiếng</span>
            </>
          )}
        </button>
      )}

      {!showMusicPrompt && (
        <div className="fixed bottom-4 right-2 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-1.5 sm:gap-3">
          {wishes.length > 0 && (
            <div
              className="bg-white/90 backdrop-blur-sm shadow-md rounded-full px-2 py-0.5 sm:px-3 sm:py-1.5 flex items-center gap-1 text-[10px] sm:text-sm"
              style={{ color: data.primaryColor }}
            >
              <Heart className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" fill={data.primaryColor} />
              <span className="font-medium">{wishes.length}</span>
            </div>
          )}

          <div className="flex items-center gap-1 sm:gap-2">

             <button
            onClick={toggleFloatingWishes}
            className="bg-white shadow-lg rounded-full p-3 flex items-center justify-center"
            title={showFloatingWishes ? "Tắt bình luận" : "Bật bình luận"}
            style={{
              color: showFloatingWishes ? data.primaryColor : "#999",
              opacity: showFloatingWishes ? 1 : 0.5,
            }}
          >
            <svg
              viewBox="0 0 512 512"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="48"
                d="M88 152h336M88 256h336M88 360h336"
              />
            </svg>
          </button>
          
            <button
              onClick={() => setShowWishModal(true)}
              className="bg-white shadow-lg rounded-full p-2 sm:p-3 hover:shadow-xl transition-all hover:scale-105"
              style={{
                color: "white",
                backgroundColor: data.primaryColor,
              }}
              title="Gửi lời chúc mới"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      )}

      {showWishModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-end justify-center backdrop-blur-sm">
          <div
            className="bg-white rounded-t-2xl p-4 sm:p-6 w-full sm:max-w-md sm:rounded-2xl sm:mb-0 shadow-2xl relative max-h-[80vh] overflow-y-auto"
            style={{ animation: "fadeInUp 0.3s ease-out" }}
          >
            <button
              onClick={() => setShowWishModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4 sm:mb-6">
              <div
                className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: data.primaryColor + "20" }}
              >
                <MessageCircleHeart className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: data.primaryColor }} />
              </div>
              <h3 className="text-lg sm:text-2xl font-semibold" style={{ color: data.primaryColor }}>
                Gửi lời chúc
              </h3>
              <p className="text-gray-500 text-[10px] sm:text-sm mt-1">
                Gửi những lời chúc tốt đẹp đến {data.groomName} & {data.brideName}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tên của bạn</label>
                <input
                  type="text"
                  value={wishForm.name}
                  onChange={(e) => setWishForm({ ...wishForm, name: e.target.value })}
                  placeholder="Nhập tên của bạn"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                  style={{ "--tw-ring-color": data.primaryColor } as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Lời chúc</label>
                <textarea
                  value={wishForm.message}
                  onChange={(e) => setWishForm({ ...wishForm, message: e.target.value })}
                  placeholder="Viết lời chúc của bạn..."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent resize-none text-sm"
                  style={{ "--tw-ring-color": data.primaryColor } as React.CSSProperties}
                />
              </div>
              
              
              <button
                onClick={handleSubmitWish}
                disabled={!wishForm.name.trim() || !wishForm.message.trim() || isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl text-white font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                style={{ backgroundColor: data.primaryColor }}
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Đang gửi..." : "Gửi lời chúc"}
              </button>
            </div>
          </div>
        </div>
      )}

  <WeddingCardScroll
  data={data}
  onToggleMusic={toggleMusic}
  onShowWishModal={() => setShowWishModal(true)}
  initialGuestName={initialGuestName}
 
/>
    </div>
  )
}
