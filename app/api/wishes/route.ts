import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client"

export async function POST(req: NextRequest) {
  try {
    const { name, message } = await req.json()

    if (!name || !message) {
      return NextResponse.json({ error: "Thiếu tên hoặc lời chúc" }, { status: 400 })
    }

    const supabase = createClient()

    const { data, error } = await supabase.from("wishes").insert([{ name, message }])

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "✨ Lời chúc của bạn đã được gửi đến!", data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Lỗi server" }, { status: 500 })
  }
}
