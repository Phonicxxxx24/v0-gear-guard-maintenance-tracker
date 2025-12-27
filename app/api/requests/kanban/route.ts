import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/requests/kanban - Get requests grouped by state for kanban board
export async function GET() {
  try {
    const requests = await prisma.maintenanceRequest.findMany({
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
      orderBy: {
        scheduledDate: "asc",
      },
    })

    // Group by state
    const grouped = {
      new: requests.filter((r) => r.state === "New"),
      in_progress: requests.filter((r) => r.state === "In Progress"),
      repaired: requests.filter((r) => r.state === "Repaired"),
      scrap: requests.filter((r) => r.state === "Scrap"),
    }

    return NextResponse.json(grouped)
  } catch (error) {
    console.error("[v0] Error fetching kanban data:", error)
    return NextResponse.json({ error: "Failed to fetch kanban data" }, { status: 500 })
  }
}
