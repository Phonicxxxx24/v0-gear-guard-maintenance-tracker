import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/departments - List all departments
export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(departments)
  } catch (error) {
    console.error("[v0] Error fetching departments:", error)
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 })
  }
}
