import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { code } = await req.json()

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Invalid code" },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    // Chỉ update nếu opened_at chưa có
    const { error } = await supabase
      .from("guests")
      .update({ opened_at: new Date().toISOString() })
      .eq("code", code)
      .is("opened_at", null)

    if (error) {
      console.error("Update opened_at error:", error)
      return NextResponse.json(
        { error: "Database error" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
