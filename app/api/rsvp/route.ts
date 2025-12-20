
// app/api/rsvp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Lấy biến môi trường
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Tạo client Supabase server-side
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, relation, attending, guests = 1, phone, message } = body;

    console.log("RSVP received:", body);

    // Kiểm tra dữ liệu bắt buộc
    if (!name || typeof attending === "undefined") {
      return NextResponse.json(
        { error: "Thiếu name hoặc attending" },
        { status: 400 }
      );
    }

    // Insert dữ liệu vào Supabase
    const { data, error } = await supabaseAdmin
      .from("rsvps")
      .insert([{ name, relation, attending, guests, phone, message }]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: err.message || "Lỗi server" },
      { status: 500 }
    );
  }
}
