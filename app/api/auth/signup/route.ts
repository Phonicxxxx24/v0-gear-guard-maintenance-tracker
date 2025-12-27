import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { createSession } from "@/lib/session"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, role } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { email },
    })

    if (existingEmployee) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    let departmentId = 1 // Default to first department
    try {
      const firstDept = await prisma.department.findFirst()
      if (firstDept) {
        departmentId = firstDept.id
      } else {
        // Create a default department if none exists
        const defaultDept = await prisma.department.create({
          data: { name: "General" },
        })
        departmentId = defaultDept.id
      }
    } catch (deptError) {
      console.error("[v0] Department lookup error:", deptError)
    }

    // Create employee
    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        password: hashedPassword,
        departmentId,
        role: role || "User",
      },
      include: {
        department: true,
        defaultTeam: true,
      },
    })

    // Create session
    await createSession(employee.id)

    const { password: _, ...employeeWithoutPassword } = employee

    return NextResponse.json({
      message: "Signup successful",
      employee: employeeWithoutPassword,
    })
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
