"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import WeddingCardScroll from "./wedding-card-scroll"
import type { WeddingData, Wish } from "@/lib/types"
import { Volume2, VolumeX, MessageCircleHeart, Send, X, Heart } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

// Dữ liệu mặc định
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
  weddingDateA: "",
  weddingTime: "11:00",
  lunarDate: "10/12/2025",
  venueName: "Tư Gia Nhà Trai",
  venueAddress: "Thôn Phú Lộc 2, Phú Trạch, Quảng Trị",
  message: "Trân trọng kính mời quý khách đến dự bữa tiệc chung vui cùng gia đình chúng tôi",
  template: "",
  primaryColor: "#9e0a0a",
  accentColor: "#db9999",
  coverPhoto: "/anh15.jpg",
  introText: "",
  quoteText: "",
  songTitle: "",
  songArtist: "",
  loveStory: [],
  gallery: [
    "/anh1.jpg", "/anh2.jpg", "/anh3.jpg", "/anh4.jpg", "/anh5.jpg",
    "/anh6.jpg", "/anh7.jpg", "/anh8.jpg", "/anh9.jpg", "/reanh10.jpg",
    "/anh12.jpg", "/anh13.jpg", "/anh14.jpg", "/anh15.jpg", "/anh16.jpg",
    "/anh17.jpg", "/anh18.jpg", "/anh19.jpg", "/anh20.jpg", "/anh21.jpg",
    "/anh22.jpg", "/anh23.jpg", "/anh24.jpg", "/anh25.jpg", "/anh26.jpg",
    "/anh15cat1.jpg", "/anh15cat2.jpg", "/anh15cat3.jpg", "/anh15cat4.jpg",
  ],
}

type WeddingCardViewProps = {
  guestCode?: string
  initialGuestName: string
}

export default function WeddingCardView({ initialGuestName }: WeddingCardViewProps) {
  const [data, setData] = useState<WeddingData>(defaultData)
  const [showMusicPrompt, setShowMusicPrompt] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Wish states
  const [wishes, setWishes] = useState<Wish[]>([])
  const [showWishModal, setShowWishModal] = useState(false)
  const [showFloatingWishes, setShowFloatingWishes] = useState(true)
  const [activeWishes, setActiveWishes] = useState<Array<Wish & { uniqueKey: string }>>([])
  const [wishForm, setWishForm] = useState({ name: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Refs cho logic cuộn băng chuyền
  const wishIndexRef = useRef(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // 1. Load dữ liệu và Realtime
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
    }

    loadWishes()

    const supabase = createClient()
    const channel = supabase
      .channel("wishes-changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "wishes" }, (payload: any) => {
        const newWish = payload.new as Wish
        setWishes((prev) => [newWish, ...prev])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // 2. Logic "Bơm" tin nhắn vào danh sách hiển thị
  useEffect(() => {
    if (!showFloatingWishes || wishes.length === 0) return

    // Cứ 3 giây thêm một tin nhắn mới vào danh sách
    const interval = setInterval(() => {
      const currentWish = wishes[wishIndexRef.current % wishes.length]
      
      // Tạo key mới để React biết đây là phần tử mới
      const newActiveWish = {
        ...currentWish,
        uniqueKey: `${Date.now()}-${wishIndexRef.current}`,
      }

      setActiveWishes((prev) => {
        // Giữ lại tối đa 20 tin nhắn gần nhất để tạo dòng chảy dài
        // Không cần xóa quá nhanh, để user kịp đọc khi nó trôi lên
        const updated = [...prev, newActiveWish]
        if (updated.length > 20) {
          return updated.slice(updated.length - 20)
        }
        return updated
      })

      wishIndexRef.current++
    }, 1700)

    return () => clearInterval(interval)
  }, [showFloatingWishes, wishes])

  // 3. Logic "Băng chuyền" (Auto Scroll) - QUAN TRỌNG NHẤT
  useEffect(() => {
    let animationFrameId: number

    const autoScroll = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current
        // Mỗi khung hình cuộn xuống 0.5px => Tạo hiệu ứng nội dung trôi lên
        // Tăng số này nếu muốn trôi nhanh hơn (ví dụ 0.8 hoặc 1.0)
        container.scrollTop += 1.0; 
      }
      animationFrameId = requestAnimationFrame(autoScroll)
    }

    // Bắt đầu chạy
    if (showFloatingWishes) {
      animationFrameId = requestAnimationFrame(autoScroll)
    }

    return () => cancelAnimationFrame(animationFrameId)
  }, [showFloatingWishes]) // Chỉ chạy lại khi bật/tắt tính năng

  // Các hàm xử lý nhạc và submit
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
      if (error) throw error
      setWishForm({ name: "", message: "" })
      setShowWishModal(false)
    } catch (err) {
      alert("Lỗi khi gửi lời chúc. Vui lòng thử lại!")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f5f0eb]">
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" />

      {/* --- PHẦN LỜI CHÚC TRÔI (FLOATING WISHES) --- */}
      {showFloatingWishes && activeWishes.length > 0 && (
        <div 
          className="fixed left-2 sm:left-4 bottom-4 z-40 w-[85vw] sm:w-[350px] h-[30vh] pointer-events-none"
          style={{
            // Mask tạo hiệu ứng mờ dần ở đỉnh để tin nhắn biến mất đẹp mắt
            maskImage: "linear-gradient(to bottom, transparent, black 15%, black 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 100%)"
          }}
        >
          {/* Container này sẽ được auto-scroll */}
          <div
            ref={scrollContainerRef}
            className="w-full h-full overflow-hidden flex flex-col gap-1 pb-4"
          >
            {/* Div ảo này cực kỳ quan trọng:
               Nó chiếm chỗ trống ban đầu để các lời chúc xuất hiện từ đáy màn hình 
               thay vì dồn cục ở trên đỉnh.
            */}
            <div className="flex-shrink-0 min-h-[40vh]"></div>

            {activeWishes.map((wish) => (
              <div
                key={wish.uniqueKey}
                // animate-fade-in-up: Hiệu ứng nảy nhẹ khi mới sinh ra
                className="w-full flex justify-start px-1 animate-fade-in-up flex-shrink-0"
              >
                <div
                  className="px-4 py-2.5 rounded-xl text-left shadow-sm backdrop-blur-[2px]"
                  style={{
                    maxWidth: "100%", // Cho phép tin nhắn dài
                    width: "fit-content",
                    backgroundColor: "rgba(243, 121, 121, 0.85)",
                    border: `1px solid ${data.primaryColor}30`,
                    color: "#ffffff",
                    fontFamily: "'Playfair Display', serif",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
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
        </div>
      )}

      {/* --- CÁC NÚT ĐIỀU KHIỂN & MODAL --- */}
      
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

      {/* Nút Music và Group nút bên phải */}
      {!showMusicPrompt && (
        <>
          <button
            onClick={toggleMusic}
            className="fixed bottom-4 left-2 sm:bottom-6 sm:left-6 z-50 bg-white shadow-lg rounded-full p-2.5 sm:p-4 hover:shadow-xl transition-all flex items-center gap-1.5 sm:gap-2"
            style={{ color: data.primaryColor }}
          >
            {isPlaying ? (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            <span className="hidden sm:inline text-xs sm:text-sm font-medium">
                {isPlaying ? "Đang phát" : "Tắt tiếng"}
            </span>
          </button>

          <div className="fixed bottom-4 right-2 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-1.5 sm:gap-3 pointer-events-none">
            {/* Chỉ hiển thị số lượng tim (View Only) */}
            {wishes.length > 0 && (
              <div
                className="bg-white/90 backdrop-blur-sm shadow-md rounded-full px-2 py-0.5 sm:px-3 sm:py-1.5 flex items-center gap-1 text-[10px] sm:text-sm mb-1 pointer-events-auto"
                style={{ color: data.primaryColor }}
              >
                <Heart className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" fill={data.primaryColor} />
                <span className="font-medium">{wishes.length}</span>
              </div>
            )}
            
            {/* Group nút hành động (cần pointer-events-auto) */}
            <div className="flex items-center gap-2 pointer-events-auto">
                 {/* Nút mở Modal gửi lời chúc */}
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
        </>
      )}

      {/* MODAL GỬI LỜI CHÚC */}
      {showWishModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-end justify-center backdrop-blur-sm p-4 sm:items-center">
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-300"
          >
            <button
              onClick={() => setShowWishModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: data.primaryColor + "20" }}
              >
                <MessageCircleHeart className="w-8 h-8" style={{ color: data.primaryColor }} />
              </div>
              <h3 className="text-xl font-bold" style={{ color: data.primaryColor }}>
                Gửi lời chúc
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Gửi những lời chúc tốt đẹp đến {data.groomName} & {data.brideName}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Tên của bạn</label>
                <input
                  type="text"
                  value={wishForm.name}
                  onChange={(e) => setWishForm({ ...wishForm, name: e.target.value })}
                  placeholder="Nhập tên..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 text-sm transition-all"
                  style={{ "--tw-ring-color": data.primaryColor } as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Lời chúc</label>
                <textarea
                  value={wishForm.message}
                  onChange={(e) => setWishForm({ ...wishForm, message: e.target.value })}
                  placeholder="Viết lời chúc..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 resize-none text-sm transition-all"
                  style={{ "--tw-ring-color": data.primaryColor } as React.CSSProperties}
                />
              </div>
              
              <button
                onClick={handleSubmitWish}
                disabled={!wishForm.name.trim() || !wishForm.message.trim() || isSubmitting}
                className="w-full py-3 px-4 rounded-xl text-white font-bold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                style={{ backgroundColor: data.primaryColor }}
              >
                {isSubmitting ? (
                    <span className="animate-pulse">Đang gửi...</span>
                ) : (
                    <>
                        <Send className="w-4 h-4" /> Gửi lời chúc
                    </>
                )}
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