import { NextResponse } from "next/server"
import { deleteSession } from "@/lib/session"

export async function POST() {
  try {
    await deleteSession()

    return NextResponse.json({ message: "Logout successful" })
  } catch (error) {
    console.error("[v0] Logout error:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
