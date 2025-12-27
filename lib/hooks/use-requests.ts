"use client"

import { useState, useEffect, useCallback } from "react"
import type { MaintenanceRequestWithRelations } from "@/lib/types"

const DEMO_REQUESTS: MaintenanceRequestWithRelations[] = [
  {
    id: 1,
    requestNumber: "REQ-2025-001",
    type: "Corrective",
    subject: "Oil leak repair",
    description: "Hydraulic oil leaking from main cylinder",
    state: "New",
    scheduledDate: new Date("2025-01-15"),
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-10"),
    equipmentId: 1,
    assignedTechnicianId: 1,
    requestedById: 1,
    equipment: {
      id: 1,
      name: "Hydraulic Press",
      serialNumber: "HP-2404",
      maintenanceTeam: { id: 1, name: "Mechanics" },
    },
    assignedTechnician: {
      id: 1,
      name: "John Smith",
      defaultTeam: { id: 1, name: "Mechanics" },
    },
  },
  {
    id: 2,
    requestNumber: "REQ-2025-002",
    type: "Preventive",
    subject: "Quarterly maintenance",
    description: "Regular maintenance check and lubrication",
    state: "In Progress",
    scheduledDate: new Date("2025-01-20"),
    createdAt: new Date("2025-01-08"),
    updatedAt: new Date("2025-01-12"),
    equipmentId: 2,
    assignedTechnicianId: 2,
    requestedById: 1,
    equipment: {
      id: 2,
      name: "CNC Machine",
      serialNumber: "CNC-1501",
      maintenanceTeam: { id: 1, name: "Mechanics" },
    },
    assignedTechnician: {
      id: 2,
      name: "Sarah Johnson",
      defaultTeam: { id: 2, name: "Electricians" },
    },
  },
  {
    id: 3,
    requestNumber: "REQ-2025-003",
    type: "Corrective",
    subject: "Motor replacement",
    description: "Main drive motor making unusual noise",
    state: "Repaired",
    scheduledDate: new Date("2025-01-05"),
    createdAt: new Date("2025-01-02"),
    updatedAt: new Date("2025-01-08"),
    equipmentId: 4,
    assignedTechnicianId: 2,
    requestedById: 1,
    equipment: {
      id: 4,
      name: "Conveyor Belt",
      serialNumber: "CB-7789",
      maintenanceTeam: { id: 2, name: "Electricians" },
    },
    assignedTechnician: {
      id: 2,
      name: "Sarah Johnson",
      defaultTeam: { id: 2, name: "Electricians" },
    },
  },
]

export function useRequests() {
  const [requests, setRequests] = useState<MaintenanceRequestWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/requests/kanban")

      if (!response.ok) {
        console.log("[v0] API not available, using demo data")
        setRequests(DEMO_REQUESTS)
        setLoading(false)
        return
      }

      const data = await response.json()
      const allRequests = [...data.new, ...data.in_progress, ...data.repaired, ...data.scrap]
      setRequests(allRequests)
    } catch (err) {
      console.log("[v0] Using demo data for requests")
      setRequests(DEMO_REQUESTS)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const addRequest = useCallback(
    async (requestData: any) => {
      try {
        const response = await fetch("/api/requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        })

        if (!response.ok) {
          // Demo mode fallback - create local request
          const newRequest: MaintenanceRequestWithRelations = {
            id: Date.now(),
            requestNumber: `REQ-2025-${String(requests.length + 1).padStart(3, "0")}`,
            type: requestData.type,
            subject: requestData.subject,
            description: requestData.description || "",
            state: "New",
            scheduledDate: new Date(requestData.scheduledDate),
            createdAt: new Date(),
            updatedAt: new Date(),
            equipmentId: requestData.equipmentId,
            assignedTechnicianId: requestData.assignedTechnicianId,
            requestedById: 1,
            equipment: {
              id: requestData.equipmentId,
              name: requestData.equipmentName || "Equipment",
              serialNumber: requestData.equipmentSerial || "N/A",
              maintenanceTeam: { id: 1, name: requestData.teamName || "Mechanics" },
            },
            assignedTechnician: {
              id: requestData.assignedTechnicianId,
              name: requestData.technicianName || "Technician",
              defaultTeam: { id: 1, name: requestData.teamName || "Mechanics" },
            },
          }

          console.log("[v0] Created demo request:", newRequest)
          setRequests((prev) => [...prev, newRequest])
          return newRequest
        }

        const newRequest = await response.json()
        setRequests((prev) => [...prev, newRequest])
        return newRequest
      } catch (err) {
        console.error("[v0] Error adding request:", err)
        throw err
      }
    },
    [requests.length],
  )

  const updateRequestState = useCallback(async (id: number, state: string) => {
    try {
      const response = await fetch(`/api/requests/${id}/state`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state }),
      })

      if (!response.ok) {
        // Demo mode fallback
        setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, state, updatedAt: new Date() } : req)))
        return
      }

      const updatedRequest = await response.json()
      setRequests((prev) => prev.map((req) => (req.id === id ? updatedRequest : req)))
      return updatedRequest
    } catch (err) {
      // Demo mode fallback
      setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, state, updatedAt: new Date() } : req)))
    }
  }, [])

  const deleteRequest = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        // Demo mode fallback
        setRequests((prev) => prev.filter((req) => req.id !== id))
        return
      }

      setRequests((prev) => prev.filter((req) => req.id !== id))
    } catch (err) {
      // Demo mode fallback
      setRequests((prev) => prev.filter((req) => req.id !== id))
    }
  }, [])

  return {
    requests,
    loading,
    error,
    fetchRequests,
    addRequest,
    updateRequestState,
    deleteRequest,
  }
}
