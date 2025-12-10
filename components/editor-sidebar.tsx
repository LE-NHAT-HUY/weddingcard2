"use client"

import { Heart, Users, Calendar, Palette, ImageIcon, BookOpen, Music } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { WeddingData } from "@/lib/types"

interface EditorSidebarProps {
  data: WeddingData
  setData: (data: WeddingData) => void
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function EditorSidebar({ data, setData, activeTab, setActiveTab }: EditorSidebarProps) {
  const updateField = (field: keyof WeddingData, value: string) => {
    setData({ ...data, [field]: value })
  }

  const updateLoveStory = (index: number, field: string, value: string) => {
    const newStory = [...data.loveStory]
    newStory[index] = { ...newStory[index], [field]: value }
    setData({ ...data, loveStory: newStory })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 sm:p-6 border-b border-border bg-gradient-to-r from-rose-100 to-amber-50">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-semibold text-foreground">Thiệp Cưới</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Chỉnh sửa thông tin thiệp cưới</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <TabsList className="flex w-max min-w-full mx-2 sm:mx-4 mt-3 sm:mt-4 bg-muted/50 h-auto p-1">
            <TabsTrigger
              value="couple"
              className="flex flex-col gap-0.5 sm:gap-1 py-1.5 sm:py-2 px-2 sm:px-3 text-[8px] sm:text-[9px] whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Cặp Đôi</span>
            </TabsTrigger>
            <TabsTrigger
              value="family"
              className="flex flex-col gap-0.5 sm:gap-1 py-1.5 sm:py-2 px-2 sm:px-3 text-[8px] sm:text-[9px] whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Gia Đình</span>
            </TabsTrigger>
            <TabsTrigger
              value="date"
              className="flex flex-col gap-0.5 sm:gap-1 py-1.5 sm:py-2 px-2 sm:px-3 text-[8px] sm:text-[9px] whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Ngày Cưới</span>
            </TabsTrigger>
            <TabsTrigger
              value="story"
              className="flex flex-col gap-0.5 sm:gap-1 py-1.5 sm:py-2 px-2 sm:px-3 text-[8px] sm:text-[9px] whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Câu Chuyện</span>
            </TabsTrigger>
            <TabsTrigger
              value="media"
              className="flex flex-col gap-0.5 sm:gap-1 py-1.5 sm:py-2 px-2 sm:px-3 text-[8px] sm:text-[9px] whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Ảnh & Nhạc</span>
            </TabsTrigger>
            <TabsTrigger
              value="style"
              className="flex flex-col gap-0.5 sm:gap-1 py-1.5 sm:py-2 px-2 sm:px-3 text-[8px] sm:text-[9px] whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Màu Sắc</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          {/* Couple Tab */}
          <TabsContent value="couple" className="mt-0 space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-sm sm:text-base text-foreground flex items-center gap-2">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] sm:text-xs text-blue-600">
                  ♂
                </span>
                Thông tin Chú Rể
              </h3>
              <div className="space-y-2 sm:space-y-3 pl-6 sm:pl-8">
                <div>
                  <Label htmlFor="groomName" className="text-xs sm:text-sm">
                    Tên gọi
                  </Label>
                  <Input
                    id="groomName"
                    value={data.groomName}
                    onChange={(e) => updateField("groomName", e.target.value)}
                    placeholder="VD: Khánh Nam"
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="groomFullName" className="text-xs sm:text-sm">
                    Họ và tên đầy đủ
                  </Label>
                  <Input
                    id="groomFullName"
                    value={data.groomFullName}
                    onChange={(e) => updateField("groomFullName", e.target.value)}
                    placeholder="VD: Lê Khánh Nam"
                    className="mt-1 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-sm sm:text-base text-foreground flex items-center gap-2">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-pink-100 flex items-center justify-center text-[10px] sm:text-xs text-pink-600">
                  ♀
                </span>
                Thông tin Cô Dâu
              </h3>
              <div className="space-y-2 sm:space-y-3 pl-6 sm:pl-8">
                <div>
                  <Label htmlFor="brideName" className="text-xs sm:text-sm">
                    Tên gọi
                  </Label>
                  <Input
                    id="brideName"
                    value={data.brideName}
                    onChange={(e) => updateField("brideName", e.target.value)}
                    placeholder="VD: Lan Nhi"
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="brideFullName" className="text-xs sm:text-sm">
                    Họ và tên đầy đủ
                  </Label>
                  <Input
                    id="brideFullName"
                    value={data.brideFullName}
                    onChange={(e) => updateField("brideFullName", e.target.value)}
                    placeholder="VD: Nguyễn Thị Lan Nhi"
                    className="mt-1 text-sm"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Family Tab */}
          <TabsContent value="family" className="mt-0 space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-sm sm:text-base text-foreground">Gia đình Nhà Trai</h3>
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <Label htmlFor="groomFatherName" className="text-xs sm:text-sm">
                    Họ tên Cha
                  </Label>
                  <Input
                    id="groomFatherName"
                    value={data.groomFatherName}
                    onChange={(e) => updateField("groomFatherName", e.target.value)}
                    placeholder="VD: Lê Văn Năm"
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="groomMotherName" className="text-xs sm:text-sm">
                    Họ tên Mẹ
                  </Label>
                  <Input
                    id="groomMotherName"
                    value={data.groomMotherName}
                    onChange={(e) => updateField("groomMotherName", e.target.value)}
                    placeholder="VD: Trương Thi Cúc"
                    className="mt-1 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-sm sm:text-base text-foreground">Gia đình Nhà Gái</h3>
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <Label htmlFor="brideFatherName" className="text-xs sm:text-sm">
                    Họ tên Cha
                  </Label>
                  <Input
                    id="brideFatherName"
                    value={data.brideFatherName}
                    onChange={(e) => updateField("brideFatherName", e.target.value)}
                    placeholder="VD: Trần Văn Nam"
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="brideMotherName" className="text-xs sm:text-sm">
                    Họ tên Mẹ
                  </Label>
                  <Input
                    id="brideMotherName"
                    value={data.brideMotherName}
                    onChange={(e) => updateField("brideMotherName", e.target.value)}
                    placeholder="VD: Phạm Thị Hoa"
                    className="mt-1 text-sm"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Date Tab */}
          <TabsContent value="date" className="mt-0 space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-sm sm:text-base text-foreground">Thời gian tổ chức</h3>
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <Label htmlFor="weddingDate" className="text-xs sm:text-sm">
                    Ngày cưới (Dương lịch)
                  </Label>
                  <Input
                    id="weddingDate"
                    type="date"
                    value={data.weddingDate}
                    onChange={(e) => updateField("weddingDate", e.target.value)}
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="lunarDate" className="text-xs sm:text-sm">
                    Ngày cưới (Âm lịch)
                  </Label>
                  <Input
                    id="lunarDate"
                    value={data.lunarDate}
                    onChange={(e) => updateField("lunarDate", e.target.value)}
                    placeholder="VD: 17/01/2025"
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="weddingTime" className="text-xs sm:text-sm">
                    Giờ đón khách
                  </Label>
                  <Input
                    id="weddingTime"
                    type="time"
                    value={data.weddingTime}
                    onChange={(e) => updateField("weddingTime", e.target.value)}
                    className="mt-1 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-sm sm:text-base text-foreground">Địa điểm tiệc cưới</h3>
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <Label htmlFor="venueName" className="text-xs sm:text-sm">
                    Tên nhà hàng / Trung tâm tiệc cưới
                  </Label>
                  <Input
                    id="venueName"
                    value={data.venueName}
                    onChange={(e) => updateField("venueName", e.target.value)}
                    placeholder="VD: White Palace"
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="venueAddress" className="text-xs sm:text-sm">
                    Địa chỉ
                  </Label>
                  <Textarea
                    id="venueAddress"
                    value={data.venueAddress}
                    onChange={(e) => updateField("venueAddress", e.target.value)}
                    placeholder="VD: 194 Hoàng Văn Thụ, Quận Phú Nhuận, TP.HCM"
                    className="mt-1 text-sm"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Story Tab */}
          <TabsContent value="story" className="mt-0 space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-sm sm:text-base text-foreground">Nội dung giới thiệu</h3>
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <Label htmlFor="introText" className="text-xs sm:text-sm">
                    Lời giới thiệu
                  </Label>
                  <Textarea
                    id="introText"
                    value={data.introText}
                    onChange={(e) => updateField("introText", e.target.value)}
                    placeholder="Viết lời giới thiệu về đám cưới..."
                    className="mt-1 text-sm"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="quoteText" className="text-xs sm:text-sm">
                    Câu trích dẫn / Lời yêu thương
                  </Label>
                  <Textarea
                    id="quoteText"
                    value={data.quoteText}
                    onChange={(e) => updateField("quoteText", e.target.value)}
                    placeholder="Viết câu trích dẫn về tình yêu..."
                    className="mt-1 text-sm"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-xs sm:text-sm">
                    Lời mời
                  </Label>
                  <Textarea
                    id="message"
                    value={data.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    placeholder="Lời nhắn gửi đến khách mời..."
                    className="mt-1 text-sm"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-sm sm:text-base text-foreground">Câu chuyện tình yêu</h3>
              {data.loveStory.map((story, index) => (
                <div key={story.id} className="p-3 sm:p-4 border rounded-lg space-y-2 sm:space-y-3 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] sm:text-xs text-primary font-bold">
                      {index + 1}
                    </span>
                    <span className="font-medium text-xs sm:text-sm">Cột mốc {index + 1}</span>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Ngày</Label>
                    <Input
                      value={story.date}
                      onChange={(e) => updateLoveStory(index, "date", e.target.value)}
                      placeholder="VD: 05.10.2018"
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Tiêu đề</Label>
                    <Input
                      value={story.title}
                      onChange={(e) => updateLoveStory(index, "title", e.target.value)}
                      placeholder="VD: Lần đầu gặp gỡ"
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Mô tả</Label>
                    <Textarea
                      value={story.description}
                      onChange={(e) => updateLoveStory(index, "description", e.target.value)}
                      placeholder="Mô tả kỷ niệm..."
                      className="mt-1 text-sm"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="mt-0 space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-sm sm:text-base text-foreground flex items-center gap-2">
                <Music className="w-4 h-4" />
                Nhạc nền
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <Label htmlFor="songTitle" className="text-xs sm:text-sm">
                    Tên bài hát
                  </Label>
                  <Input
                    id="songTitle"
                    value={data.songTitle}
                    onChange={(e) => updateField("songTitle", e.target.value)}
                    placeholder="VD: I Love You"
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="songArtist" className="text-xs sm:text-sm">
                    Ca sĩ
                  </Label>
                  <Input
                    id="songArtist"
                    value={data.songArtist}
                    onChange={(e) => updateField("songArtist", e.target.value)}
                    placeholder="VD: Céline Dion"
                    className="mt-1 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-sm sm:text-base text-foreground flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Ảnh bìa
              </h3>
              <div>
                <Label htmlFor="coverPhoto" className="text-xs sm:text-sm">
                  URL ảnh bìa
                </Label>
                <Input
                  id="coverPhoto"
                  value={data.coverPhoto}
                  onChange={(e) => updateField("coverPhoto", e.target.value)}
                  placeholder="Nhập URL ảnh..."
                  className="mt-1 text-sm"
                />
                  {/* Preview ảnh full màn hình */}
                  {data.coverPhoto && (
                    <div className="mt-4 w-full h-screen">
                      <img
                        src={data.coverPhoto}
                        alt="Ảnh bìa"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                    Ảnh sẽ hiển thị toàn màn hình (full screen)
                  </p>
                </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-sm sm:text-base text-foreground">Album ảnh (6 ảnh)</h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {data.gallery.map((photo, index) => (
                  <div key={index}>
                    <Label className="text-[10px] sm:text-xs">Ảnh {index + 1}</Label>
                    <Input
                      value={photo}
                      onChange={(e) => {
                        const newGallery = [...data.gallery]
                        newGallery[index] = e.target.value
                        setData({ ...data, gallery: newGallery })
                      }}
                      placeholder="URL ảnh..."
                      className="mt-1 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Style Tab */}
          <TabsContent value="style" className="mt-0 space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-sm sm:text-base text-foreground">Tùy chỉnh màu sắc</h3>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="primaryColor" className="text-xs sm:text-sm">
                    Màu chủ đạo
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={data.primaryColor}
                      onChange={(e) => updateField("primaryColor", e.target.value)}
                      className="w-12 h-9 sm:w-14 sm:h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={data.primaryColor}
                      onChange={(e) => updateField("primaryColor", e.target.value)}
                      className="flex-1 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="accentColor" className="text-xs sm:text-sm">
                    Màu nhấn
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="accentColor"
                      type="color"
                      value={data.accentColor}
                      onChange={(e) => updateField("accentColor", e.target.value)}
                      className="w-12 h-9 sm:w-14 sm:h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={data.accentColor}
                      onChange={(e) => updateField("accentColor", e.target.value)}
                      className="flex-1 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-sm sm:text-base text-foreground">Bảng màu gợi ý</h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[
                  { primary: "#9e0a0a", accent: "#db9999", name: "Đỏ đô" },
                  { primary: "#8B4513", accent: "#DEB887", name: "Nâu gỗ" },
                  { primary: "#2F4F4F", accent: "#8FBC8F", name: "Xanh rêu" },
                  { primary: "#4A3728", accent: "#C4A77D", name: "Cà phê" },
                  { primary: "#800020", accent: "#FFB6C1", name: "Burgundy" },
                  { primary: "#1a365d", accent: "#90CDF4", name: "Xanh navy" },
                  { primary: "#5D3A1A", accent: "#E8C89A", name: "Chocolate" },
                  { primary: "#4A5568", accent: "#A0AEC0", name: "Xám thanh lịch" },
                ].map((palette) => (
                  <button
                    key={palette.name}
                    onClick={() => {
                      setData({ ...data, primaryColor: palette.primary, accentColor: palette.accent })
                    }}
                    className="flex items-center gap-2 p-2 sm:p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex gap-1">
                      <div
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-border"
                        style={{ backgroundColor: palette.primary }}
                      />
                      <div
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-border"
                        style={{ backgroundColor: palette.accent }}
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs font-medium">{palette.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
