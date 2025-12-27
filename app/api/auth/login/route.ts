import { NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"
import { createSession } from "@/lib/session"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const employee = await authenticateUser(email, password)

    if (!employee) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Create session (simplified - in production use proper session management)
    const sessionId = `${employee.id}-${crypto.randomUUID()}`
    await createSession(employee.id)

    return NextResponse.json({
      message: "Login successful",
      employee,
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
