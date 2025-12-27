import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// PATCH /api/requests/[id]/state - Update request state (for kanban drag & drop)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { state } = body

    // Update request state
    const maintenanceRequest = await prisma.maintenanceRequest.update({
      where: {
        id: Number.parseInt(id),
      },
      data: {
        state,
      },
      include: {
        equipment: true,
      },
    })

    // If state is Scrap, update equipment state to Scrap as well
    if (state === "Scrap") {
      await prisma.equipment.update({
        where: {
          id: maintenanceRequest.equipmentId,
        },
        data: {
          state: "Scrap",
        },
      })
    }

    // Fetch updated request with all relations
    const updatedRequest = await prisma.maintenanceRequest.findUnique({
      where: {
        id: Number.parseInt(id),
      },
      include: {
        equipment: {
          include: {
            category: true,
          },
        },
        equipmentCategory: true,
        department: true,
        employee: true,
        maintenanceTeam: true,
        assignedTechnician: true,
      },
    })

    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.error("[v0] Error updating request state:", error)
    return NextResponse.json({ error: "Failed to update request state" }, { status: 500 })
  }
}
