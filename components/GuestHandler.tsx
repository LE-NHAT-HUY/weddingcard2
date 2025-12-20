"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function GuestHandler() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    if (code) {
      console.log("Mã khách:", code);
    }
  }, [code]);

  return null;
}
