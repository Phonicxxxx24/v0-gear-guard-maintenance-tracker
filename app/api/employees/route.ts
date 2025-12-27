import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/employees - List all employees
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const teamId = searchParams.get("teamId")

    const where: any = {}

    if (role) {
      where.role = role
    }

    if (teamId) {
      where.defaultTeamId = Number.parseInt(teamId)
    }

    const employees = await prisma.employee.findMany({
      where,
      include: {
        department: true,
        defaultTeam: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    // Don't send passwords to frontend
    const sanitized = employees.map(({ password, ...employee }) => employee)

    return NextResponse.json(sanitized)
  } catch (error) {
    console.error("[v0] Error fetching employees:", error)
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
  }
}
