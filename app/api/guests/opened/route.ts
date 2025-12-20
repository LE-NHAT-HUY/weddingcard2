
import { useEffect } from "react"

export default function MarkOpened({ code }: { code: string }) {
  useEffect(() => {
    async function mark() {
      try {
        const res = await fetch("/api/guests/opened", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        })
        const data = await res.json()
        console.log("Result:", data)
      } catch (err) {
        console.error(err)
      }
    }

    mark()
  }, [code])

  return null
}
