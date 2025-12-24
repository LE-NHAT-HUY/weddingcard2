"use client"

import AutoScrollToBottom from "../components/AutoScrollToBottom";
import LoveCardTrigger from '../components/LoveCardTrigger';
import CustomImage2 from '../components/CustomImage2';
import CustomImage from '../components/CustomImage';
import HeartImage from '../components/HeartImage';
import GiftEnvelope from "./GiftEnvelope";
import Image from "next/image"
import type { WeddingData, Wish } from "@/lib/types"
import { useEffect, useRef, useState } from "react"
import { Heart, MapPin, Calendar, Volume2, Send } from "lucide-react"
import RSVPSection from "@/components/RSVPSection"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import FingerprintHeart from "./FingerprintHeart";

interface WeddingCardScrollProps {
    guestCode?: string
  data: WeddingData
  onToggleMusic?: () => void
  onShowWishModal?: () => void
}

export default function WeddingCardScroll({
  guestCode,
  data,
  onToggleMusic,
  onShowWishModal,
}: WeddingCardScrollProps) {
  // ---------- helper: lấy tên file (loại bỏ -1280 nếu có) ----------
  const getBaseName = (path?: string | null) => {
    if (!path) return null
    const raw = path.split("/").pop() ?? ""
    const nameOnly = raw.split(".")[0] ?? raw
    // loại bỏ hậu tố kích thước nếu có (ví dụ: anh-nen1-1280 -> anh-nen1)
    return nameOnly.replace(/-\d+$/, "")
  }

  // ---------- map blurDataURL (hardcode) ----------
  // Thay các chuỗi "data:image/..." bằng nội dung thực tế từ file *-blur.txt của bạn
  const galleryBlurMap: Record<string, string> = {
    anh1: "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcU...",
    anh2: "data:image/jpeg;base64,/9j/4QCkRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAWQAAAHAAAABDAyMTCgAAAHAAAABDAxMDCgAQADAAAAAf//AACgAgAEAAAAAQAAABSgAwAEAAAAAQAAAB4AAAAA/+EJYWh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIgdGlmZjpPcmllbnRhdGlvbj0iMCIvPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9InciPz4A/+IB8ElDQ19QUk9GSUxFAAEBAAAB4GxjbXMEIAAAbW50clJHQiBYWVogB+IAAwAUAAkADgAdYWNzcE1TRlQAAAAAc2F3c2N0cmwAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y1oYW5keem/Vlo+AbaDI4VVRvdPqgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKZGVzYwAAAPwAAAAkY3BydAAAASAAAAAid3RwdAAAAUQAAAAUY2hhZAAAAVgAAAAsclhZWgAAAYQAAAAUZ1hZWgAAAZgAAAAUYlhZWgAAAawAAAAUclRSQwAAAcAAAAAgZ1RSQwAAAcAAAAAgYlRSQwAAAcAAAAAgbWx1YwAAAAAAAAABAAAADGVuVVMAAAAIAAAAHABzAFIARwBCbWx1YwAAAAAAAAABAAAADGVuVVMAAAAGAAAAHABDAEMAMAAAWFlaIAAAAAAAAPbWAAEAAAAA0y1zZjMyAAAAAAABDD8AAAXd///zJgAAB5AAAP2S///7of///aIAAAPcAADAcVhZWiAAAAAAAABvoAAAOPIAAAOPWFlaIAAAAAAAAGKWAAC3iQAAGNpYWVogAAAAAAAAJKAAAA+FAAC2xHBhcmEAAAAAAAMAAAACZmkAAPKnAAANWQAAE9AAAApb/9sAQwAGBAUGBQQGBgUGBwcGCAoQCgoJCQoUDg8MEBcUGBgXFBYWGh0lHxobIxwWFiAsICMmJykqKRkfLTAtKDAlKCko/9sAQwEHBwcKCAoTCgoTKBoWGigoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgo/8AAEQgAHgAUAwEiAAIRAQMRAf/EABkAAAIDAQAAAAAAAAAAAAAAAAAFAgMEB//EACIQAAEEAQMFAQAAAAAAAAAAAAEAAgMEERMiMQUSITJhQf/EABYBAQEBAAAAAAAAAAAAAAAAAAACAf/EABcRAQEBAQAAAAAAAAAAAAAAAAABAjH/2gAMAwEAAhEDEQA/AO1WrQjbKQxx0xk/Viq9ZqyTQQvdp2JRlsbuU3gAe7sc0HPKV2+iV5b7bZaDNGdnxRbYzMl6atfgIVQOPB5QrSnFsdn9Vjm90eSCTnKyXYZZjGIpdMA7voTSsAIw0+cDkoMDmknI4QmBbGD6IQf/2Q==",
    anh3: "data:image/jpeg;base64,...",
    anh4: "data:image/jpeg;base64,...",
    anh5: "data:image/jpeg;base64,...",
    anh6: "data:image/jpeg;base64,...",
    anh7: "data:image/jpeg;base64,...",
    anh8: "data:image/jpeg;base64,...",
    anh9: "data:image/jpeg;base64,...",
    reanh10: "data:image/jpeg;base64,...",
    anh12: "data:image/jpeg;base64,...",
    anh13: "data:image/jpeg;base64,...",
    anh14: "data:image/jpeg;base64,...",
    // nếu cần thêm ảnh khác thì tiếp tục
  }

  // ---------- helper: build optimized path và blur ----------
  const optimizedPathFor = (origPath?: string | null, size = 1280) => {
    const name = getBaseName(origPath) ?? null
    if (!name) return { src: "/placeholder.jpg", blur: undefined }
    const src = `/images/optimized/${name}-${size}.avif`
    const blur = galleryBlurMap[name]
    return { src, blur }
  }

  // Hero cover (nếu data.coverPhoto rỗng thì fallback ảnh anh-nen1)
  const coverCandidate = data.coverPhoto || "/anh15.jpg"
  const { src: coverPhotoOptimized, blur: coverBlur } = optimizedPathFor(coverCandidate)

  // Supabase / search params / state giữ nguyên
  //const searchParams = useSearchParams()
  //const code = searchParams.get("code")
  const codeToUse = guestCode 
  const supabase = createClient()

    const rows = [
    [1, 2, 3, 4],        // hàng 1 — bắt đầu ở nửa phải ảnh
    [5, 6, 7, 8, 9, 10, 11], // hàng 2
    [12, 13, 14, 15, 16, 17, 18], // hàng 3
    [19, 20, 21, 22, 23, 24, 25], // hàng 4 (đã điều chỉnh, xem ghi chú)
    [26, 27, 28, 29, 30, 31] // hàng 5
  ];

 // ảnh RIÊNG cho gallery này (ví dụ ảnh 1–6)
const photos = [
  data.gallery?.[22],
  data.gallery?.[21],
  data.gallery?.[19],
  data.gallery?.[20],
  data.gallery?.[23],
  data.gallery?.[9],
].filter(Boolean)


const [selectedIndex, setSelectedIndex] = useState(0);

  const prev = () => setSelectedIndex((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setSelectedIndex((i) => (i + 1) % photos.length);

  const [guestName, setGuestName] = useState<string | null>(null)
  const [guestHonorific, setGuestHonorific] = useState<string | null>(null)
  const [showFloatingWishes, setShowFloatingWishes] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const unlockedRef = useRef(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const [activeWishes, setActiveWishes] = useState<Array<Wish & { uniqueKey: string; position: number }>>([])
  const wishIndexRef = useRef(0)
  const [isMusicOn, setIsMusicOn] = useState(false)


  useEffect(() => {
    audioRef.current = new Audio('/music.mp3')
    audioRef.current.loop = true
    audioRef.current.volume = 0.3
    audioRef.current.preload = 'auto'
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const enableMusicOnFirstTap = (e: Event) => {
      if (unlockedRef.current || !audioRef.current) return
      const target = e.target as HTMLElement
      const isMusicButton =
        target.closest('button[title*="nhạc"]') ||
        target.closest('button[aria-pressed]')
      if (isMusicButton) {
        unlockedRef.current = true
      } else {
        unlockedRef.current = true
        audioRef.current.play().then(() => setIsMusicOn(true)).catch(() => {})
      }
      window.removeEventListener("click", enableMusicOnFirstTap, true)
      window.removeEventListener("touchstart", enableMusicOnFirstTap, true)
    }
    window.addEventListener("click", enableMusicOnFirstTap, { capture: true })
    window.addEventListener("touchstart", enableMusicOnFirstTap, { capture: true })
    return () => {
      window.removeEventListener("click", enableMusicOnFirstTap, true)
      window.removeEventListener("touchstart", enableMusicOnFirstTap, true)
    }
  }, [])


useEffect(() => {
  console.log("Fetching guest for code:", codeToUse)
  if (!codeToUse) return

  const fetchGuest = async () => {
    const { data, error } = await supabase
      .from("guests")
      .select("name, honorific")
      .eq("code", codeToUse)
      .single()
    
    console.log("Supabase result:", { data, error })

    if (data?.name) setGuestName(data.name)
    if (data?.honorific) setGuestHonorific(data.honorific)
  }

  fetchGuest()
}, [codeToUse, supabase])




  const handleToggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!unlockedRef.current) unlockedRef.current = true
    if (!audioRef.current) return
    if (isMusicOn) {
      audioRef.current.pause()
      setIsMusicOn(false)
      return
    }
    audioRef.current.play().catch(() => {})
    setIsMusicOn(true)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.5) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id))
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: [0.5], root: null, rootMargin: "0px 0px -10% 0px" },
    )
    const sections = containerRef.current?.querySelectorAll("[data-animate]")
    sections?.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const isVisible = (id: string) => visibleSections.has(id)

  const formatCountdown = () => {
    if (!data.weddingDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    const [year, month, day] = data.weddingDate.split("-").map(Number)
    const [hour, minute] = (data.weddingTime || "11:00").split(":").map(Number)
    const wedding = new Date(year, month - 1, day, hour, minute, 0)
    const now = new Date()
    const diff = wedding.getTime() - now.getTime()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  }

  const [countdown, setCountdown] = useState(formatCountdown())
  useEffect(() => {
    const timer = setInterval(() => setCountdown(formatCountdown()), 1000)
    return () => clearInterval(timer)
  }, [data.weddingDate, data.weddingTime])

  const countdownItems = [
    { value: countdown.days, label: "Ngày" },
    { value: countdown.hours, label: "Giờ" },
    { value: countdown.minutes, label: "Phút" },
    { value: countdown.seconds, label: "Giây" },
  ]

const containerStyle = {
  fontFamily: "'Quicksand', 'Playfair Display', sans-serif",
  backgroundColor: "#f6f5f5ff", // màu nền dự phòng nếu ảnh không tải
  backgroundImage: "url('https://w.ladicdn.com/649340684a3700001217851c/paperboard-texture_95678-72-20250323094652-8gyf6.avif')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};




  // ---------- render ----------
  return (
    
    
    <div
      ref={containerRef}
      className="relative w-full md:max-w-md mx-auto h-screen overflow-y-scroll snap-y snap-mandatory"
      style={containerStyle}
    >
          <AutoScrollToBottom containerRef={containerRef} />
      {/* FLOATING BUTTONS */}
      <button
        onClick={handleToggleMusic}
        aria-pressed={isMusicOn}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 bg-black/70 shadow-lg rounded-full p-0.5 hover:scale-105 transition"
        title={isMusicOn ? "Tắt nhạc" : "Bật nhạc"}
      >
        <img
          src="/audio-1.png"
          alt="music icon"
          className={`w-8 h-8 transition-all duration-500 ${isMusicOn ? "opacity-100 animate-spin" : "opacity-50"}`}
          style={isMusicOn ? { animationDuration: "3s" } : undefined}
        />
      </button>

      {/* First full-screen photo */}
  {/* Main start: Text block on top + Image block below */}
<section
  id="main-photo-start"
  data-animate
  className={`w-screen h-screen flex justify-center items-center transition-all duration-1700 ease-out ${
    isVisible("main-photo-start")
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-6"
  }`}
  style={{ willChange: "opacity, transform" }}
>
  {/* ===== CONTAINER CHÍNH ===== */}
  <div className="w-full max-w-[720px] h-full flex flex-col">

    {/* ===== PHẦN CHỮ – 40% ===== */}
    <div className="h-[35%] flex flex-col justify-start pt-4 px-4">
      
      {/* SAVE THE DATE – sát trên */}
      <div className="w-full text-center mb-3">
        <p
          className={`text-sm transition-all duration-700 ${
            isVisible("main-photo-start")
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4"
          }`}
          style={{
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: "1.5px",
            color: "#3c3535ff",
          }}
        >
          SAVE THE DATE
        </p>
      </div>

      {/* ===== NAMES ===== */}
      <div className="relative w-full flex-1">

        {/* Groom – trái, cao */}
        <p
          className={`absolute left-0 top-4 text-[2.5rem] md:text-[2.6rem] italic transition-all duration-1000 delay-[700ms] ${
            isVisible("main-photo-start")
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-12"
          }`}
          style={{
            fontFamily: "'Great Vibes', cursive",
            color: "#804b4bff",
            letterSpacing: "1.5px",
          }}
        >
          {data.groomName}
        </p>

        {/* & – nhẹ, ở giữa */}
        <span
          className="absolute left-50 top-19 -translate-x-1/2 text-3xl opacity-40"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          &
        </span>

        {/* Bride – phải, thấp hơn chút */}
        <p
          className={`absolute right-0 top-27 text-[2.7rem] italic text-right transition-all duration-1000 delay-[700ms] ${
            isVisible("main-photo-start")
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-12"
          }`}
          style={{
            fontFamily: "'Great Vibes', cursive",
            color: "#804b4bff",
            letterSpacing: "1.5px",
          }}
        >
          {data.brideName}
        </p>

      </div>
    </div>


    {/* ===== PHẦN ẢNH (6 phần - 60% chiều cao) ===== */}
    {/* ⭐ FIX: Đặt chiều cao cụ thể cho container ảnh */}
    <div className="h-3/5 flex items-end">
      <div className="w-full px-2 md:px-4" style={{ height: "100%" }}>
        <div
          className="relative flex items-end gap-x-1"
          style={{ 
            height: "112%", // ⭐ QUAN TRỌNG: Chiều cao 100%
          }}
        >
          
          {/* LEFT slice – 17%, cao hơn */}
          <div
            className={`relative w-[17%] overflow-hidden transition-all duration-1200 ease-out ${
              isVisible("main-photo-start") ? "opacity-100 -translate-y-3" : "opacity-0 translate-y-12"
            }`}
            style={{
              height: "100%", // Cao hơn 5%
              position: "relative", // ⭐ QUAN TRỌNG: Cho Image fill
            }}
          >
            <Image
              src={coverPhotoOptimized || "/placeholder.jpg"}
              alt="Left slice"
              fill
              priority
              sizes="(max-width: 768px) 17vw, 17vw"
              className="object-cover"
              style={{
                objectPosition: "8% center",
                transform: "scale(1.08)",
              }}
              onError={(e) => {
                console.error("Image failed to load:", e);
                // Fallback nếu ảnh lỗi
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.jpg";
              }}
            />
          </div>

          {/* CENTER slice – 66%, thấp hơn */}
          <div
            className={`relative w-[66%] overflow-hidden transition-all duration-1400 ease-out ${
              isVisible("main-photo-start") ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-12"
            }`}
            style={{
              height: "100%", // Thấp hơn 5%
              position: "relative", // ⭐ QUAN TRỌNG
            }}
          >
            <Image
              src={coverPhotoOptimized || "/placeholder.jpg"}
              alt="Center slice"
              fill
              priority
              sizes="(max-width: 768px) 66vw, 66vw"
              className="object-cover"
              style={{
                objectPosition: "50% 48%",
                transform: "scale(1.12)",
              }}
            />
          </div>

          {/* RIGHT slice – 17%, cao hơn */}
          <div
            className={`relative w-[17%] overflow-hidden transition-all duration-1200 ease-out ${
              isVisible("main-photo-start") ? "opacity-100 -translate-y-3" : "opacity-0 translate-y-12"
            }`}
            style={{
              height: "100%", // Cao hơn 5%
              position: "relative", // ⭐ QUAN TRỌNG
            }}
          >
            <Image
              src={coverPhotoOptimized || "/placeholder.jpg"}
              alt="Right slice"
              fill
              priority
              sizes="(max-width: 768px) 17vw, 17vw"
              className="object-cover"
              style={{
                objectPosition: "92% center",
                transform: "scale(1.08)",
              }}
            />
          </div>
          
        </div>
      </div>
    </div>

  </div>
</section>

 

 {/* Invitation text */}
 {/* Quote chính */}
<section
  id="quote1"
  data-animate
  className={`px-2 sm:px-2 py-2 text-center transition-all duration-700 ${
    isVisible("quote1") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
  }`}
>
  <p
    className="text-xl sm:text-xl mb-2 mt-2"
    style={{
      fontFamily: "'Great Vibes', cursive",
      color: "#111111",
      letterSpacing: "2px",
      whiteSpace: "nowrap",
    }}
  >
    "Hôn nhân là chuyện cả đời,"
  </p>
  <p
    className="text-xl sm:text-xl mb-3 mt-2"
    style={{
      fontFamily: "'Great Vibes', cursive",
      color: "#111111",
      letterSpacing: "2px",
      whiteSpace: "nowrap",
    }}
  >
    "Yêu người vừa ý, cưới người mình thương..."
  </p>
</section>

{/* Thông báo */}
<section
  id="quote2"
  data-animate
  className={`px-7 sm:px-7 py-2 text-center transition-all duration-700 delay-300 ${
    isVisible("quote2") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
  }`}
>
  <p
    className="text-sm sm:text-sm mb-2 mt-2"
    style={{
      fontFamily: "'Montserrat', sans-serif",
      color: "#5d2c2cff",
      letterSpacing: "2px",
      whiteSpace: "nowrap",
    }}
  >
    TRÂN TRỌNG THÔNG BÁO LỄ THÀNH HÔN
  </p>
</section>

{/* Parents */}
<section
  id="parents1"
  data-animate
  className={`px-4 sm:px-4 py-3 transition-all duration-700 delay-500 ${
    isVisible("parents1") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
  }`}
>
  <div className="grid grid-cols-2 gap-4 sm:gap-4 text-center">
    <div>
      <h4
        className="text-sm sm:text-sm font-semibold mb-2 sm:mb-2"
        style={{ color: "#111111", fontFamily: "'Montserrat', sans-serif" }}
      >
        NHÀ TRAI
      </h4>
      <p className="text-xs sm:text-xs mb-1" style={{ color: "#111111", fontFamily: "'Montserrat', sans-serif" }}>
        ÔNG: {data.groomFatherName}
      </p>
      <p className="text-xs sm:text-xs" style={{ color: "#111111", fontFamily: "'Montserrat', sans-serif" }}>
        BÀ: {data.groomMotherName}
      </p>
      <p className="mt-2.5 text-xs sm:text-xs" style={{ color: "#726060ff", fontFamily: "'Montserrat', sans-serif" }}>
        THÔN PHÚ LỘC 2, PHÚ TRẠCH, QUẢNG TRỊ
      </p>
    </div>
    <div>
      <h4
        className="text-sm sm:text-sm font-semibold mb-2 sm:mb-2"
        style={{ color: "#111111", fontFamily: "'Montserrat', sans-serif" }}
      >
        NHÀ GÁI
      </h4>
      <p className="text-xs sm:text-sm mb-1" style={{ color: "#111111", fontFamily: "'Montserrat', sans-serif" }}>
        ÔNG: {data.brideFatherName}
      </p>
      <p className="text-xs sm:text-xs" style={{ color: "#111111", fontFamily: "'Montserrat', sans-serif" }}>
        BÀ: {data.brideMotherName}
      </p>
      <p className="mb-5 mt-2.5 text-xs sm:text-xs" style={{ color: "#726060ff", fontFamily: "'Montserrat', sans-serif" }}>
        THÔN PHÚC KIỀU, HÒA TRẠCH, QUẢNG TRỊ
      </p>
    </div>
  </div>
</section>


<section
  id="parents2"
  data-animate
  className={`relative w-full px-4 sm:px-4 py-3 transition-all duration-700 delay-700 ${
    isVisible("parents2") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
  }`}
>
  {/* HeartImage nằm giữa màn hình */}
  <div className="absolute top-[-17px] left-1/2 transform -translate-x-1/2 z-20 w-full flex justify-center">
    <HeartImage />
  </div>

  <div className="grid grid-cols-2 gap-4 sm:gap-4 text-center">
    <div>
      <h4
        className="mb-3 text-xl sm:text-xl font-normal mb-2 sm:mb-3"
        style={{ color: "#4d4848ff", fontFamily: "'Montserrat', sans-serif" }}
      >
        Chú Rể
      </h4>
      <h4
        className="text-3xl sm:text-3xl font-normal mb-2 sm:mb-3"
        style={{ color: "#934040ff", fontFamily: "'Great Vibes', cursive" }}
      >
        Khánh Nam
      </h4>
    </div>
    <div>
      <h4
        className="text-xl mb-3 sm:text-xl font-normal mb-2 sm:mb-2"
        style={{ color: "#4d4848ff", fontFamily: "'Montserrat', sans-serif" }}
      >
        Cô Dâu
      </h4>
      <h4
        className="text-4xl sm:text-4xl font-normal mb-2 sm:mb-2"
        style={{ color: "#934040ff", fontFamily: "'Great Vibes', cursive" }}
      >
        Lan Nhi
      </h4>
    </div>
  </div>
</section>



       {/* Gallery grid (small 2-image block) */}
      <section id="gallery-grid-1" data-animate className={`px-2 py-1 transition-all duration-1700 overflow-hidden ${isVisible("gallery-grid-1") ? "opacity-100" : "opacity-0"}`}>
        <div className="grid grid-cols-2 gap-3">
          {[data.gallery?.[11], data.gallery?.[7]].map((photo, index) => {
            const { src, blur } = optimizedPathFor(photo)
            return (
              <div key={index} className={`w-full flex items-center justify-center transition-opacity transition-transform duration-700 ${isVisible("gallery-grid-1") ? "translate-x-0 opacity-100" : index === 0 ? "-translate-x-6 opacity-0" : "translate-x-6 opacity-0"}`} style={{ transitionDelay: `${index * 100}ms`, willChange: "transform, opacity" }}>
                <div className="relative w-full">
                  <Image
                    src={src}
                    alt={`Gallery ${index + 1}`}
                    width={800}
                    height={1200}
                    sizes="(max-width: 768px) 50vw, 400px"
                    className="w-full h-auto object-contain rounded-sm"
                    {...(blur ? { placeholder: "blur", blurDataURL: blur } : {})}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <div className="flex justify-center my-6"><div className="w-75 h-[1.5px] bg-[#111111] opacity-60" /></div>

    {/* Invitation Text */}
<section
  id="quote1"
  data-animate
  className="px-2 sm:px-2 py-2 text-center overflow-hidden"
>
  {/* Tiêu đề - từ trái vào */}
  <p
    className={`text-xl sm:text-xl mb-6 mt-2 transition-all duration-700 ${
      isVisible("quote1") ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
    }`}
    style={{
      fontFamily: "'Montserrat', sans-serif",
      color: "#111111",
      letterSpacing: "2px",
      whiteSpace: "nowrap",
    }}
  >
    TRÂN TRỌNG KÍNH MỜI
  </p>

  {/* Tên khách - từ phải vào */}
  <p
    className={`text-2xl sm:text-2xl mb-6 transition-all duration-700 delay-200 ${
      isVisible("quote1") ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
    }`}
    style={{
      fontFamily: "'Great Vibes', cursive",
      color: "#874141ff",
      letterSpacing: "2px",
      whiteSpace: "nowrap",
    }}
  >
    {guestName ?? "quý khách"}
  </p>

  {/* Text phụ - fade-in từ dưới */}
  <p
    className={`text-base sm:text-base mt-2 transition-all duration-700 delay-400 ${
      isVisible("quote1") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
    }`}
    style={{
      fontFamily: "'Montserrat', sans-serif",
      color: "#353030ff",
      letterSpacing: "1px",
    }}
  >
    Đến dự bữa tiệc thân mật mừng hạnh phúc cùng gia đình chúng tôi
  </p>
</section>

{/* Gallery Images */}
<section id="gallery-grid" className="px-4 py-6 overflow-hidden">
  <div className="flex justify-center items-end gap-2 md:gap-2 max-w-[1200px] mx-auto">
    {(() => {
      const photos = [data.gallery?.[18], data.gallery?.[16], data.gallery?.[17]];
      return photos.map((photo, idx) => {
        const { src, blur } = optimizedPathFor(photo);
        const isCenter = idx === 1;

        // Animation thứ tự
        const animationDelay = isCenter ? "delay-[800ms]" : "delay-[500ms]";
        const fromClass = isCenter
          ? "opacity-0"
          : idx === 0
          ? "-translate-x-full opacity-0"
          : "translate-x-full opacity-0";
        const toClass = isCenter ? "opacity-100" : "translate-x-0 opacity-100";

        // Kích thước
        const width = isCenter ? "50%" : "40%";

        // Filter + shadow
        const styleEffect = isCenter
          ? {
              boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
              filter: "contrast(1.05) saturate(1.1)",
            }
          : {
              boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
              filter: "brightness(0.92) saturate(0.9) contrast(0.98)",
            };

        // Object position cho hai ảnh hai bên
        const objectPosition = isCenter
          ? "center center"
          : idx === 0
          ? "30% center"
          : "70% center";

        return (
          <div key={idx} style={{ width }} className={`relative transition-all duration-700 ${animationDelay}`}>
            <div
              className={`overflow-hidden rounded-md transition-all duration-700 ${isVisible("quote1") ? toClass : fromClass}`}
              style={{
                width: "100%",
                paddingBottom: "135%",
                position: "relative",
                ...styleEffect,
              }}
            >
              <Image
                src={src}
                alt={`Gallery ${idx + 1}`}
                fill
                priority
                sizes={
                  isCenter
                    ? "(max-width: 768px) 65vw, 500px"
                    : "(max-width: 768px) 32vw, 280px"
                }
                className="object-cover transition-transform duration-700 ease-out"
                {...(blur ? { placeholder: "blur", blurDataURL: blur } : {})}
                style={{
                  transform: isCenter ? "scale(1.05)" : "scale(1.02)",
                  objectPosition,
                }}
              />
            </div>
          </div>
        );
      });
    })()}
  </div>
</section>

{/* Tiệc cưới Nhà Gái */}
<section
  id="quote1"
  data-animate
  className={`px-7 sm:px-7 py-2 text-center transition-all duration-700 ${
    isVisible("quote1") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
  }`}
>
  <p
    className="text-[15px] sm:text-[15px] mt-2 relative inline-block transition-all duration-700 delay-200"
    style={{
      fontFamily: "'Montserrat', sans-serif",
      color: "#342a2aff",
      letterSpacing: "1px",
      whiteSpace: "nowrap",
      opacity: isVisible("quote1") ? 1 : 0,
      transform: isVisible("quote1") ? "translateY(0)" : "translateY(10px)",
    }}
  >
    TIỆC CƯỚI NHÀ GÁI
    <span
      className="absolute left-0 bottom-0 w-full h-[1px] bg-[#251a1aff] rounded-full transition-all duration-700"
      style={{
        transform: isVisible("quote1") ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left center",
      }}
    />
  </p>
</section>

{/* Ảnh chính giữa */}
<div className="relative bg-gray-100">
  <div
    className={`absolute left-[50%] top-[-100] translate-y-[-50%] z-20 transition-all duration-700 ${
      isVisible("quote1") ? "opacity-100 translate-x-0" : "opacity-0 -translate-y-10"
    }`}
  >
    <CustomImage />
  </div>
</div>

{/* Ảnh bên trái */}
<div className="relative bg-gray-100">
  <div
    className={`absolute left-[5%] top-[-15] translate-y-[-50%] z-20 transition-all duration-700 delay-100 ${
      isVisible("quote1") ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
    }`}
  >
    <CustomImage2 />
  </div>
</div>


{/* Thông tin lễ cưới */}
<section
  id="wedding-info-1"
  data-animate
  className="px-4 sm:px-4 py-6 sm:py-6 text-center overflow-hidden"
>
  {/* Thứ */}
  <p
    className={`text-xl sm:text-xl font-normal mb-4 transition-all duration-700 delay-300`}
    style={{
      fontFamily: "'Montserrat', sans-serif",
      color: "#564e4eff",
      opacity: isVisible("wedding-info-1") ? 1 : 0,
      transform: isVisible("wedding-info-1") ? "translateX(0)" : "translateX(-20px)",
    }}
  >
    THỨ BA
  </p>

  {/* Thời gian | Ngày | Năm */}
  <div className="flex justify-center items-center gap-7 mb-1 text-2xl sm:text-2xl font-normal">
    <span
      className="transition-all duration-700 delay-400"
      style={{
        fontFamily: "'Montserrat', sans-serif",
        color: "#564e4eff",
        opacity: isVisible("wedding-info-1") ? 1 : 0,
        transform: isVisible("wedding-info-1") ? "translateX(0)" : "translateX(-20px)",
      }}
    >
      11H00
    </span>

    <span className="border-l-2 border-gray-500 h-13" />

    <span
      className="text-6xl sm:text-6xl font-bold transition-all duration-700 delay-600"
      style={{
        fontFamily: "'Roboto Mono', monospace",
        lineHeight: 1,
        color: "#111",
        opacity: isVisible("wedding-info-1") ? 1 : 0,
        transform: isVisible("wedding-info-1") ? "scale(1)" : "scale(0.8)",
      }}
    >
      27
    </span>

    <span className="border-l-2 border-gray-500 h-13" />

    <span
      className="transition-all duration-700 delay-400"
      style={{
        fontFamily: "'Montserrat', sans-serif",
        color: "#564e4eff",
        opacity: isVisible("wedding-info-1") ? 1 : 0,
        transform: isVisible("wedding-info-1") ? "translateX(0)" : "translateX(20px)",
      }}
    >
      2026
    </span>
  </div>

  {/* Tháng */}
  <p
    className="text-xl sm:text-2l font-normal mt-3 mb-4 transition-all duration-700 delay-400"
    style={{
      fontFamily: "'Montserrat', sans-serif",
      color: "#564e4eff",
      opacity: isVisible("wedding-info-1") ? 1 : 0,
      transform: isVisible("wedding-info-1") ? "translateX(0)" : "translateX(-20px)",
    }}
  >
    Tháng 01
  </p>

  {/* Lịch âm */}
  <p
    className="text-sm sm:text-sm text-gray-600 mt-3 mb-3 transition-all duration-700 delay-600"
    style={{
      fontFamily: "'Montserrat', sans-serif",
      color: "#564e4eff",
      fontStyle: "italic",
      opacity: isVisible("wedding-info-1") ? 1 : 0,
      transform: isVisible("wedding-info-1") ? "translateY(0)" : "translateY(10px)",
    }}
  >
    (Tức ngày 09 tháng 12 năm Ất Tỵ)
  </p>

  {/* Địa điểm */}
  <p
    className="text-lg sm:text-lg font-semibold transition-all duration-700 delay-400"
    style={{
      fontFamily: "'Great Vibes', cursive",
      color: "#111111",
      letterSpacing: "2px",
      fontWeight: 300,
      opacity: isVisible("wedding-info-1") ? 1 : 0,
      transform: isVisible("wedding-info-1") ? "translateY(0)" : "translateY(10px)",
    }}
  >
    Nhà Văn Hóa Thôn Phúc Kiều
  </p>

  <a
    href="https://maps.app.goo.gl/kgoqhKQqiGUGzcJb7?g_st=ic"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block mt-4 px-6 py-1 text-sm rounded-full border border-[#111111] text-[#111111] transition-all duration-700 delay-600"
    style={{
      fontFamily: "'Montserrat', sans-serif",
      opacity: isVisible("wedding-info-1") ? 1 : 0,
      transform: isVisible("wedding-info-1") ? "translateY(0)" : "translateY(10px)",
    }}
  >
    CHỈ ĐƯỜNG
  </a>
</section>


{/* Tiệc cưới Nhà Trai */}
<section
  id="quote1"
  data-animate
  className={`px-7 sm:px-7 py-2 text-center transition-all duration-700 ${
    isVisible("quote1") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
  }`}
>
  <p
    className="text-[15px] sm:text-[15px] mt-2 relative inline-block transition-all duration-700 delay-100"
    style={{
      fontFamily: "'Montserrat', sans-serif",
      color: "#342a2aff",
      letterSpacing: "1px",
      whiteSpace: "nowrap",
      opacity: isVisible("quote1") ? 1 : 0,
      transform: isVisible("quote1") ? "translateY(0)" : "translateY(10px)",
    }}
  >
    TIỆC CƯỚI NHÀ TRAI
    <span
      className="absolute left-0 bottom-0 w-full h-[1px] bg-[#251a1aff] rounded-full transition-all duration-700"
      style={{
        transform: isVisible("quote1") ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left center",
      }}
    />
  </p>
</section>

{/* Ảnh chính giữa */}
<div className="relative bg-gray-100">
  <div
    className={`absolute left-[50%] top-[-100] translate-y-[-50%] z-20 transition-all duration-700 ${
      isVisible("quote1") ? "opacity-100 translate-x-0" : "opacity-0 -translate-y-10"
    }`}
  >
    <CustomImage />
  </div>
</div>

{/* Ảnh bên trái */}
<div className="relative bg-gray-100">
  <div
    className={`absolute left-[5%] top-[-15] translate-y-[-50%] z-20 transition-all duration-700 delay-100 ${
      isVisible("quote1") ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
    }`}
  >
    <CustomImage2 />
  </div>
</div>

{/* Thông tin lễ cưới */}
<section
  id="wedding-info-1"
  data-animate
  className="px-4 sm:px-4 py-6 sm:py-6 text-center overflow-hidden"
>
  {/* Thứ */}
  <p
    className="text-xl sm:text-xl font-normal mb-4 transition-all duration-700 delay-150"
    style={{
      fontFamily: "'Montserrat', sans-serif",
      color: "#564e4eff",
      opacity: isVisible("wedding-info-1") ? 1 : 0,
      transform: isVisible("wedding-info-1") ? "translateX(0)" : "translateX(-20px)",
    }}
  >
    THỨ TƯ
  </p>

  {/* 11H00 | 28 | 2026 */}
  <div className="flex justify-center items-center gap-7 mb-1 text-2xl sm:text-2xl font-normal">
    <span
      className="transition-all duration-700 delay-150"
      style={{
        fontFamily: "'Montserrat', sans-serif",
        color: "#564e4eff",
        opacity: isVisible("wedding-info-1") ? 1 : 0,
        transform: isVisible("wedding-info-1") ? "translateX(0)" : "translateX(-20px)",
      }}
    >
      11H00
    </span>

    <span className="border-l-2 border-gray-500 h-13" />

    <span
      className="text-6xl sm:text-6xl font-bold transition-all duration-700 delay-300"
      style={{
        fontFamily: "'Roboto Mono', monospace",
        lineHeight: 1,
        color: "#111",
        opacity: isVisible("wedding-info-1") ? 1 : 0,
        transform: isVisible("wedding-info-1") ? "scale(1)" : "scale(0.8)",
      }}
    >
      28
    </span>

    <span className="border-l-2 border-gray-500 h-13" />

    <span
      className="transition-all duration-700 delay-150"
      style={{
        fontFamily: "'Montserrat', sans-serif",
        color: "#564e4eff",
        opacity: isVisible("wedding-info-1") ? 1 : 0,
        transform: isVisible("wedding-info-1") ? "translateX(0)" : "translateX(20px)",
      }}
    >
      2026
    </span>
  </div>

  {/* Tháng */}
  <p
    className="text-xl sm:text-xl font-normal mt-3 mb-4 transition-all duration-700 delay-250"
    style={{
      fontFamily: "'Montserrat', sans-serif",
      color: "#564e4eff",
      opacity: isVisible("wedding-info-1") ? 1 : 0,
      transform: isVisible("wedding-info-1") ? "translateX(0)" : "translateX(-20px)",
    }}
  >
    Tháng 01
  </p>

  {/* Lịch âm */}
  <p
    className="text-sm sm:text-sm text-gray-600 mt-3 mb-3 transition-all duration-700 delay-200"
    style={{
      fontFamily: "'Montserrat', sans-serif",
      color: "#564e4eff",
      fontStyle: "italic",
      opacity: isVisible("wedding-info-1") ? 1 : 0,
      transform: isVisible("wedding-info-1") ? "translateY(0)" : "translateY(10px)",
    }}
  >
    (Tức ngày 10 tháng 12 năm Ất Tỵ)
  </p>

  {/* Địa điểm */}
  <p
    className="text-lg sm:text-lg font-semibold transition-all duration-700 delay-300"
    style={{
      fontFamily: "'Great Vibes', cursive",
      color: "#111111",
      letterSpacing: "2px",
      fontWeight: 300,
      opacity: isVisible("wedding-info-1") ? 1 : 0,
      transform: isVisible("wedding-info-1") ? "translateY(0)" : "translateY(10px)",
    }}
  >
    Tư Gia Nhà Trai
  </p>

  <a
    href="https://maps.app.goo.gl/QUsVsCprj56Gmcb76"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block mt-4 px-6 py-1 text-sm rounded-full border border-[#111111] text-[#111111] transition-all duration-700 delay-350"
    style={{
      fontFamily: "'Montserrat', sans-serif",
      opacity: isVisible("wedding-info-1") ? 1 : 0,
      transform: isVisible("wedding-info-1") ? "translateY(0)" : "translateY(10px)",
    }}
  >
    CHỈ ĐƯỜNG
  </a>
</section>


<div className="flex justify-center my-6"><div className="w-53 h-[3px] bg-[#531212ff] opacity-60" /></div>


<section
  id="quote1"
  data-animate
  className={`px-7 sm:px-7 py-2 text-center transition-all duration-1700 ${isVisible("quote1") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
>
  <p
    className="text-[17px] sm:text-[17px] mt-2 relative inline-block" // relative để pseudo-element hoạt động
    style={{
      fontFamily: "'Montserrat', sans-serif",
      color: "#342a2aff",
      letterSpacing: "1px",
      whiteSpace: "nowrap",
    }}
  >
    LỄ THÀNH HÔN
    {/* Gạch chân kéo dài bằng pseudo-element */}
    <span
      className="absolute left-0 bottom-0 w-full h-[1px] bg-[#251a1aff] rounded-full"
      style={{ transform: "translateY(0px)" }} // đẩy xuống một chút so với chữ
    />
  </p>
</section>

 <div className="relative bg-gray-100">
  <div className="absolute left-[50%] top-[-100] translate-y-[-50%] z-20">
    <CustomImage />
  </div>
</div>

 <div className="relative bg-gray-100">
  <div className="absolute left-[5%] top-[-15] translate-y-[-50%] z-20">
    <CustomImage2 />
  </div>
</div>

<section 
  id="wedding-info-1" 
  data-animate
  className="px-4 sm:px-4 py-6 sm:py-6 text-center"
>
  {/* THỨ SÁU */}
  <p
    className={`text-xl sm:text-xl font-normal mb-4 ${isVisible("wedding-info-1") ? "animated" : ""}`}
    style={{
      fontFamily: "'Montserrat', sans-serif",
      color: "#564e4eff",
      animation: isVisible("wedding-info-1") ? "slideRightFade 0.8s ease forwards" : "none",
      animationDelay: "0.5s",
      opacity: isVisible("wedding-info-1") ? 1 : 0,
    }}
  >
    THỨ TƯ
  </p>

  {/* 17H00 | 27 | 2026 */}
  <div className="flex justify-center items-center gap-7 mb-1 text-2xl sm:text-2xl font-normal" style={{ fontFamily: "'Montserrat', sans-serif", color: "#564e4eff" }}>
    <span
      style={{
        animation: isVisible("wedding-info-1") ? "slideLeftFade 0.8s ease forwards" : "none",
        animationDelay: "0.5s",
        opacity: isVisible("wedding-info-1") ? 1 : 0,
      }}
    >
      11H00
    </span>
    
    <span className="border-l-2 border-gray-500 h-13" />
    
    <span
      className="text-6xl sm:text-6xl font-bold relative"
      style={{
        fontFamily: "'Roboto Mono', monospace",
        lineHeight: 1,
        color: "#111",
        animation: isVisible("wedding-info-1") ? "scaleCenterFade 0.8s ease forwards" : "none",
        animationDelay: "1.2s",
        opacity: isVisible("wedding-info-1") ? 1 : 0,
      }}
    >
      28
    </span>
    
    <span className="border-l-2 border-gray-500 h-13" />
    
    <span
      style={{
        animation: isVisible("wedding-info-1") ? "slideRightFade 0.8s ease forwards" : "none",
        animationDelay: "0.5s",
        opacity: isVisible("wedding-info-1") ? 1 : 0,
      }}
    >
      2026
    </span>
  </div>

  {/* Tháng 01 */}
  <p
    className="text-xl sm:text-xl font-normal mt-3 mb-4"
    style={{
      fontFamily: "'Montserrat', sans-serif",
      color: "#564e4eff",
      animation: isVisible("wedding-info-1") ? "overshootLeft 0.8s ease-out forwards" : "none",
      animationDelay: "1.2s",
      opacity: isVisible("wedding-info-1") ? 1 : 0,
    }}
  >
    Tháng 01
  </p>

  {/* Lịch âm */}
  <p
    className="text-sm sm:text-sm text-gray-600 mt-3  mb-3"
    style={{
      fontFamily: "'Montserrat', sans-serif",
      color: "#564e4eff",
      fontStyle: "italic",
      animation: isVisible("wedding-info-1") ? "slideUpFade 0.8s ease forwards" : "none",
      animationDelay: "0.6s",
      opacity: isVisible("wedding-info-1") ? 1 : 0,
    }}
  >
    (Tức ngày 10 tháng 12 năm Ất Tỵ)
  </p>
        <p className="text-lg sm:text-lg font-semibold " style={{ fontFamily: "'Great Vibes', cursive", color: "#111111", letterSpacing: "2px", fontSize: "20px", whiteSpace: "nowrap", fontWeight: "300" }}>Tư Gia Nhà Trai</p>
        <a href="https://maps.app.goo.gl/QUsVsCprj56Gmcb76" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 px-6 py-1 text-sm rounded-full border border-[#111111] text-[#111111]" style={{ fontFamily: "'Montserrat', sans-serif" }}>CHỈ ĐƯỜNG</a>
</section>

<div
  className="falling-title"
  style={{
    fontFamily: "'Great Vibes', cursive",
    fontSize: "30px",
    color: "rgba(75, 75, 71, 1)",
    lineHeight: "normal",
    fontWeight: "normal",
    letterSpacing: "4px",
    marginLeft: "20px",
    marginTop: "20px",
  }}
>
  Từ giảng đường...
</div>

<div
  className="falling-title"
  style={{
    fontFamily: "'Great Vibes', cursive",
    fontSize: "30px",
    color: "rgba(75, 75, 71, 1)",
    lineHeight: "normal",
    fontWeight: "normal",
    letterSpacing: "4px",
    marginLeft: "auto",   // đẩy sang phải
    marginRight: "20px",  // khoảng cách từ cạnh phải
    marginTop: "20px",
    textAlign: "right",   // căn chữ bên trong sang phải
  }}
>
  ...Đến lễ đường
</div>


<div
  className="falling-title"
  style={{
    fontFamily: "'Great Vibes', cursive",
    fontSize: "35px",
    color: "rgba(75, 75, 71, 1)",
    lineHeight: "normal",
    fontWeight: "normal",
    letterSpacing: "4px",
    marginLeft: "20px",
    marginTop: "20px",
  }}
>
  Chuyện kể rằng.....
</div>

<style jsx>{`
  @keyframes fallDown {
    0% {
      transform: translateY(-50px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .falling-title {
    animation: fallDown 1s ease-out forwards;
  }
`}</style>


<div
  style={{
    backgroundImage: "url('https://assets.cinelove.me/uploads/0f767b27-a71b-47a7-9e12-f4992f0c79f7/37db6e41-b641-49da-ab9c-e32958637d53.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "75px",       // chỉnh kích thước theo ý bạn
    height: "75px",
    borderRadius: "0px",
    animation: "floatUpDown 3s ease-in-out infinite",
    marginLeft: "300px", // di chuyển sang phải
    marginTop: "-50px"   
  }}
></div>

<style jsx>{`
  @keyframes floatUpDown {
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); } /* di chuyển lên 10px */
    100% { transform: translateY(0); }
  }
`}</style>

<div
  style={{
    fontFamily: "'Roboto', sans-serif fontWeight: 100",
    fontSize: "14px",                    
    color: "rgba(62, 62, 59, 0.9)",      
    textAlign: "left",                   // căn lề phải
    lineHeight: "1.6",                    
    letterSpacing: "1px",                 
    maxWidth: "800px",                    
    margin: "0 auto",                     
    padding: "1rem",   
    marginLeft: "10px", // di chuyển sang phải
    marginTop: "-13px"                   
  }}
><p style={{ fontSize: "17px", fontWeight: "normal", marginBottom: "0.3rem" }}>
  Nam & Nhi!
</p>

<p style={{ marginBottom: "0.5rem" }}>
  Chúng mình gặp nhau từ những ngày còn ngồi học chung ở cấp 3. Khi ấy chỉ là những buổi học nhóm, những câu chuyện nhỏ xíu của tuổi học trò, nhưng không ngờ lại gieo nên một tình cảm theo chúng mình đến tận hôm nay. Qua thời gian, chúng mình trưởng thành cùng nhau, đi qua nhiều thay đổi, và cuối cùng nhận ra: người mình muốn ở cạnh nhất… vẫn là người bạn học năm nào.
</p>

<p style={{ marginTop: "-0.3rem" }}>
  Và hôm nay, chúng mình quyết định viết tiếp câu chuyện ấy bằng một lời hứa chung đường, chung nhà, chung tương lai.
</p>

</div>


{/* Container bọc toàn bộ */}
      <div
        style={{
          position: "relative",   // để dễ di chuyển bằng top/left
          top: "40px",             // có thể thay đổi để đẩy xuống
          left: "260px",            // có thể thay đổi để đẩy sang phải
          display: "inline-block",
        }}
      >
        <div
          style={{
            letterSpacing: "2px",
            fontFamily: "'Great Vibes', cursive",
            fontSize: "22px",
            color: "#4b8da1ff",
            display: "inline-block",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: "36px", // chữ T to hơn
              display: "inline-block",
              animationName: "float",
              animationDuration: "2s",
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              transformOrigin: "center",
            }}
          >
            T
          </span>
          <span
            style={{
              display: "inline-block",
              animationName: "float",
              animationDuration: "2s",
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              transformOrigin: "center",
            }}
          >
            háng 1
          </span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0); }
        }
      `}</style>

<div style={{ position: "relative", width: "185px", height: "120px" }}>
  {/* Phong thư */}
  <div
    style={{
      position: "absolute", // bắt buộc để top/left hoạt động
      width: "200px",
      height: "140px",
      backgroundImage:
        "url('https://assets.cinelove.me/uploads/0f767b27-a71b-47a7-9e12-f4992f0c79f7/2028f8ab-3cae-4853-97ae-5380c54e70c6.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      borderRadius: "0px",
      top: "30%",
      left: "62%",   // đặt vào giữa container
      transform: "translate(-50%, -50%)", // dịch để căn giữa thật sự
    }}
  ></div>

  {/* Ảnh đè lên chính giữa phong thư */}
  <div
    style={{
      width: "43px",
      height: "44px",
      backgroundImage:
        "url('https://assets.cinelove.me/uploads/0f767b27-a71b-47a7-9e12-f4992f0c79f7/01e5dde4-fed6-4248-9157-59aac5e1d7b3.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      borderRadius: "0px",
      position: "absolute",
      top: "50%",
      left: "71%",
      transform: "translate(-50%, -50%)", // căn giữa chính xác
      zIndex: 4, // đảm bảo nằm trên phong thư
    }}
  ></div>

  {/* Bông hoa nghiêng */}
  <div
    style={{
      width: "103px",
      height: "151px",
      backgroundImage:
        "url('https://assets.cinelove.me/uploads/0f767b27-a71b-47a7-9e12-f4992f0c79f7/8b805af0-d7a0-44d1-b61e-f9e0deaf1be6.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      borderRadius: "0px",
      position: "absolute",
      left: "195px",  // điều chỉnh vị trí
      top: "-110px",    // điều chỉnh vị trí
      transform: "rotate(15deg)", // nghiêng 10 độ
      zIndex: 2,       // đè lên phong thư
    }}
  ></div>
</div>

<div
  style={{
    width: "228px",
    height: "158px",
    position: "relative",
    backgroundImage:
      "url('https://assets.cinelove.me/uploads/0f767b27-a71b-47a7-9e12-f4992f0c79f7/c908dda2-9fe9-4b45-8bc2-d037553ab85d.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "0px",
    overflow: "hidden",
    fontFamily: '"Times New Roman", serif',
    left: "143px",
    top: "-89px",
    zIndex: 3,
  }}
>
  <div
    className="calendar-overlay"
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "stretch",
      padding: "6px 8px",
      boxSizing: "border-box",
      color: "#4870a3",
      fontSize: "13px",
      zIndex: 2,
    }}
  >
    {rows.map((row, rowIndex) => (
      <div
        key={rowIndex}
        className="calendar-row"
        style={{
          display: "flex",
          gap: "4px",
          alignItems: "center",
          paddingLeft: rowIndex === 0 ? "50%" : "0",
          justifyContent: rowIndex === 0 ? "flex-start" : "center",
          flexWrap: "nowrap",
          marginBottom: rowIndex === rows.length - 1 ? 0 : "4px",
        }}
      >
        {row.map((day) => {
          const highlightedDays = [27, 28]; // các ngày có hiệu ứng
          const isHighlighted = highlightedDays.includes(day);

          return (
            <div
              key={day}
              style={{
                position: "relative",
                width: "27px",
                height: "27px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                lineHeight: "1",
              }}
            >
              {isHighlighted && (
                <img
                  src="https://assets.cinelove.me/assets/plugins/calen_heart_1.png"
                  alt="heart"
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "22px",
                    height: "22px",
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                />
              )}

              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  color: isHighlighted ? "#fff" : undefined,
                  fontWeight: isHighlighted ? 700 : 400,
                  textShadow: isHighlighted
                    ? "0 0 2px rgba(0,0,0,0.5)"
                    : "none",
                }}
              >
                {day}
              </div>
            </div>
          );
        })}
      </div>
    ))}
  </div>
</div>


      {/* Gallery photo (not full screen) */}
<section
  id="gallery-2"
  data-animate
  className={`px-4 overflow-hidden transition-all duration-700 overflow-hidden ${
    isVisible("gallery-2") ? "opacity-100" : "opacity-0"
  }`}
   style={{
    marginTop: "-97px", // ⭐ kéo ảnh lên để bị lịch đè
    position: "relative",
    zIndex: 1,
  }}
>
  <div className="w-full flex items-center justify-center">
    {[data.gallery?.[1]].map((photo, index) => {
      const { src, blur } = optimizedPathFor(photo)
      return (
        <div
          key={index}
          className={`w-full flex items-center justify-center transition-opacity transition-transform duration-700 ${
            isVisible("gallery-2")
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
          style={{
            transitionDelay: `${index * 100}ms`,
            willChange: "transform, opacity",
          }}
        >
                    <div className="relative w-full mx-auto" style={{  maxHeight: "none" }}>
            <Image
              src={src}
              alt={`Gallery ${index + 1}`}
              width={1920}
              height={1440}
              sizes="(max-width: 768px) 100vw, 1920px"
              className="w-full h-auto object-contain rounded-sm"
              {...(blur ? { placeholder: "blur", blurDataURL: blur } : {})}
            />
          </div>
        </div>
      )
    })}
  </div>
</section>

{/* Countdown */}
{/* Countdown */}
<section
  id="countdown"
  data-animate
  className={`px-4 sm:px-4 py-8 sm:py-8 text-center transition-all duration-700 ${
    isVisible("countdown")
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-6"
  }`}
  style={{
    marginTop: "-65px", // ⭐ kéo ảnh lên để bị lịch đè
    position: "relative",
    zIndex: 2,
  }}
>
  <div className="flex justify-center gap-4 sm:gap-4">
    {countdownItems.map((item, index) => (
      <div
        key={index}
        className="flex flex-col items-center justify-center w-14 sm:w-14"
        style={{
           transform: "translateX(52px)",
          backgroundColor: "#7ba7b5ff",   // 🔵 nền xanh cho từng khối
          borderRadius: "6px",         // bo đúng khối
          padding: "10px 6px",
          boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
        }}
      >
        <div
          className="text-xl sm:text-xl font-bold mb-1"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            color: "#ffffff", // 🤍 chữ trắng
          }}
        >
          {item.value.toString().padStart(2, "0")}
        </div>

        <span
          className="text-xs sm:text-xs uppercase tracking-wide"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            color: "#ffffff",
            opacity: 0.9,
          }}
        >
          {item.label}
        </span>
      </div>
    ))}
  </div>
</section>

<section
  id="countdown-title"
  style={{
    position: "relative", // để zIndex & margin hoạt động ổn định
    zIndex: 7,
  }}
>
  <div
    style={{
      fontFamily: "'Great Vibes', cursive",
      fontSize: "40px",
      color: "rgba(75, 75, 71, 1)",
      lineHeight: "normal",
      fontWeight: "normal",
      letterSpacing: "4px",
      marginLeft: "120px", // dịch chữ sang phải
      marginTop: "-130px", // dịch chữ lên
    }}
  >
    <p
      style={{
        fontSize: "17px",
        fontWeight: "normal",
        marginBottom: "0.3rem",
      }}
    >
      Chỉ còn......
    </p>
  </div>
</section>


<section
  id="countdown-title"
  style={{
    position: "relative", // để zIndex & margin hoạt động ổn định
    zIndex: 7,
  }}
>
  <div
    style={{
      fontFamily: "'Great Vibes', cursive",
      fontSize: "50px",
      color: "rgba(75, 75, 71, 1)",
      lineHeight: "normal",
      fontWeight: "normal",
      letterSpacing: "4px",
        margin: "120px auto 0",  
     // dịch chữ lên
    }}
  >
    <p
      style={{
        fontSize: "30px",
        fontWeight: "normal",
        marginBottom: "0.3rem",
      }}
    >
      Album hình cưới.....
    </p>
  </div>
  </section>

<div
  data-transition-key="qu4_wt2pM9-fade-in-1.6-0-ease-out-false"
  data-node-id="qu4_wt2pM9"
  style={{
    transform: "none",
    opacity: 1,
    width: "auto",
    height: "auto",
    maxWidth: "420px",
    margin: "10px auto 0",
  }}
>
  {/* khung ngoài */}
  <div
    style={{
      position: "relative",
      width: "100%",
      boxSizing: "border-box",
      padding: "10px",
      border: "4px solid #4870a3",
      borderRadius: "8px",
    }}
  >
    <div className="photo-gallery-wrapper flex flex-col gap-3">
      {/* ẢNH CHÍNH */}
      <div
        className="relative flex-1 min-h-[200px] overflow-hidden rounded-2xl bg-gray-100"
        style={{ minHeight: 200 }}
      >
        {(() => {
          const photo = photos[selectedIndex]
          const { src, blur } = optimizedPathFor(photo)

          return (
            <Image
              src={src}
              alt={`Photo ${selectedIndex + 1}`}
              fill
              sizes="(max-width: 768px) 90vw, 400px"
              className="object-contain"
              priority
              {...(blur
                ? { placeholder: "blur", blurDataURL: blur }
                : {})}
            />
          )
        })()}

        {/* prev */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/85"
        >
          ‹
        </button>

        {/* next */}
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/85"
        >
          ›
        </button>

        {/* counter */}
        <div className="absolute top-2 right-2 text-xs bg-white/85 px-2 py-1 rounded-full">
          {selectedIndex + 1}/{photos.length}
        </div>
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-2 overflow-x-auto">
        {photos.map((photo, i) => {
          const { src, blur } = optimizedPathFor(photo)

          return (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0"
              style={{
                border:
                  i === selectedIndex
                    ? "2px solid #3b82f6"
                    : "2px solid transparent",
              }}
            >
              <Image
                src={src}
                alt={`Thumb ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
                {...(blur
                  ? { placeholder: "blur", blurDataURL: blur }
                  : {})}
              />
            </button>
          )
        })}
      </div>
    </div>
  </div>
</div>

  <div style={{ marginTop: 35 }}>
  <RSVPSection />
</div>

<div style={{ marginBottom: "20px"}}>
  <LoveCardTrigger />
</div>


<section
  id="countdown-title"
  style={{
    position: "relative",
    zIndex: 7,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",       // căn giữa ngang
    justifyContent: "center",   // căn giữa dọc
    marginTop: "20px",          // dịch chữ lên nếu cần
    textAlign: "center",
  }}
>
  <p
    style={{
      fontFamily: "'Great Vibes', cursive",
      fontSize: "27px",
      color: "rgba(49, 151, 182, 1)",
      lineHeight: "normal",
      fontWeight: "normal",
      letterSpacing: "4px",
      margin: "40px 0"
    }}
  >
    Gửi quà mừng cưới
  </p>
</section>


      {/* Last full-screen photo */}
      <section
  id="main-photo-end"
  data-animate
  className={`relative w-screen md:max-w-[60vw] mx-auto transition-all duration-1700 ease-out ${
    isVisible("main-photo-end") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
  }`}
  style={{ aspectRatio: "3/4" }}
>
  <div className="absolute inset-0 w-full h-full relative overflow-hidden">
    {(() => {
      const { src, blur } = optimizedPathFor("/anh26.jpg")
      return (
        <Image
          src={src}
          alt="Wedding couple"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover w-full h-full"
          {...(blur ? { placeholder: "blur", blurDataURL: blur } : {})}
        />
      )
    })()}
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
      <p className={`text-3xl sm:text-3xl transition-all duration-1700 ${isVisible("main-photo-end") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`} style={{ fontFamily: "'Great Vibes', cursive", color: "#ffffff", letterSpacing: "2px", marginBottom: "16px", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>Lời Cảm Ơn!</p>
      <p className={`text-sm sm:text-sm transition-all duration-1700 ${isVisible("main-photo-end") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`} style={{ fontFamily: "'Montserrat', sans-serif", color: "#ffffff", maxWidth: "420px", lineHeight: "1.7", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
        Trân trọng cảm ơn quý khách đã dành thời gian đến chung vui cùng gia đình chúng tôi.
      </p>
    </div>
  </div>
</section>



    </div>
  )
}
