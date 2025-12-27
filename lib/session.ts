import { cookies } from "next/headers"
import { prisma } from "@/lib/db"

const SESSION_COOKIE_NAME = "gearguard_session"
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function createSession(employeeId: number) {
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000)

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  })

  // In production, you'd store sessions in a database table
  // For simplicity, we're using cookies only
  return sessionId
}

export async function getSession() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionId) {
    return null
  }

  // In a production app, you'd verify the session from database
  // For now, we'll just return the session ID
  return sessionId
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionId) {
    return null
  }

  // In production, look up session in database and get user
  // For this demo, we'll decode the employee ID from the session
  // This is NOT secure for production - use proper session management
  try {
    const employeeId = Number.parseInt(sessionId.split("-")[0])

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        department: true,
        defaultTeam: true,
      },
    })

    if (!employee) {
      return null
    }

    const { password: _, ...employeeWithoutPassword } = employee
    return employeeWithoutPassword
  } catch {
    return null
  }
}
