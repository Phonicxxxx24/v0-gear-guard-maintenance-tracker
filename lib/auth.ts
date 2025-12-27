import { prisma } from "@/lib/db"
import * as bcrypt from "bcryptjs"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function authenticateUser(email: string, password: string) {
  const employee = await prisma.employee.findUnique({
    where: { email },
    include: {
      department: true,
      defaultTeam: true,
    },
  })

  if (!employee) {
    return null
  }

  const isValid = await verifyPassword(password, employee.password)

  if (!isValid) {
    return null
  }

  // Don't return password
  const { password: _, ...employeeWithoutPassword } = employee

  return employeeWithoutPassword
}
