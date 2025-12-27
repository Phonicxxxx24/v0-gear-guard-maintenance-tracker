export type Team = "Mechanics" | "Electricians" | "IT"
export type Status = "new" | "in-progress" | "repaired" | "scrap"
export type EquipmentStatus = "operational" | "maintenance" | "offline"

export interface Equipment {
  id: string
  name: string
  serialNumber: string
  category: string
  team: Team
  status: EquipmentStatus
}

export interface MaintenanceRequest {
  id: string
  title: string
  equipmentId: string
  equipmentName: string
  team: Team
  assignedTo: string
  scheduledDate: string
  status: Status
  type: "corrective" | "preventive"
  description: string
}

export const mockEquipment: Equipment[] = [
  {
    id: "1",
    name: "Hydraulic Press",
    serialNumber: "HP-2024-001",
    category: "Heavy Machinery",
    team: "Mechanics",
    status: "operational",
  },
  {
    id: "2",
    name: "CNC Milling Machine",
    serialNumber: "CNC-2024-005",
    category: "Manufacturing",
    team: "Mechanics",
    status: "maintenance",
  },
  {
    id: "3",
    name: "Industrial Generator",
    serialNumber: "GEN-2024-012",
    category: "Power Systems",
    team: "Electricians",
    status: "operational",
  },
  {
    id: "4",
    name: "HVAC System",
    serialNumber: "HVAC-2024-008",
    category: "Climate Control",
    team: "Electricians",
    status: "operational",
  },
  {
    id: "5",
    name: "Server Rack A1",
    serialNumber: "SRV-2024-101",
    category: "IT Infrastructure",
    team: "IT",
    status: "operational",
  },
  {
    id: "6",
    name: "Network Switch",
    serialNumber: "NSW-2024-056",
    category: "Networking",
    team: "IT",
    status: "offline",
  },
  {
    id: "7",
    name: "Conveyor Belt",
    serialNumber: "CB-2024-022",
    category: "Material Handling",
    team: "Mechanics",
    status: "operational",
  },
  {
    id: "8",
    name: "Backup UPS",
    serialNumber: "UPS-2024-033",
    category: "Power Backup",
    team: "Electricians",
    status: "operational",
  },
]

export const mockRequests: MaintenanceRequest[] = [
  {
    id: "1",
    title: "Oil leak repair",
    equipmentId: "1",
    equipmentName: "Hydraulic Press",
    team: "Mechanics",
    assignedTo: "John Smith",
    scheduledDate: "2024-12-20",
    status: "new",
    type: "corrective",
    description: "Oil leaking from hydraulic seal",
  },
  {
    id: "2",
    title: "Quarterly inspection",
    equipmentId: "2",
    equipmentName: "CNC Milling Machine",
    team: "Mechanics",
    assignedTo: "John Smith",
    scheduledDate: "2024-12-28",
    status: "new",
    type: "preventive",
    description: "Regular quarterly maintenance check",
  },
  {
    id: "3",
    title: "Calibration check",
    equipmentId: "2",
    equipmentName: "CNC Milling Machine",
    team: "Mechanics",
    assignedTo: "Sarah Johnson",
    scheduledDate: "2024-12-25",
    status: "in-progress",
    type: "preventive",
    description: "Calibrate precision tools",
  },
  {
    id: "4",
    title: "Power output test",
    equipmentId: "3",
    equipmentName: "Industrial Generator",
    team: "Electricians",
    assignedTo: "Mike Davis",
    scheduledDate: "2024-12-29",
    status: "in-progress",
    type: "preventive",
    description: "Test load capacity and voltage regulation",
  },
  {
    id: "5",
    title: "Filter replacement",
    equipmentId: "4",
    equipmentName: "HVAC System",
    team: "Electricians",
    assignedTo: "Mike Davis",
    scheduledDate: "2024-12-15",
    status: "repaired",
    type: "preventive",
    description: "Replace air filters",
  },
  {
    id: "6",
    title: "Cooling system upgrade",
    equipmentId: "5",
    equipmentName: "Server Rack A1",
    team: "IT",
    assignedTo: "Emily Brown",
    scheduledDate: "2024-12-30",
    status: "new",
    type: "corrective",
    description: "Install additional cooling fans",
  },
  {
    id: "7",
    title: "Firmware update",
    equipmentId: "6",
    equipmentName: "Network Switch",
    team: "IT",
    assignedTo: "Emily Brown",
    scheduledDate: "2024-12-18",
    status: "in-progress",
    type: "preventive",
    description: "Update to latest firmware version",
  },
  {
    id: "8",
    title: "Belt alignment",
    equipmentId: "7",
    equipmentName: "Conveyor Belt",
    team: "Mechanics",
    assignedTo: "John Smith",
    scheduledDate: "2024-12-22",
    status: "repaired",
    type: "corrective",
    description: "Realign conveyor belt tracking",
  },
  {
    id: "9",
    title: "Battery replacement",
    equipmentId: "8",
    equipmentName: "Backup UPS",
    team: "Electricians",
    assignedTo: "Mike Davis",
    scheduledDate: "2025-01-05",
    status: "new",
    type: "preventive",
    description: "Replace backup batteries",
  },
  {
    id: "10",
    title: "Decommission old unit",
    equipmentId: "6",
    equipmentName: "Network Switch",
    team: "IT",
    assignedTo: "Emily Brown",
    scheduledDate: "2024-12-10",
    status: "scrap",
    type: "corrective",
    description: "Remove and dispose of faulty switch",
  },
  {
    id: "11",
    title: "Safety inspection",
    equipmentId: "1",
    equipmentName: "Hydraulic Press",
    team: "Mechanics",
    assignedTo: "Sarah Johnson",
    scheduledDate: "2024-12-27",
    status: "new",
    type: "preventive",
    description: "Annual safety compliance check",
  },
  {
    id: "12",
    title: "Circuit breaker test",
    equipmentId: "3",
    equipmentName: "Industrial Generator",
    team: "Electricians",
    assignedTo: "Mike Davis",
    scheduledDate: "2024-12-24",
    status: "repaired",
    type: "preventive",
    description: "Test all safety breakers",
  },
]

export function getTeamColor(team: Team): string {
  switch (team) {
    case "Mechanics":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    case "Electricians":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20"
    case "IT":
      return "bg-purple-500/10 text-purple-500 border-purple-500/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}
