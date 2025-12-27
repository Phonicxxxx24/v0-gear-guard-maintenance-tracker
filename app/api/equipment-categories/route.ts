import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/equipment-categories - List all equipment categories
export async function GET() {
  try {
    const categories = await prisma.equipmentCategory.findMany({
      include: {
        responsibleTeam: true,
        _count: {
          select: {
            equipment: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("[v0] Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

// POST /api/equipment-categories - Create new category
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const category = await prisma.equipmentCategory.create({
      data: {
        name: body.name,
        responsibleTeamId: body.responsibleTeamId,
        companyName: body.companyName,
      },
      include: {
        responsibleTeam: true,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
