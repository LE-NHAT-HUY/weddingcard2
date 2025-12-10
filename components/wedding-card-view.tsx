"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import WeddingCardScroll from "./wedding-card-scroll"
import type { WeddingData, Wish } from "@/lib/types"
import { Music, Volume2, VolumeX, MessageCircleHeart, Send, X, Heart } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

// Dữ liệu mặc định của thiệp cưới
const defaultData: WeddingData = {
  
  groomName: "Khánh Nam",
  brideName: "Lan Nhi",
  groomFullName: "Lê Khánh Nam",
  brideFullName: "Nguyễn Thị Lan Nhi",
  groomFatherName: "Lê Văn Tiến",
  groomMotherName: "Trương Thị Cúc",
  brideFatherName: "Tên cha",
  brideMotherName: "Tên Mẹ",
  weddingDate: "2025-05-20",
  weddingTime: "12:00",
  lunarDate: "23/04/2025",
  venueName: "Tư Gia Nhà Trai",
  venueAddress: "Thôn Phú Lộc 2, Phú Trạch, Quảng Trị",
  message: "Trân trọng kính mời quý khách đến dự bữa tiệc chung vui cùng gia đình chúng tôi",
  template: "",
  primaryColor: "#9e0a0a",
  accentColor: "#db9999",
  coverPhoto: "/romantic-couple-wedding-photo-portrait.jpg",
  introText:
    "Trước đây, chúng mình từng nghĩ rằng, đám cưới chỉ là một thông báo chính thức. Giờ mới hiểu, đó là một dịp hiếm hoi để tụ họp, là sự vượt ngàn dặm để đến bên nhau, là sự ủng hộ vô điều kiện đầy trân quý.",
  quoteText:
    "Tình yêu đích thực không phải là khoảng cách, mà là một lựa chọn. Chúng mình chọn nắm lấy nhau, trân trọng nhau, và cùng nhau gìn giữ. Từ hôm nay, mãi mãi một lòng.",
  songTitle: "I Love You",
  songArtist: "Céline Dion",
  loveStory: [
    {
      id: "1",
      date: "05.10.2018",
      title: "Lần đầu gặp gỡ",
      description:
        "Giữa dòng người tấp nập, chúng mình gặp nhau vào mùa hè, hẹn ước vào mùa xuân, và hôm nay, trong khoảnh khắc đẹp nhất, chúng mình quyết định nắm tay nhau trọn đời.",
      image: "/couple-first-meeting-cafe-romantic.jpg",
    },
    {
      id: "2",
      date: "20.05.2019",
      title: "Chúng mình bên nhau",
      description:
        "Chuyến đi đầu tiên không có đích đến, vậy mà ta lại tìm thấy tình yêu. Em chụp phong cảnh, khen trời thu đẹp, anh chụp em, nói muốn lưu giữ điều tuyệt vời.",
      image: "/couple-travel-trip-together-happy.jpg",
    },
    {
      id: "3",
      date: "20.05.2022",
      title: "Ba năm bên nhau",
      description:
        "Có người hỏi, bí mật của tình yêu là gì. Nghĩ thật lâu, có lẽ đó là dũng khí. Tình yêu luôn có câu trả lời.",
      image: "/couple-anniversary-celebration-romantic-dinner.jpg",
    },
  ],
  gallery: [
    "/anh1.jpg",
    "/anh2.jpg",
    "/anh3.jpg",
    "/anh4.jpg",
    "/anh5.jpg",
    "/anh6.jpg",
  ],
}

export default function WeddingCardView() {
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
    }, 2500)

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
      <audio ref={audioRef} src="/wedding-background-music.mp3" loop preload="auto" />

      {showFloatingWishes && activeWishes.length > 0 && !showMusicPrompt && (
        <div className="fixed left-0 bottom-16 z-40 pointer-events-none w-[180px] sm:w-[240px] md:w-[300px] h-[45vh] overflow-hidden pl-2 sm:pl-4">
          {activeWishes.map((wish, index) => (
            <div
              key={wish.uniqueKey}
              className="floating-wish absolute left-0 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl backdrop-blur-md shadow-md"
              style={{
                bottom: `${index * 8}px`,
                backgroundColor: `rgba(255, 240, 245, 0.9)`,
                border: `1px solid ${data.primaryColor}25`,
                boxShadow: `0 2px 10px ${data.primaryColor}15`,
                maxWidth: "calc(100% - 8px)",
              }}
            >
              <div className="flex items-start gap-1.5">
                <Heart
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0 mt-0.5"
                  style={{ color: data.primaryColor }}
                  fill={data.primaryColor}
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-[10px] sm:text-xs" style={{ color: data.primaryColor }}>
                    {wish.name}
                  </span>
                  <span className="text-gray-700 text-[10px] sm:text-xs line-clamp-2">{wish.message}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}


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
              className={`shadow-lg rounded-full px-2.5 py-2 sm:px-4 sm:py-3 hover:shadow-xl transition-all flex items-center gap-1 sm:gap-2 ${
                showFloatingWishes ? "bg-white" : "bg-gray-100"
              }`}
              style={{ color: showFloatingWishes ? data.primaryColor : "#888" }}
              title={showFloatingWishes ? "Tắt hiển thị lời chúc" : "Bật hiển thị lời chúc"}
            >
              <MessageCircleHeart className={`w-4 h-4 sm:w-5 sm:h-5 ${showFloatingWishes ? "animate-pulse" : ""}`} />
              <span className="font-medium text-[10px] sm:text-sm hidden xs:inline">Lời chúc</span>
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
/>
    </div>
  )
}
