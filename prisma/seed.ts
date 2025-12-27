import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting seed...")

  // Create Maintenance Teams
  const mechanicsTeam = await prisma.maintenanceTeam.create({
    data: {
      name: "Mechanics",
      description: "Handles mechanical equipment maintenance and repairs",
      membersCount: 5,
    },
  })

  const electriciansTeam = await prisma.maintenanceTeam.create({
    data: {
      name: "Electricians",
      description: "Handles electrical systems and equipment",
      membersCount: 4,
    },
  })

  const itTeam = await prisma.maintenanceTeam.create({
    data: {
      name: "IT Support",
      description: "Handles computer systems and IT equipment",
      membersCount: 3,
    },
  })

  console.log("Created maintenance teams")

  // Create Departments
  const productionDept = await prisma.department.create({
    data: { name: "Production", code: "PROD" },
  })

  const qualityDept = await prisma.department.create({
    data: { name: "Quality Assurance", code: "QA" },
  })

  const itDept = await prisma.department.create({
    data: { name: "IT Department", code: "IT" },
  })

  console.log("Created departments")

  // Create Employees
  const hashedPassword = await bcrypt.hash("password123", 10)

  const employee1 = await prisma.employee.create({
    data: {
      name: "John Smith",
      email: "john@example.com",
      password: hashedPassword,
      departmentId: productionDept.id,
      role: "Manager",
      defaultTeamId: mechanicsTeam.id,
    },
  })

  const employee2 = await prisma.employee.create({
    data: {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      password: hashedPassword,
      departmentId: qualityDept.id,
      role: "Technician",
      defaultTeamId: electriciansTeam.id,
    },
  })

  const employee3 = await prisma.employee.create({
    data: {
      name: "Mike Davis",
      email: "mike@example.com",
      password: hashedPassword,
      departmentId: itDept.id,
      role: "Technician",
      defaultTeamId: itTeam.id,
    },
  })

  const employee4 = await prisma.employee.create({
    data: {
      name: "Emma Wilson",
      email: "emma@example.com",
      password: hashedPassword,
      departmentId: productionDept.id,
      role: "User",
      defaultTeamId: mechanicsTeam.id,
    },
  })

  console.log("Created employees")

  // Create Equipment Categories
  const foundryCategory = await prisma.equipmentCategory.create({
    data: {
      name: "Foundry Equipment",
      responsibleTeamId: mechanicsTeam.id,
      companyName: "Acme Industries",
    },
  })

  const pressCategory = await prisma.equipmentCategory.create({
    data: {
      name: "Press Shop",
      responsibleTeamId: mechanicsTeam.id,
      companyName: "Acme Industries",
    },
  })

  const hvacCategory = await prisma.equipmentCategory.create({
    data: {
      name: "HVAC Systems",
      responsibleTeamId: electriciansTeam.id,
      companyName: "Acme Industries",
    },
  })

  const computerCategory = await prisma.equipmentCategory.create({
    data: {
      name: "Computer Systems",
      responsibleTeamId: itTeam.id,
      companyName: "Acme Industries",
    },
  })

  console.log("Created equipment categories")

  // Create Work Centers
  const workCenter1 = await prisma.workCenter.create({
    data: {
      name: "Assembly Line 1",
      code: "AL-001",
      costPerHour: 150.0,
      capacityPerDay: 500,
    },
  })

  const workCenter2 = await prisma.workCenter.create({
    data: {
      name: "Paint Shop",
      code: "PS-001",
      costPerHour: 120.0,
      capacityPerDay: 300,
    },
  })

  console.log("Created work centers")

  // Create Equipment
  const equipment1 = await prisma.equipment.create({
    data: {
      name: "Industrial Lathe #12",
      serialNumber: "LAT-2023-012",
      categoryId: foundryCategory.id,
      departmentId: productionDept.id,
      employeeId: employee1.id,
      location: "Building A, Floor 2",
      purchaseDate: new Date("2023-01-15"),
      warrantyEnd: new Date("2026-01-15"),
      workCenterId: workCenter1.id,
      maintenanceTeamId: mechanicsTeam.id,
      defaultTechnicianId: employee1.id,
      state: "Active",
    },
  })

  const equipment2 = await prisma.equipment.create({
    data: {
      name: "Hydraulic Press #5",
      serialNumber: "HP-2022-005",
      categoryId: pressCategory.id,
      departmentId: productionDept.id,
      employeeId: employee4.id,
      location: "Building B, Floor 1",
      purchaseDate: new Date("2022-06-10"),
      warrantyEnd: new Date("2025-06-10"),
      workCenterId: workCenter1.id,
      maintenanceTeamId: mechanicsTeam.id,
      defaultTechnicianId: employee1.id,
      state: "Active",
    },
  })

  const equipment3 = await prisma.equipment.create({
    data: {
      name: "HVAC Unit #3",
      serialNumber: "HVAC-2021-003",
      categoryId: hvacCategory.id,
      departmentId: productionDept.id,
      employeeId: employee1.id,
      location: "Building A, Roof",
      purchaseDate: new Date("2021-03-20"),
      warrantyEnd: new Date("2024-03-20"),
      maintenanceTeamId: electriciansTeam.id,
      defaultTechnicianId: employee2.id,
      state: "Active",
    },
  })

  const equipment4 = await prisma.equipment.create({
    data: {
      name: "Server Rack #7",
      serialNumber: "SRV-2023-007",
      categoryId: computerCategory.id,
      departmentId: itDept.id,
      employeeId: employee3.id,
      location: "Data Center",
      purchaseDate: new Date("2023-09-01"),
      warrantyEnd: new Date("2028-09-01"),
      maintenanceTeamId: itTeam.id,
      defaultTechnicianId: employee3.id,
      state: "Active",
    },
  })

  const equipment5 = await prisma.equipment.create({
    data: {
      name: "CNC Machine #8",
      serialNumber: "CNC-2020-008",
      categoryId: foundryCategory.id,
      departmentId: productionDept.id,
      employeeId: employee4.id,
      location: "Building A, Floor 1",
      purchaseDate: new Date("2020-11-05"),
      warrantyEnd: new Date("2023-11-05"),
      workCenterId: workCenter2.id,
      maintenanceTeamId: mechanicsTeam.id,
      defaultTechnicianId: employee1.id,
      state: "Active",
    },
  })

  console.log("Created equipment")

  // Create Maintenance Requests
  const baseDate = new Date()

  await prisma.maintenanceRequest.create({
    data: {
      requestNumber: "MR-2025-0001",
      type: "Corrective",
      subject: "Strange noise from bearings",
      equipmentId: equipment1.id,
      equipmentCategoryId: foundryCategory.id,
      departmentId: productionDept.id,
      employeeId: employee4.id,
      maintenanceTeamId: mechanicsTeam.id,
      assignedTechnicianId: employee1.id,
      scheduledDate: new Date(baseDate.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (overdue)
      state: "New",
      description: "Unusual grinding noise coming from the main bearing assembly",
    },
  })

  await prisma.maintenanceRequest.create({
    data: {
      requestNumber: "MR-2025-0002",
      type: "Corrective",
      subject: "Hydraulic fluid leak",
      equipmentId: equipment2.id,
      equipmentCategoryId: pressCategory.id,
      departmentId: productionDept.id,
      employeeId: employee1.id,
      maintenanceTeamId: mechanicsTeam.id,
      assignedTechnicianId: employee1.id,
      scheduledDate: new Date(baseDate.getTime() + 1 * 24 * 60 * 60 * 1000),
      state: "In Progress",
      description: "Small hydraulic fluid leak detected near cylinder #2",
    },
  })

  await prisma.maintenanceRequest.create({
    data: {
      requestNumber: "MR-2025-0003",
      type: "Preventive",
      subject: "Quarterly HVAC filter replacement",
      equipmentId: equipment3.id,
      equipmentCategoryId: hvacCategory.id,
      departmentId: productionDept.id,
      employeeId: employee1.id,
      maintenanceTeamId: electriciansTeam.id,
      assignedTechnicianId: employee2.id,
      scheduledDate: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      state: "New",
      description: "Regular quarterly maintenance - filter replacement and system check",
    },
  })

  await prisma.maintenanceRequest.create({
    data: {
      requestNumber: "MR-2025-0004",
      type: "Corrective",
      subject: "Server overheating",
      equipmentId: equipment4.id,
      equipmentCategoryId: computerCategory.id,
      departmentId: itDept.id,
      employeeId: employee3.id,
      maintenanceTeamId: itTeam.id,
      assignedTechnicianId: employee3.id,
      scheduledDate: new Date(),
      state: "In Progress",
      description: "Temperature alerts triggered, cooling fans may need replacement",
    },
  })

  await prisma.maintenanceRequest.create({
    data: {
      requestNumber: "MR-2025-0005",
      type: "Preventive",
      subject: "Monthly CNC calibration",
      equipmentId: equipment5.id,
      equipmentCategoryId: foundryCategory.id,
      departmentId: productionDept.id,
      employeeId: employee4.id,
      maintenanceTeamId: mechanicsTeam.id,
      assignedTechnicianId: employee1.id,
      scheduledDate: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000),
      state: "New",
      description: "Regular monthly calibration and precision check",
    },
  })

  await prisma.maintenanceRequest.create({
    data: {
      requestNumber: "MR-2025-0006",
      type: "Corrective",
      subject: "Control panel malfunction",
      equipmentId: equipment2.id,
      equipmentCategoryId: pressCategory.id,
      departmentId: productionDept.id,
      employeeId: employee4.id,
      maintenanceTeamId: mechanicsTeam.id,
      assignedTechnicianId: employee1.id,
      scheduledDate: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (overdue)
      state: "Repaired",
      description: "Emergency stop button not responding properly",
    },
  })

  console.log("Created maintenance requests")
  console.log("Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
