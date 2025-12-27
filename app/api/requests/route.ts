import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { generateRequestNumber } from "@/lib/utils/request-number"

// GET /api/requests - List all maintenance requests with optional filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const state = searchParams.get("state")
    const teamId = searchParams.get("teamId")
    const type = searchParams.get("type")

    const where: any = {}

    if (state) {
      where.state = state
    }

    if (teamId) {
      where.maintenanceTeamId = Number.parseInt(teamId)
    }

    if (type) {
      where.type = type
    }

    const requests = await prisma.maintenanceRequest.findMany({
      where,
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
        createdAt: "desc",
      },
    })

    return NextResponse.json(requests)
  } catch (error) {
    console.error("[v0] Error fetching requests:", error)
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 })
  }
}

// POST /api/requests - Create new maintenance request with auto-fill logic
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Fetch equipment to auto-fill related fields
    const equipment = await prisma.equipment.findUnique({
      where: { id: body.equipmentId },
      include: {
        category: true,
        maintenanceTeam: true,
      },
    })

    if (!equipment) {
      return NextResponse.json({ error: "Equipment not found" }, { status: 404 })
    }

    // Generate unique request number
    const requestNumber = await generateRequestNumber()

    // Create request with auto-filled data
    const maintenanceRequest = await prisma.maintenanceRequest.create({
      data: {
        requestNumber,
        type: body.type,
        subject: body.subject,
        description: body.description,
        equipmentId: body.equipmentId,
        equipmentCategoryId: equipment.categoryId, // Auto-filled
        departmentId: equipment.departmentId, // Auto-filled
        employeeId: equipment.employeeId, // Auto-filled
        maintenanceTeamId: equipment.maintenanceTeamId, // Auto-filled
        assignedTechnicianId: body.assignedTechnicianId || equipment.defaultTechnicianId,
        scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : null,
        startDatetime: body.startDatetime ? new Date(body.startDatetime) : null,
        durationHours: body.durationHours || null,
        state: body.state || "New",
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

    return NextResponse.json(maintenanceRequest, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating request:", error)
    return NextResponse.json({ error: "Failed to create request" }, { status: 500 })
  }
}
