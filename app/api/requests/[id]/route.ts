import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/requests/[id] - Get single request
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const maintenanceRequest = await prisma.maintenanceRequest.findUnique({
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

    if (!maintenanceRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    return NextResponse.json(maintenanceRequest)
  } catch (error) {
    console.error("[v0] Error fetching request:", error)
    return NextResponse.json({ error: "Failed to fetch request" }, { status: 500 })
  }
}

// DELETE /api/requests/[id] - Delete request
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    await prisma.maintenanceRequest.delete({
      where: {
        id: Number.parseInt(id),
      },
    })

    return NextResponse.json({ message: "Request deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting request:", error)
    return NextResponse.json({ error: "Failed to delete request" }, { status: 500 })
  }
}
