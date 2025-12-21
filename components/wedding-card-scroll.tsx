"use client"

import Image from "next/image"
import type { WeddingData, Wish } from "@/lib/types"
import { useEffect, useRef, useState } from "react"
import { Heart, MapPin, Calendar, Volume2, Send } from "lucide-react"
import RSVPSection from "@/components/RSVPSection"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface WeddingCardScrollProps {
  data: WeddingData
  onToggleMusic?: () => void
  onShowWishModal?: () => void
}

export default function WeddingCardScroll({
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
  const coverCandidate = data.coverPhoto || "/anh-nen1.jpg"
  const { src: coverPhotoOptimized, blur: coverBlur } = optimizedPathFor(coverCandidate)

  // Supabase / search params / state giữ nguyên
  const searchParams = useSearchParams()
  const code = searchParams.get("code")
  const supabase = createClient()

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
    audioRef.current = new Audio('/wedding-background-music.mp3')
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
    if (!code) return
    const fetchGuest = async () => {
      const { data } = await supabase
        .from("guests")
        .select("name, honorific")
        .eq("code", code)
        .single()
      if (data?.name) setGuestName(data.name)
      if (data?.honorific) setGuestHonorific(data.honorific)
    }
    fetchGuest()
  }, [code, supabase])

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
    backgroundColor: "#FFF8E1",
  }

  // ---------- render ----------
  return (
    <div
      ref={containerRef}
      className="relative w-full md:max-w-md mx-auto h-screen overflow-y-scroll snap-y snap-mandatory"
      style={containerStyle}
    >
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
      <section
        id="main-photo-start"
        data-animate
        className={`relative w-full h-screen md:relative md:w-full md:h-auto md:aspect-[3/4] md:max-h-[80vh] md:mx-auto md:my-8 md:rounded-lg md:overflow-hidden md:shadow-lg transition-all duration-1700 ease-out ${isVisible("main-photo-start") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        style={{ willChange: "opacity, transform" }}
      >
        <div className="relative w-full h-full md:h-full">
          <Image
            src={coverPhotoOptimized}
            alt="Wedding couple"
            fill
            priority
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1920px"
            className="object-cover md:object-contain md:object-center"
            {...(coverBlur ? { placeholder: "blur", blurDataURL: coverBlur } : {})}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:from-transparent"></div>
        </div>

        {/* Text overlay */}
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-full text-center z-10 px-4">
          <p className={`text-sm sm:text-base transition-opacity transition-transform duration-1000 ${isVisible("main-photo-start") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`} style={{ fontFamily: "'Playfair Display', serif", color: "#ffffff", letterSpacing: "1px", marginBottom: "12px", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
            SAVE THE DATE
          </p>

          <p className={`text-xl sm:text-3xl md:text-4xl italic transition-all duration-1700 ${isVisible("main-photo-start") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`} style={{ fontFamily: "'Great Vibes', cursive", color: "#ffffff", letterSpacing: "2px", whiteSpace: "nowrap", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
            {data.groomName} & {data.brideName}
          </p>

          <p className={`mt-2 text-sm sm:text-base md:text-lg transition-all duration-1700 ${isVisible("main-photo-start") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`} style={{ fontFamily: "'Playfair Display', serif", color: "#ffffff", letterSpacing: "1px", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
            {data.weddingDateA ? new Date(data.weddingDateA).toLocaleDateString("vi-VN").replace(/\//g, ".") : "28.01.2026"}
          </p>
        </div>
      </section>

      {/* Countdown */}
      <section id="countdown" data-animate className={`px-4 sm:px-8 py-8 sm:py-10 text-center transition-all duration-1700 ${isVisible("countdown") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        <h3 className="text-base sm:text-2xl mb-4 sm:mb-6" style={{ fontFamily: "'Playfair Display', serif", color: "#111111" }}>NGÀY TRỌNG ĐẠI ĐANG ĐẾN GẦN...</h3>
        <div className="flex justify-center gap-1 sm:gap-2">
          {countdownItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center justify-center w-16 sm:w-20">
              <div className="text-xl sm:text-2xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: "#111111" }}>{item.value.toString().padStart(2, "0")}</div>
              <span className="text-sm sm:text-base" style={{ fontFamily: "'Playfair Display', serif", color: "#111111" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery photo (not full screen) */}
{/* Gallery photo (not full screen) */}
<section
  id="gallery-2"
  data-animate
  className={`px-4 py-4 transition-all duration-1700 overflow-hidden ${
    isVisible("gallery-2") ? "opacity-100" : "opacity-0"
  }`}
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
          <div className="relative w-[75%] mx-auto" style={{ maxHeight: "60vh" }}>
            <Image
              src={src}
              alt={`Gallery ${index + 1}`}
              width={1280} // chiều rộng ảnh tối ưu
              height={960} // chiều cao ảnh tối ưu
              sizes="(max-width: 768px) 75vw, 800px"
              className="w-full h-auto object-contain rounded-sm"
              {...(blur ? { placeholder: "blur", blurDataURL: blur } : {})}
            />
          </div>
        </div>
      )
    })}
  </div>
</section>



      

      {/* Invitation text */}
      <section id="quote1" data-animate className={`px-2 sm:px-8 py-2 text-center transition-all duration-1700 ${isVisible("quote1") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        <p className="text-xl sm:text-3xl mb-6 mt-2" style={{ fontFamily: "'Playfair Display', serif", color: "#111111", letterSpacing: "2px", whiteSpace: "nowrap" }}>TRÂN TRỌNG KÍNH MỜI</p>
        <p className="text-2xl sm:text-3xl mb-6" style={{ fontFamily: "'Great Vibes', cursive", color: "#111111", letterSpacing: "2px", whiteSpace: "nowrap" }}>{guestName ?? "quý khách"}</p>
        <p className="text-base sm:text-lg mt-2" style={{ fontFamily: "'Playfair Display', serif", color: "#111111", letterSpacing: "1px" }}>Đến dự bữa tiệc thân mật mừng hạnh phúc cùng gia đình chúng tôi</p>
      </section>

      {/* Gallery grid (small 2-image block) */}
      <section id="gallery-grid-1" data-animate className={`px-4 py-3 transition-all duration-1700 overflow-hidden ${isVisible("gallery-grid-1") ? "opacity-100" : "opacity-0"}`}>
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

      {/* Parents */}
      <section id="parents" data-animate className={`px-4 sm:px-8 py-3 transition-all duration-1700 ${isVisible("parents") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        <div className="grid grid-cols-2 gap-4 sm:gap-8 text-center">
          <div>
            <h4 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-3" style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}>NHÀ TRAI</h4>
            <p className="text-xs sm:text-sm mb-1" style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}>Ông: {data.groomFatherName}</p>
            <p className="text-xs sm:text-sm" style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}>Bà: {data.groomMotherName}</p>
            <p className="text-sm sm:text-base font-medium mt-2" style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}>{data.groomFullName}</p>
          </div>
          <div>
            <h4 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-3" style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}>NHÀ GÁI</h4>
            <p className="text-xs sm:text-sm mb-1" style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}>Ông: {data.brideFatherName}</p>
            <p className="text-xs sm:text-sm" style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}>Bà: {data.brideMotherName}</p>
            <p className="text-sm sm:text-base font-medium mt-2" style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}>{data.brideFullName}</p>
          </div>
        </div>
      </section>

      {/* Wedding info (first block) */}
      <section id="wedding-info-1" className="px-4 sm:px-8 py-6 sm:py-8 text-center">
        <div className="flex justify-center mb-3">
          <img src="/hi.png" alt="Bó hoa" className="w-14 h-auto opacity-90" loading="eager" decoding="async" draggable="false" />
        </div>
        <h3 className="text-base sm:text-xl font-semibold mb-3" style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}>LỄ THÀNH HÔN</h3>
        <p className="mb-3" style={{ color: "#111111", fontFamily: "'Playfair Display', serif", fontSize: "16px", lineHeight: "1.3" }}>
          VÀO LÚC <span style={{ fontSize: "1em", fontFamily: "'Playfair Display', serif", position: "relative", top: "-2px" }}>11:00</span> – THỨ TƯ
        </p>
        <div className="flex flex-col items-center mb-1">
          <div className="w-20 h-[1px] bg-[#111111] mb-[2px]" />
          <p className="text-xl sm:text-2xl tracking-widest leading-tight" style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}>{data.weddingDateA ? new Date(data.weddingDateA).toLocaleDateString("vi-VN").replace(/\//g, ".") : "28.01.2026"}</p>
          <div className="w-20 h-[1px] bg-[#111111] mt-[2px]" />
        </div>
        {data.lunarDate && <p className="text-xs sm:text-sm text-gray-600 mt-0 mb-5 leading-tight" style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}>(TỨC NGÀY {data.lunarDate} ÂM LỊCH)</p>}
        <MapPin className="w-7 h-7 sm:w-8 sm:h-8 mx-auto mb-2" style={{ color: data.accentColor }} />
        <p className="text-lg sm:text-2xl font-semibold mb-1" style={{ fontFamily: "'Great Vibes', cursive", color: "#111111", letterSpacing: "2px", fontSize: "20px", whiteSpace: "nowrap", fontWeight: "300" }}>{data.venueName}</p>
        <p className="text-xs sm:text-sm text-gray-600 px-2" style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}>{data.venueAddress}</p>
        <a href="https://maps.app.goo.gl/QUsVsCprj56Gmcb76" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 px-9 py-1 text-sm rounded-full border border-[#111111] text-[#111111]" style={{ fontFamily: "'Playfair Display', serif" }}>XEM BẢN ĐỒ</a>
      </section>

      <div className="flex justify-center my-6"><div className="w-55 h-[1px] bg-[#111111] opacity-60" /></div>

      {/* Second wedding-info block */}
      <section id="wedding-info-2" data-animate className={`px-4 sm:px-8 py-6 sm:py-8 text-center transition-all duration-1700 ${isVisible("wedding-info-2") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        <div className="flex flex-col items-center text-center">
          <h3 className="text-base sm:text-xl font-semibold mb-3" style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}>BỮA CƠM THÂN MẬT</h3>
          <p className="mb-3" style={{ color: "#111111", fontFamily: "'Playfair Display', serif", fontSize: "16px", lineHeight: "1.3" }}>VÀO LÚC <span style={{ fontSize: "1em", fontFamily: "'Playfair Display', serif", position: "relative", top: "-2px" }}>11:00</span> – THỨ TƯ</p>
          <div className="flex flex-col items-center mb-1">
            <div className="w-20 h-[1px] bg-[#111111] mb-[2px]" />
            <p className="text-xl sm:text-2xl tracking-widest leading-tight" style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}>{data.weddingDateA ? new Date(data.weddingDateA).toLocaleDateString("vi-VN").replace(/\//g, ".") : "28.01.2026"}</p>
            <div className="w-20 h-[1px] bg-[#111111] mt-[2px]" />
          </div>
          {data.lunarDate && <p className="text-xs sm:text-sm text-gray-600 mt-0 mb-5 leading-tight" style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}>(TỨC NGÀY {data.lunarDate} ÂM LỊCH)</p>}
          <MapPin className="w-7 h-7 sm:w-8 sm:h-8 mb-2" style={{ color: data.accentColor }} />
          <p className="text-lg sm:text-2xl font-semibold mb-1" style={{ fontFamily: "'Great Vibes', cursive", color: "#111111", letterSpacing: "2px", fontSize: "20px", whiteSpace: "nowrap", fontWeight: "300" }}>{data.venueName}</p>
          <p className="text-xs sm:text-sm text-gray-600 px-2" style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}>{data.venueAddress}</p>
          <a href="https://maps.app.goo.gl/QUsVsCprj56Gmcb76" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 px-9 py-1 text-sm rounded-full border border-[#111111] text-[#111111]" style={{ fontFamily: "'Playfair Display', serif" }}>XEM BẢN ĐỒ</a>
        </div>
      </section>

      {/* Album Hình Cưới (4 ảnh grid) */}
      <section id="gallery-grid" data-animate className="px-4 py-3 overflow-hidden">
        <div className="flex flex-col items-center text-center">
          <p className={`text-lg sm:text-2xl mt-10 font-semibold mb-6 transition-all duration-1000 ${isVisible("gallery-grid") ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`} style={{ fontFamily: "'Great Vibes', cursive", color: "#111111", letterSpacing: "2px", fontSize: "30px", whiteSpace: "nowrap", fontWeight: "300", transitionDelay: "0ms" }}>Album Hình Cưới</p>

          <div className="grid grid-cols-2 gap-3 w-full">
            {[data.gallery?.[3], data.gallery?.[9], data.gallery?.[8], data.gallery?.[10]].map((photo, index) => {
              const { src, blur } = optimizedPathFor(photo)
              const delay = `${index * 500}ms`
              return (
                <div key={index} className={`w-full flex items-center justify-center transition-all duration-2000 ${isVisible("gallery-grid") ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`} style={{ transitionDelay: delay }}>
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
        </div>
      </section>

      <RSVPSection />

      {/* Gửi quà, donate card... giữ nguyên */}

      {/* Last full-screen photo */}
      <section id="main-photo-end" data-animate className={`relative w-screen h-screen md:w-full md:h-auto md:aspect-[3/4] md:max-h-[80vh] md:mx-auto md:my-8 md:rounded-lg md:overflow-hidden md:shadow-lg transition-all duration-1700 ease-out ${isVisible("main-photo-end") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        <div className="absolute inset-0 w-full h-full relative">
          {/* sử dụng ảnh tối ưu (anh14) */}
          {(() => {
            const { src, blur } = optimizedPathFor("/anh14.jpg")
            return <Image src={src} alt="Wedding couple" fill priority sizes="100vw" className="object-cover" {...(blur ? { placeholder: "blur", blurDataURL: blur } : {})} />
          })()}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
            <p className={`text-3xl sm:text-5xl transition-all duration-1700 ${isVisible("main-photo-end") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`} style={{ fontFamily: "'Great Vibes', cursive", color: "#ffffff", letterSpacing: "2px", marginBottom: "16px", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>Lời Cảm Ơn!</p>
            <p className={`text-sm sm:text-base transition-all duration-1700 ${isVisible("main-photo-end") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`} style={{ fontFamily: "'Playfair Display', serif", color: "#ffffff", maxWidth: "420px", lineHeight: "1.7", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
              Trân trọng cảm ơn quý khách đã dành thời gian đến chung vui cùng gia đình chúng tôi.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
