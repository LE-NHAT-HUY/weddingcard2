"use client";

import type { WeddingData } from "@/lib/types"
import { Heart } from "lucide-react"

interface WeddingCardProps {
  data: WeddingData
}

export default function WeddingCard({ data }: WeddingCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return { day: "", weekday: "", month: "", year: "" }
    const date = new Date(dateString)
    const weekdays = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"]
    const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
    return {
      day: date.getDate().toString().padStart(2, "0"),
      weekday: weekdays[date.getDay()],
      month: months[date.getMonth()],
      year: date.getFullYear().toString(),
    }
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return ""
    const [hours, minutes] = timeString.split(":")
    return `${hours} giờ ${minutes} phút`
  }

  const dateInfo = formatDate(data.weddingDate)

  return (
    <div
      className="relative bg-card rounded-lg shadow-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${data.primaryColor}10 0%, ${data.primaryColor}05 50%, ${data.accentColor}10 100%)`,
      }}
    >
      {/* Decorative Border */}
      <div
        className="absolute inset-0 border-[12px] rounded-lg pointer-events-none"
        style={{ borderColor: `${data.primaryColor}30` }}
      />

      {/* Floral Corner Decorations */}
      <FloralCorner position="top-left" color={data.primaryColor} />
      <FloralCorner position="top-right" color={data.primaryColor} />
      <FloralCorner position="bottom-left" color={data.primaryColor} />
      <FloralCorner position="bottom-right" color={data.primaryColor} />

      <div className="relative z-10 p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-sm uppercase tracking-[0.3em] mb-2" style={{ color: data.accentColor }}>
            Thiệp Mời
          </p>
          <h2 className="text-2xl md:text-3xl font-light tracking-wide" style={{ color: data.primaryColor }}>
            LỄ THÀNH HÔN
          </h2>
        </div>

        {/* Couple Names */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <div className="text-right">
              <p
                className="text-3xl md:text-5xl font-serif italic"
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  color: data.primaryColor,
                }}
              >
                {data.groomName}
              </p>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Chú Rể</p>
            </div>

            <div className="relative">
              <Heart className="w-8 h-8 md:w-10 md:h-10" style={{ color: data.accentColor }} fill={data.accentColor} />
            </div>

            <div className="text-left">
              <p
                className="text-3xl md:text-5xl font-serif italic"
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  color: data.primaryColor,
                }}
              >
                {data.brideName}
              </p>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Cô Dâu</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 md:w-24" style={{ backgroundColor: data.primaryColor }} />
          <div className="w-2 h-2 rotate-45" style={{ backgroundColor: data.accentColor }} />
          <div className="h-px w-16 md:w-24" style={{ backgroundColor: data.primaryColor }} />
        </div>

        {/* Parents Section */}
        <div className="grid grid-cols-2 gap-4 md:gap-8 text-center mb-8">
          <div>
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: data.accentColor }}>
              Nhà Trai
            </p>
            <p className="text-sm font-medium text-foreground">Ông: {data.groomFatherName}</p>
            <p className="text-sm font-medium text-foreground">Bà: {data.groomMotherName}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: data.accentColor }}>
              Nhà Gái
            </p>
            <p className="text-sm font-medium text-foreground">Ông: {data.brideFatherName}</p>
            <p className="text-sm font-medium text-foreground">Bà: {data.brideMotherName}</p>
          </div>
        </div>

        {/* Wedding Date */}
        <div className="text-center mb-8 p-6 rounded-lg" style={{ backgroundColor: `${data.primaryColor}15` }}>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
            Trân trọng kính mời quý khách tham dự vào
          </p>

          <div className="flex items-center justify-center gap-3 md:gap-6">
            <div className="text-center">
              <p className="text-4xl md:text-6xl font-light" style={{ color: data.primaryColor }}>
                {dateInfo.day}
              </p>
              <p className="text-xs text-muted-foreground">{dateInfo.weekday}</p>
            </div>

            <div className="h-16 w-px" style={{ backgroundColor: data.primaryColor }} />

            <div className="text-center">
              <p className="text-lg md:text-xl font-medium" style={{ color: data.accentColor }}>
                Tháng {dateInfo.month}
              </p>
              <p className="text-2xl md:text-3xl font-light" style={{ color: data.primaryColor }}>
                {dateInfo.year}
              </p>
            </div>
          </div>

          {data.lunarDate && <p className="text-xs text-muted-foreground mt-3">(Tức ngày {data.lunarDate} Âm lịch)</p>}

          <p className="text-sm mt-3 font-medium" style={{ color: data.primaryColor }}>
            Vào lúc: {formatTime(data.weddingTime)}
          </p>
        </div>

        {/* Venue */}
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-wider mb-2" style={{ color: data.accentColor }}>
            Địa Điểm
          </p>
          <p className="text-lg md:text-xl font-semibold mb-1" style={{ color: data.primaryColor }}>
            {data.venueName}
          </p>
          <p className="text-sm text-muted-foreground">{data.venueAddress}</p>
        </div>

        {/* Message */}
        <div className="text-center">
          <p className="text-sm italic leading-relaxed" style={{ color: data.primaryColor }}>
            "{data.message}"
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t" style={{ borderColor: `${data.primaryColor}30` }}>
          <p
            className="text-2xl md:text-3xl font-serif italic"
            style={{
              fontFamily: "'Great Vibes', cursive",
              color: data.primaryColor,
            }}
          >
            {data.groomName} & {data.brideName}
          </p>
        </div>
      </div>
    </div>
  )
}

function FloralCorner({ position, color }: { position: string; color: string }) {
  const getTransform = () => {
    switch (position) {
      case "top-left":
        return "rotate(0deg)"
      case "top-right":
        return "rotate(90deg)"
      case "bottom-right":
        return "rotate(180deg)"
      case "bottom-left":
        return "rotate(270deg)"
      default:
        return "rotate(0deg)"
    }
  }

  const getPosition = () => {
    switch (position) {
      case "top-left":
        return "top-2 left-2"
      case "top-right":
        return "top-2 right-2"
      case "bottom-right":
        return "bottom-2 right-2"
      case "bottom-left":
        return "bottom-2 left-2"
      default:
        return ""
    }
  }

  return (
    <div
      className={`absolute ${getPosition()} w-16 h-16 md:w-24 md:h-24 pointer-events-none`}
      style={{ transform: getTransform() }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" style={{ color }}>
        {/* Floral decoration SVG */}
        <path
          d="M10 10 Q 30 10 40 30 Q 50 20 60 30 Q 70 10 90 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.4"
        />
        <circle cx="25" cy="25" r="4" fill="currentColor" opacity="0.3" />
        <circle cx="45" cy="15" r="3" fill="currentColor" opacity="0.4" />
        <circle cx="15" cy="45" r="3" fill="currentColor" opacity="0.4" />
        <path d="M5 40 Q 20 35 30 50" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <path d="M40 5 Q 35 20 50 30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      </svg>
    </div>
  )
}
