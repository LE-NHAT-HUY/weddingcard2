"use client"

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

 const [activeWishes, setActiveWishes] = useState<Array<Wish & { 
  uniqueKey: string; 
  position: number  // ← THÊM position vào đây
}>>([])

  const wishIndexRef = useRef(0)

  // Trạng thái nhạc - BAN ĐẦU LÀ TẮT
  const [isMusicOn, setIsMusicOn] = useState(false)

  // Tạo audio element khi component mount
  useEffect(() => {
    // Tạo audio element nhưng KHÔNG phát ngay
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

  // XỬ LÝ CLICK ĐẦU TIÊN - CHỈ ÁP DỤNG CHO CLICK NGOÀI NÚT
  useEffect(() => {
  const enableMusicOnFirstTap = (e: Event) => {
    if (unlockedRef.current || !audioRef.current) return

    const target = e.target as HTMLElement
    const isMusicButton =
      target.closest('button[title*="nhạc"]') ||
      target.closest('button[aria-pressed]')

    // Nếu click vào nút nhạc lần đầu → chỉ unlock, KHÔNG phát nhạc.
    if (isMusicButton) {
      unlockedRef.current = true
    } else {
      // Nếu click ngoài → unlock + tự phát nhạc
      unlockedRef.current = true
      audioRef.current.play().then(() => {
        setIsMusicOn(true)
      }).catch(err => console.error(err))
    }

    // Sau khi unlock → gỡ listener
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

      if (data?.name) {
        setGuestName(data.name)
      }

      if (data?.honorific) {
  setGuestHonorific(data.honorific)
}

      // Ghi nhận mở thiệp
      fetch("/api/guests/opened", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      }).catch(() => {})
    }

    fetchGuest()
  }, [code])


  // XỬ LÝ NÚT TOGGLE
  const handleToggleMusic = (e: React.MouseEvent) => {
  e.stopPropagation()

  if (!unlockedRef.current) {
    unlockedRef.current = true
  }

  if (!audioRef.current) return

  // Nếu đang bật → TẮT
  if (isMusicOn) {
    audioRef.current.pause()
    setIsMusicOn(false)
    return
  }

  // Nếu đang tắt → BẬT
  audioRef.current.play().catch(err => console.error(err))
  setIsMusicOn(true)
}


  // ... phần còn lại giữ nguyên ...
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
      {
        threshold: [0.5],
        root: null,
        rootMargin: "0px 0px -10% 0px",
      },
    )

    const sections = containerRef.current?.querySelectorAll("[data-animate]")
    sections?.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  const isVisible = (id: string) => visibleSections.has(id)

  const formatCountdown = () => {
    if (!data.weddingDate) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const wedding = new Date(
      `${data.weddingDate}T${data.weddingTime || "12:00"}`,
    )
    const now = new Date()
    const diff = wedding.getTime() - now.getTime()
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
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

  

 return (
  <div
    ref={containerRef}
    className="relative w-full md:max-w-md mx-auto h-screen overflow-y-scroll snap-y snap-mandatory"
    style={containerStyle}
  >

    {/* ================= FLOATING BUTTONS ================= */}
    
     <button
  onClick={handleToggleMusic}
  aria-pressed={isMusicOn}
  className="
    fixed
    top-4 right-4 sm:top-6 sm:right-6
    z-50
    bg-black/70
    shadow-lg
    rounded-full
    p-0.5
    hover:scale-105
    transition
  "
  title={isMusicOn ? "Tắt nhạc" : "Bật nhạc"}
>
  <img
    src="/audio-1.png"
    alt="music icon"
    className={`w-8 h-8 transition-all duration-500 ${
      isMusicOn ? "opacity-100 animate-spin" : "opacity-50"
    }`}
    style={isMusicOn ? { animationDuration: "3s" } : undefined}
  />
</button>


 <button
  onClick={onShowWishModal}
  style={{ backgroundColor: "#db9999" }}
  className="
    fixed
    bottom-6 right-4
    z-50
    text-white
    shadow-lg
    rounded-full
    p-3
      scale-95
    hover:scale-105
    transition
  "
  title="Gửi lời chúc"
>
  <Send className="w-5 h-5" />
</button>



  
      
        {/* First full-screen photo */}
       <section
      id="main-photo-start"
      data-animate
      className={`
        relative
        w-full
        h-screen
        md:relative
        md:w-full
        md:h-auto
        md:aspect-[3/4]
        md:max-h-[80vh]
        md:mx-auto
        md:my-8
        md:rounded-lg
        md:overflow-hidden
        md:shadow-lg
        transition-all
        duration-1700
        ease-out
        ${isVisible("main-photo-start") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      `}
      style={{
        // Reset các transform trên mobile
      }}
    >
      {/* Container for image */}
      <div className="relative w-full h-full md:h-full">
        <img
          src={data.coverPhoto || "/placeholder.svg"}
          alt="Wedding couple"
          className="
            w-full
            h-full
            object-cover
            md:object-contain
            md:object-center
          "
          loading="eager"
        />
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:from-transparent"></div>
      </div>

      {/* Text overlay */}
      <div className="
        absolute 
        bottom-[10%] 
        left-1/2 
        -translate-x-1/2 
        w-full 
        text-center 
        z-10
        px-4
      ">
        {/* Text content giữ nguyên */}
        <p
          className={`
            text-sm
            sm:text-base
            transition-all
            duration-1700
            ${isVisible("main-photo-start") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
          `}
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#ffffff",
            letterSpacing: "1px",
            marginBottom: "12px",
            textShadow: "0 2px 8px rgba(0,0,0,0.6)"
          }}
        >
          SAVE THE DATE
        </p>

        <p
          className={`
            text-xl
            sm:text-3xl
            md:text-4xl
            italic
            transition-all
            duration-1700
            ${isVisible("main-photo-start") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
          `}
          style={{
            fontFamily: "'Great Vibes', cursive",
            color: "#ffffff",
            letterSpacing: "2px",
            whiteSpace: "nowrap",
            textShadow: "0 2px 8px rgba(0,0,0,0.6)"
          }}
        >
          {data.groomName} & {data.brideName}
        </p>

        <p
          className={`
            mt-2
            text-sm
            sm:text-base
            md:text-lg
            transition-all
            duration-1700
            ${isVisible("main-photo-start") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
          `}
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#ffffff",
            letterSpacing: "1px",
            textShadow: "0 2px 8px rgba(0,0,0,0.6)"
          }}
        >
          {data.weddingDateA
            ? new Date(data.weddingDateA)
                .toLocaleDateString("vi-VN")
                .replace(/\//g, ".")
            : "28.01.2026"}
        </p>
      </div>
    </section>

        {/* Countdown */}
        <section
          id="countdown"
          data-animate
          className={`
            px-4
            sm:px-8
            py-8
            sm:py-10
            text-center
            transition-all
            duration-1700
            ${isVisible("countdown") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
          `}
        >
          <h3
            className="text-base sm:text-2xl mb-4 sm:mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: "#111111" }}
          >
            NGÀY TRỌNG ĐẠI ĐANG ĐẾN GẦN...
          </h3>

          <div className="flex justify-center gap-1 sm:gap-2">
            {countdownItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center w-16 sm:w-20"
              >
                <div
                  className="text-xl sm:text-2xl font-bold mb-1"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#111111" }}
                >
                  {item.value.toString().padStart(2, "0")}
                </div>
                <span
                  className="text-sm sm:text-base"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#111111" }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

       {/* Invitation text */}
<section
  id="quote1"
  data-animate
  className={`
    px-2
    sm:px-8
    py-2
    text-center
    transition-all
    duration-1700
    ${isVisible("quote1") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
  `}
>
  {/* Dòng 1: TRÂN TRỌNG KÍNH MỜI */}
  <p
    className="text-xl sm:text-3xl mb-5 mt-4"
    style={{
      fontFamily: "'Playfair Display', serif",
      color: "#111111",
      letterSpacing: "2px",
      whiteSpace: "nowrap",
    }}
  >
    TRÂN TRỌNG KÍNH MỜI
  </p>

  {/* Dòng 2: Tên khách */}
  <p
    className="text-2xl sm:text-3xl mb-2"
    style={{
      fontFamily: "'Great Vibes', cursive",
      color: "#111111",
      letterSpacing: "2px",
      whiteSpace: "nowrap",
    }}
  >
    {guestName ?? "quý khách"}
  </p>

  {/* Dòng 3: Nội dung mời dự */}
  <p
    className="text-base sm:text-lg mt-2"
    style={{
      fontFamily: "'Playfair Display', serif",
      color: "#111111",
      letterSpacing: "1px",
    }}
  >
    Đến dự bữa tiệc thân mật mừng hạnh phúc cùng gia đình chúng tôi
  </p>
</section>


        {/* Gallery grid */}
        <section
          id="gallery-grid-1"
          data-animate
          className={`
            px-4
            py-3
            transition-all
            duration-1700
            overflow-hidden
            ${isVisible("gallery-grid-1") ? "opacity-100" : "opacity-0"}
          `}
        >
          <div className="grid grid-cols-2 gap-3">
            {[data.gallery?.[11], data.gallery?.[7]].map((photo, index) => (
              <div
                key={index}
                className={`
                  w-full
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-1700
                  ${isVisible("gallery-grid-1") ? "translate-x-0 opacity-100" : index === 0 ? "-translate-x-6 opacity-0" : "translate-x-6 opacity-0"}
                `}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
               <img
                  src={photo || "/placeholder.svg"}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-auto object-contain rounded-sm"
                />

              </div>
            ))}
          </div>
        </section>

        {/* Parents */}
        <section
          id="parents"
          data-animate
          className={`
            px-4
            sm:px-8
            py-3
            transition-all
            duration-1700
            ${isVisible("parents") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
          `}
        >
          <div className="grid grid-cols-2 gap-4 sm:gap-8 text-center">
            <div>
              <h4
                className="text-sm sm:text-lg font-semibold mb-2 sm:mb-3"
                style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}
              >
                NHÀ TRAI
              </h4>
              <p
                className="text-xs sm:text-sm mb-1"
                style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}
              >
                Ông: {data.groomFatherName}
              </p>
              <p
                className="text-xs sm:text-sm"
                style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}
              >
                Bà: {data.groomMotherName}
              </p>
              <p
                className="text-sm sm:text-base font-medium mt-2"
                style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}
              >
                {data.groomFullName}
              </p>
            </div>

            <div>
              <h4
                className="text-sm sm:text-lg font-semibold mb-2 sm:mb-3"
                style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}
              >
                NHÀ GÁI
              </h4>
              <p
                className="text-xs sm:text-sm mb-1"
                style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}
              >
                Ông: {data.brideFatherName}
              </p>
              <p
                className="text-xs sm:text-sm"
                style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}
              >
                Bà: {data.brideMotherName}
              </p>
              <p
                className="text-sm sm:text-base font-medium mt-2"
                style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}
              >
                {data.brideFullName}
              </p>
            </div>
          </div>
        </section>

       {/* Wedding info */}
<section
  id="wedding-info-1"
  className="px-4 sm:px-8 py-6 sm:py-8 text-center"
>
  <div className="flex justify-center mb-3">
    <img
      src="/hi.png"
      alt="Bó hoa"
      className="w-14 h-auto opacity-90"
      loading="eager"
      decoding="async"
      draggable="false"
    />
  </div>

  {/* Animation chỉ cho tiêu đề */}
   <h3
              className="text-base sm:text-xl font-semibold mb-3"
              style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}
            >
              LỄ THÀNH HÔN
            </h3>

  <p
    className="mb-3 text-center"
    style={{
      color: "#111111",
      fontFamily: "'Playfair Display', serif",
      fontSize: "16px",
      lineHeight: "1.3",
    }}
  >
    VÀO LÚC{" "}
    <span
      style={{
        fontSize: "1em",
        fontFamily: "'Playfair Display', serif",
        position: "relative",
        top: "-2px",
      }}
    >
      11:00
    </span>{" "}
    – THỨ TƯ
  </p>

  <div className="flex flex-col items-center mb-1">
    <div className="w-20 h-[1px] bg-[#111111] mb-[2px]" />
    {/* Animation chỉ cho ngày */}
    <p
                className="text-xl sm:text-2xl tracking-widest leading-tight"
                style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}
              >
                {data.weddingDateA ? new Date(data.weddingDateA).toLocaleDateString("vi-VN").replace(/\//g, ".") : "28.01.2026"}
              </p>
    <div className="w-20 h-[1px] bg-[#111111] mt-[2px]" />
  </div>

  {data.lunarDate && (
    <p
      className="text-xs sm:text-sm text-gray-600 mt-0 mb-5 leading-tight"
      style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}
    >
      (TỨC NGÀY {data.lunarDate} ÂM LỊCH)
    </p>
  )}

  <MapPin
    className="w-7 h-7 sm:w-8 sm:h-8 mx-auto mb-2"
    style={{ color: data.accentColor }}
  />

  <p
    className="text-lg sm:text-2xl font-semibold mb-1"
    style={{
      fontFamily: "'Great Vibes', cursive",
      color: "#111111",
      letterSpacing: "2px",
      fontSize: "20px",
      whiteSpace: "nowrap",
      fontWeight: "300",
    }}
  >
    {data.venueName}
  </p>

  <p
    className="text-xs sm:text-sm text-gray-600 px-2"
    style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}
  >
    {data.venueAddress}
  </p>

  <a
    href="https://maps.app.goo.gl/QUsVsCprj56Gmcb76"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block mt-4 px-9 py-1 text-sm rounded-full border border-[#111111] text-[#111111]"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
    XEM BẢN ĐỒ
  </a>
</section>


        <div className="flex justify-center my-6">
          <div className="w-55 h-[1px] bg-[#111111] opacity-60" />
        </div>

        {/* Second wedding-info block (intentionally separate id) */}
        <section
          id="wedding-info-2"
          data-animate
          className={`
            px-4
            sm:px-8
            py-6
            sm:py-8
            text-center
            transition-all
            duration-1700
            ${isVisible("wedding-info-2") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
          `}
        >
          <div className="flex flex-col items-center text-center">
            <h3
              className="text-base sm:text-xl font-semibold mb-3"
              style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}
            >
              BỮA CƠM THÂN MẬT
            </h3>

            <p
              className="mb-3"
              style={{ color: "#111111", fontFamily: "'Playfair Display', serif", fontSize: "16px", lineHeight: "1.3" }}
            >
              VÀO LÚC{" "}
              <span style={{ fontSize: "1em", fontFamily: "'Playfair Display', serif", position: "relative", top: "-2px" }}>
                11:00
              </span>{" "}
              – THỨ TƯ
            </p>

            <div className="flex flex-col items-center mb-1">
              <div className="w-20 h-[1px] bg-[#111111] mb-[2px]" />
              <p
                className="text-xl sm:text-2xl tracking-widest leading-tight"
                style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}
              >
                {data.weddingDateA ? new Date(data.weddingDateA).toLocaleDateString("vi-VN").replace(/\//g, ".") : "28.01.2026"}
              </p>
              <div className="w-20 h-[1px] bg-[#111111] mt-[2px]" />
            </div>

            {data.lunarDate && (
              <p
                className="text-xs sm:text-sm text-gray-600 mt-0 mb-5 leading-tight"
                style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}
              >
                (TỨC NGÀY {data.lunarDate} ÂM LỊCH)
              </p>
            )}

            <MapPin className="w-7 h-7 sm:w-8 sm:h-8 mb-2" style={{ color: data.accentColor }} />

            <p
              className="text-lg sm:text-2xl font-semibold mb-1"
              style={{ fontFamily: "'Great Vibes', cursive", color: "#111111", letterSpacing: "2px", fontSize: "20px", whiteSpace: "nowrap", fontWeight: "300" }}
            >
              {data.venueName}
            </p>

            <p className="text-xs sm:text-sm text-gray-600 px-2" style={{ color: "#111111", fontFamily: "'Playfair Display', serif" }}>
              {data.venueAddress}
            </p>

            <a
              href="https://maps.app.goo.gl/QUsVsCprj56Gmcb76"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-9 py-1 text-sm rounded-full border border-[#111111] text-[#111111]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              XEM BẢN ĐỒ
            </a>
          </div>
        </section>

        {/* Section: Album Hình Cưới */}
<section
  id="gallery-grid"
  data-animate
  className="px-4 py-3 overflow-hidden"
>
  <div className="flex flex-col items-center text-center">
    {/* Tiêu đề */}
    <p
      className={`text-lg sm:text-2xl mt-10 font-semibold mb-6 transition-all duration-1000 ${
        isVisible("gallery-grid")
          ? "translate-y-0 opacity-100"
          : "translate-y-12 opacity-0"
      }`}
      style={{
        fontFamily: "'Great Vibes', cursive",
        color: "#111111",
        letterSpacing: "2px",
        fontSize: "30px",
        whiteSpace: "nowrap",
        fontWeight: "300",
        transitionDelay: "0ms", // delay đầu tiên
      }}
    >
      Album Hình Cưới
    </p>

    {/* Grid 4 ảnh */}
    <div className="grid grid-cols-2 gap-3 w-full">
  {[data.gallery?.[3], data.gallery?.[9], data.gallery?.[8], data.gallery?.[10]].map((photo, index) => {
    const delay = `${index * 500}ms`;
    return (
      <div
        key={index}
        className={`w-full flex items-center justify-center transition-all duration-2000 ${
          isVisible("gallery-grid")
            ? "translate-y-0 opacity-100"
            : "translate-y-12 opacity-0"
        }`}
        style={{ transitionDelay: delay }}
      >
        <img
          src={photo || "/placeholder.svg"}
          alt={`Gallery ${index + 1}`}
          className="w-full h-auto object-contain rounded-sm"
        />
      </div>
    );
  })}
</div>

  </div>
</section>


        <RSVPSection />

        <section
          id="gift-title"
          data-animate
          className={`
            px-4
            py-3
            overflow-hidden
            ${isVisible("gift-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
          `}
        >
          <div className="flex flex-col items-center text-center">
            <p
              className={`
                text-lg
                sm:text-2xl
                mt-2
                font-semibold
                mb-6
                transition-all
                duration-1700
                ${isVisible("gift-title") ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}
              `}
              style={{
                fontFamily: "'Great Vibes', cursive",
                color: "#111111",
                letterSpacing: "2px",
                fontSize: "30px",
                whiteSpace: "nowrap",
                fontWeight: "300",
              }}
            >
              Gửi Quà Mừng Cưới
            </p>
          </div>
        </section>

        <section
          id="donate-card"
          data-animate
          className={`
            w-full
            flex
            justify-center
            py-2
            -mt-6
            transition-all
            duration-1700
            ${isVisible("donate-card") ? "scale-100 opacity-100" : "scale-75 opacity-0"}
          `}
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <div className="w-[320px] h-[160px] border border-black/40 rounded-lg px-2 py-4 bg-transparent transform transition-all duration-1700 ease-out">
            <div className="flex items-center h-full">
              <div className="w-1/2 flex justify-center items-center">
                <img src="/donate.png" alt="QR Code" className="w-[140px] h-[140px] object-contain" />
              </div>

              <div className="w-1/2 flex flex-col justify-center px-2 text-[#111111]">
                <div className="border-b border-black pb-[2px] mb-[4px] font-semibold text-[13px] tracking-wide leading-relaxed">
                  LE KHANH NAM
                </div>

                <div className="text-[13px] mb-[4px] leading-relaxed">MB BANK</div>
                <div className="text-[13px] mb-[6px] tracking-wide leading-relaxed">88888888888</div>
                <div className="text-[12px] leading-relaxed opacity-90">
                  CẢM ƠN QUÝ KHÁCH ĐÃ GIÀNH TÌNH CẢM VÀ LỜI CHÚC PHÚC!
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Last full-screen photo */}
        <section
  id="main-photo-end"
  data-animate
  className={`
    relative
    w-screen
    h-screen
    md:w-full
    md:h-auto
    md:aspect-[3/4]
    md:max-h-[80vh]
    md:mx-auto
    md:my-8
    md:rounded-lg
    md:overflow-hidden
    md:shadow-lg
    transition-all
    duration-1700
    ease-out
    ${isVisible("main-photo-end") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
  `}
>
  {/* Container ảnh */}
  <div className="absolute inset-0 w-full h-full">
    <img
      src={'anh14.jpg'}
      alt="Wedding couple"
      className="w-full h-full object-cover block"
      loading="eager"
    />

    {/* Overlay gradient nếu cần */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

    {/* Text overlay */}
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
      <p
        className={`
          text-3xl
          sm:text-5xl
          transition-all
          duration-1700
          ${isVisible("main-photo-end") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
        `}
        style={{
          fontFamily: "'Great Vibes', cursive",
          color: "#ffffff",
          letterSpacing: "2px",
          marginBottom: "16px",
          textShadow: "0 2px 8px rgba(0,0,0,0.6)",
        }}
      >
        Lời Cảm Ơn!
      </p>

      <p
        className={`
          text-sm
          sm:text-base
          transition-all
          duration-1700
          ${isVisible("main-photo-end") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
        `}
        style={{
          fontFamily: "'Playfair Display', serif",
          color: "#ffffff",
          maxWidth: "420px",
          lineHeight: "1.7",
          textShadow: "0 2px 8px rgba(0,0,0,0.6)",
        }}
      >
        Trân trọng cảm ơn quý khách đã dành thời gian đến chung vui cùng gia đình chúng tôi.
      </p>
    </div>
  </div>
</section>

      </div>
  )
}
