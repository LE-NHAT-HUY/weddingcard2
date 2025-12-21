import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server" // 👈 FILE BẠN VỪA GỬI

export async function POST(req: NextRequest) {
  try {
    const { name, message } = await req.json()

    if (!name || !message) {
      return NextResponse.json(
        { error: "Thiếu tên hoặc lời chúc" },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("wishes")
      .insert([
        {
          name,
          message,
        },
      ])
      .select() // 👈 thêm để chắc chắn insert chạy

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "",
      data,
    })
  } catch (err: any) {
    console.error("Wish API error:", err)
    return NextResponse.json(
      { error: err.message || "Lỗi server" },
      { status: 500 }
    )
  }
}
