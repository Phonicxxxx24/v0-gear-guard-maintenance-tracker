import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { format } from "date-fns"

// GET /api/requests/calendar - Get preventive maintenance requests for calendar
export async function GET() {
  try {
    const requests = await prisma.maintenanceRequest.findMany({
      where: {
        type: "Preventive",
        scheduledDate: {
          not: null,
        },
      },
      include: {
        equipment: true,
        maintenanceTeam: true,
      },
      orderBy: {
        scheduledDate: "asc",
      },
    })

    // Transform to calendar events
    const events = requests.map((request) => {
      // Determine team color
      let teamColor = "bg-blue-500"
      if (request.maintenanceTeam.name === "Mechanics") teamColor = "bg-blue-500"
      else if (request.maintenanceTeam.name === "Electricians") teamColor = "bg-amber-500"
      else if (request.maintenanceTeam.name === "IT Support") teamColor = "bg-purple-500"

      return {
        id: request.id,
        date: format(request.scheduledDate!, "yyyy-MM-dd"),
        subject: request.subject,
        equipmentName: request.equipment.name,
        team: request.maintenanceTeam.name,
        teamColor,
        requestNumber: request.requestNumber,
      }
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error("[v0] Error fetching calendar events:", error)
    return NextResponse.json({ error: "Failed to fetch calendar events" }, { status: 500 })
  }
}
