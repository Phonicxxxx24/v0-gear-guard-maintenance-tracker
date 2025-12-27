import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/equipment/[id] - Fetch single equipment with relations
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const equipment = await prisma.equipment.findUnique({
      where: {
        id: Number.parseInt(id),
      },
      include: {
        category: true,
        department: true,
        employee: true,
        maintenanceTeam: true,
        defaultTechnician: true,
      },
    })

    if (!equipment) {
      return NextResponse.json({ error: "Equipment not found" }, { status: 404 })
    }

    return NextResponse.json(equipment)
  } catch (error) {
    console.error("[v0] Error fetching equipment:", error)
    return NextResponse.json({ error: "Failed to fetch equipment" }, { status: 500 })
  }
}

// PATCH /api/equipment/[id] - Update equipment
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const equipment = await prisma.equipment.update({
      where: {
        id: Number.parseInt(id),
      },
      data: body,
      include: {
        category: true,
        department: true,
        employee: true,
        maintenanceTeam: true,
        defaultTechnician: true,
      },
    })

    return NextResponse.json(equipment)
  } catch (error) {
    console.error("[v0] Error updating equipment:", error)
    return NextResponse.json({ error: "Failed to update equipment" }, { status: 500 })
  }
}

// DELETE /api/equipment/[id] - Delete equipment
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    await prisma.equipment.delete({
      where: {
        id: Number.parseInt(id),
      },
    })

    return NextResponse.json({ message: "Equipment deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting equipment:", error)
    return NextResponse.json({ error: "Failed to delete equipment" }, { status: 500 })
  }
}
