import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/equipment - List all equipment with optional filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const departmentId = searchParams.get("departmentId")
    const employeeId = searchParams.get("employeeId")
    const state = searchParams.get("state")

    const where: any = {}

    if (departmentId) {
      where.departmentId = Number.parseInt(departmentId)
    }

    if (employeeId) {
      where.employeeId = Number.parseInt(employeeId)
    }

    if (state) {
      where.state = state
    }

    const equipment = await prisma.equipment.findMany({
      where,
      include: {
        category: true,
        department: true,
        employee: true,
        maintenanceTeam: true,
        defaultTechnician: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(equipment)
  } catch (error) {
    console.error("[v0] Error fetching equipment:", error)
    return NextResponse.json({ error: "Failed to fetch equipment" }, { status: 500 })
  }
}

// POST /api/equipment - Create new equipment
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const equipment = await prisma.equipment.create({
      data: {
        name: body.name,
        serialNumber: body.serialNumber,
        categoryId: body.categoryId,
        departmentId: body.departmentId,
        employeeId: body.employeeId,
        location: body.location,
        purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : null,
        warrantyEnd: body.warrantyEnd ? new Date(body.warrantyEnd) : null,
        workCenterId: body.workCenterId || null,
        maintenanceTeamId: body.maintenanceTeamId,
        defaultTechnicianId: body.defaultTechnicianId,
        state: body.state || "Active",
      },
      include: {
        category: true,
        department: true,
        employee: true,
        maintenanceTeam: true,
        defaultTechnician: true,
      },
    })

    return NextResponse.json(equipment, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating equipment:", error)
    return NextResponse.json({ error: "Failed to create equipment" }, { status: 500 })
  }
}
