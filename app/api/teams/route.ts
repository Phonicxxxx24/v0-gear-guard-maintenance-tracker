import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/teams - List all maintenance teams
export async function GET() {
  try {
    const teams = await prisma.maintenanceTeam.findMany({
      include: {
        _count: {
          select: {
            employees: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(teams)
  } catch (error) {
    console.error("[v0] Error fetching teams:", error)
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 })
  }
}

// POST /api/teams - Create new team
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const team = await prisma.maintenanceTeam.create({
      data: {
        name: body.name,
        description: body.description,
        membersCount: body.membersCount || 0,
      },
    })

    return NextResponse.json(team, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating team:", error)
    return NextResponse.json({ error: "Failed to create team" }, { status: 500 })
  }
}
