import type {
  MaintenanceRequest,
  Equipment,
  EquipmentCategory,
  MaintenanceTeam,
  Employee,
  Department,
} from "@prisma/client"

// Extended types with relations for API responses
export type MaintenanceRequestWithRelations = MaintenanceRequest & {
  equipment: Equipment & {
    category: EquipmentCategory
  }
  equipmentCategory: EquipmentCategory
  department: Department
  employee: Employee
  maintenanceTeam: MaintenanceTeam
  assignedTechnician?: Employee | null
}

export type EquipmentWithRelations = Equipment & {
  category: EquipmentCategory
  department: Department
  employee: Employee
  maintenanceTeam: MaintenanceTeam
  defaultTechnician: Employee
}

export type KanbanColumn = {
  new: MaintenanceRequestWithRelations[]
  in_progress: MaintenanceRequestWithRelations[]
  repaired: MaintenanceRequestWithRelations[]
  scrap: MaintenanceRequestWithRelations[]
}

export type CalendarEvent = {
  id: number
  date: string
  subject: string
  equipmentName: string
  team: string
  teamColor: string
  requestNumber: string
}
