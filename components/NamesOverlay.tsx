// NamesOverlay.tsx
"use client"
import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

type Props = {
  sectionId: string
  groomName: string
  brideName: string
  isVisible: boolean
}

export default function NamesOverlay({ sectionId, groomName, brideName, isVisible }: Props) {
  const [rect, setRect] = useState<DOMRect | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const el = document.getElementById(sectionId)
    if (!el) return

    const update = () => {
      const r = el.getBoundingClientRect()
      setRect(r)
    }

    // update immediately
    update()

    // keep overlay position in sync on resize & scroll
    const onResize = () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); rafRef.current = requestAnimationFrame(update) }
    window.addEventListener("resize", onResize)
    window.addEventListener("scroll", onResize, { passive: true })

    return () => {
      window.removeEventListener("resize", onResize)
      window.removeEventListener("scroll", onResize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [sectionId])

  if (!rect) return null

  // create overlay root on body
  const overlayStyle: React.CSSProperties = {
    position: "absolute",
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height,
    pointerEvents: "none", // let clicks pass through
    zIndex: 9999,
  }

  // inner text styles — keep same sizes and top% as your original code
  const groomStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: "12%",
    fontFamily: "'Great Vibes', cursive",
    fontSize: "2.5rem",
    lineHeight: 1.25,
    color: "#111111",
    pointerEvents: "none",
    // ensure glyph overflow visible
    overflow: "visible",
    display: "inline-block",
    zIndex: 20,
  }

  const ampStyle: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "42%",
    transform: "translateX(-50%)",
    fontFamily: "'Great Vibes', cursive",
    fontSize: "3rem",
    lineHeight: 1.3,
    pointerEvents: "none",
    zIndex: 30,
  }

  const brideStyle: React.CSSProperties = {
    position: "absolute",
    right: "calc(9 * 0.25rem)", // preserve visual of right-9 (tailwind right-9 == 2.25rem); adjust if needed
    top: "50%",
    fontFamily: "'Great Vibes', cursive",
    fontSize: "2.7rem",
    lineHeight: 1.3,
    color: "#111111",
    pointerEvents: "none",
    overflow: "visible",
    display: "inline-block",
    paddingTop: "0.15em", // keep the i-safe padding
    zIndex: 20,
    textAlign: "right",
  }

  const content = (
    <div style={overlayStyle} aria-hidden>
      <p style={groomStyle} className={isVisible ? "opacity-80 translate-x-0 transition-all duration-1000 delay-[700ms]" : "opacity-0 -translate-x-12"}>
        {groomName}
      </p>
      <span style={ampStyle} className={isVisible ? "opacity-80" : "opacity-0"}>
        &
      </span>
      <p style={brideStyle} className={isVisible ? "opacity-80 translate-x-0 transition-all duration-1000 delay-[700ms]" : "opacity-0 translate-x-12"}>
        {brideName}
      </p>
    </div>
  )

  return createPortal(content, document.body)
}
