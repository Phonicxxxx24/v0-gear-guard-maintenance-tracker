import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/equipment/[id]/open-requests-count - Count open maintenance requests
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const count = await prisma.maintenanceRequest.count({
      where: {
        equipmentId: Number.parseInt(id),
        state: {
          in: ["New", "In Progress"],
        },
      },
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error("[v0] Error counting open requests:", error)
    return NextResponse.json({ error: "Failed to count open requests" }, { status: 500 })
  }
}
