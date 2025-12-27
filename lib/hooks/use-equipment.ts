"use client"

import { useState, useEffect, useCallback } from "react"
import type { EquipmentWithRelations } from "@/lib/types"

const DEMO_EQUIPMENT: EquipmentWithRelations[] = [
  {
    id: 1,
    name: "Hydraulic Press",
    serialNumber: "HP-2404",
    location: "Building A, Floor 1",
    purchaseDate: new Date("2020-03-15"),
    warrantyExpiry: new Date("2025-03-15"),
    maintenanceInterval: 90,
    lastMaintenanceDate: new Date("2024-10-15"),
    nextMaintenanceDate: new Date("2025-01-15"),
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: 1,
    departmentId: 1,
    maintenanceTeamId: 1,
    defaultTechnicianId: 1,
    category: { id: 1, name: "Industrial Machinery" },
    department: { id: 1, name: "Production" },
    maintenanceTeam: { id: 1, name: "Mechanics" },
    defaultTechnician: { id: 1, name: "John Smith" },
  },
  {
    id: 2,
    name: "CNC Machine",
    serialNumber: "CNC-1501",
    location: "Building A, Floor 2",
    purchaseDate: new Date("2021-06-20"),
    warrantyExpiry: new Date("2026-06-20"),
    maintenanceInterval: 60,
    lastMaintenanceDate: new Date("2024-11-01"),
    nextMaintenanceDate: new Date("2025-01-01"),
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: 1,
    departmentId: 1,
    maintenanceTeamId: 1,
    defaultTechnicianId: 1,
    category: { id: 1, name: "Industrial Machinery" },
    department: { id: 1, name: "Production" },
    maintenanceTeam: { id: 1, name: "Mechanics" },
    defaultTechnician: { id: 1, name: "John Smith" },
  },
  {
    id: 3,
    name: "Assembly Robot",
    serialNumber: "AR-3302",
    location: "Building B, Floor 1",
    purchaseDate: new Date("2022-01-10"),
    warrantyExpiry: new Date("2027-01-10"),
    maintenanceInterval: 120,
    lastMaintenanceDate: new Date("2024-09-15"),
    nextMaintenanceDate: new Date("2025-01-15"),
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: 2,
    departmentId: 1,
    maintenanceTeamId: 2,
    defaultTechnicianId: 2,
    category: { id: 2, name: "Robotics" },
    department: { id: 1, name: "Production" },
    maintenanceTeam: { id: 2, name: "Electricians" },
    defaultTechnician: { id: 2, name: "Sarah Johnson" },
  },
  {
    id: 4,
    name: "Conveyor Belt",
    serialNumber: "CB-7789",
    location: "Building A, Floor 1",
    purchaseDate: new Date("2019-11-05"),
    warrantyExpiry: new Date("2024-11-05"),
    maintenanceInterval: 30,
    lastMaintenanceDate: new Date("2024-12-01"),
    nextMaintenanceDate: new Date("2024-12-31"),
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: 1,
    departmentId: 1,
    maintenanceTeamId: 2,
    defaultTechnicianId: 2,
    category: { id: 1, name: "Industrial Machinery" },
    department: { id: 1, name: "Production" },
    maintenanceTeam: { id: 2, name: "Electricians" },
    defaultTechnician: { id: 2, name: "Sarah Johnson" },
  },
  {
    id: 5,
    name: "Server Rack A1",
    serialNumber: "SRV-A101",
    location: "Data Center, Rack 1",
    purchaseDate: new Date("2023-03-20"),
    warrantyExpiry: new Date("2028-03-20"),
    maintenanceInterval: 180,
    lastMaintenanceDate: new Date("2024-06-20"),
    nextMaintenanceDate: new Date("2024-12-20"),
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: 3,
    departmentId: 3,
    maintenanceTeamId: 3,
    defaultTechnicianId: 3,
    category: { id: 3, name: "IT Equipment" },
    department: { id: 3, name: "IT Department" },
    maintenanceTeam: { id: 3, name: "IT" },
    defaultTechnician: { id: 3, name: "Mike Chen" },
  },
]

export function useEquipment() {
  const [equipment, setEquipment] = useState<EquipmentWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/equipment")

      if (!response.ok) {
        console.log("[v0] API not available, using demo equipment")
        setEquipment(DEMO_EQUIPMENT)
        setLoading(false)
        return
      }

      const data = await response.json()
      setEquipment(data)
    } catch (err) {
      console.log("[v0] Using demo equipment data")
      setEquipment(DEMO_EQUIPMENT)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEquipment()
  }, [fetchEquipment])

  const addEquipment = useCallback((equipmentData: any) => {
    const newEquipment: EquipmentWithRelations = {
      id: Date.now(),
      name: equipmentData.name,
      serialNumber: equipmentData.serialNumber,
      location: equipmentData.location,
      purchaseDate: new Date(equipmentData.purchaseDate),
      warrantyExpiry: new Date(equipmentData.warrantyExpiry),
      maintenanceInterval: equipmentData.maintenanceInterval,
      lastMaintenanceDate: new Date(),
      nextMaintenanceDate: new Date(Date.now() + equipmentData.maintenanceInterval * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      categoryId: 1,
      departmentId: 1,
      maintenanceTeamId: 1,
      defaultTechnicianId: 1,
      category: { id: 1, name: equipmentData.category || "General" },
      department: { id: 1, name: equipmentData.department || "General" },
      maintenanceTeam: { id: 1, name: "Mechanics" },
      defaultTechnician: { id: 1, name: equipmentData.responsibleEmployee || "Unassigned" },
    }

    setEquipment((prev) => [...prev, newEquipment])
  }, [])

  return {
    equipment,
    loading,
    error,
    fetchEquipment,
    addEquipment,
  }
}
