"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RequestFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultDate?: Date
  onAddRequest?: (requestData: any) => Promise<void>
}

export function RequestFormModal({ open, onOpenChange, defaultDate, onAddRequest }: RequestFormModalProps) {
  const [type, setType] = useState<"Corrective" | "Preventive">("Corrective")
  const [equipmentId, setEquipmentId] = useState("")
  const [assignedTechnicianId, setAssignedTechnicianId] = useState("")
  const [workCenterId, setWorkCenterId] = useState("")
  const [scheduledDate, setScheduledDate] = useState(
    defaultDate?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0],
  )
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [equipment, setEquipment] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [workCenters, setWorkCenters] = useState<any[]>([])
  const [selectedEquipmentData, setSelectedEquipmentData] = useState<any>(null)

  const demoEquipment = [
    { id: 1, name: "Hydraulic Press", serialNumber: "HP-2404" },
    { id: 2, name: "CNC Machine", serialNumber: "CNC-1501" },
    { id: 3, name: "Assembly Robot", serialNumber: "AR-3302" },
    { id: 4, name: "Conveyor Belt", serialNumber: "CB-7789" },
    { id: 5, name: "Server Rack A1", serialNumber: "SRV-A101" },
  ]

  const demoEmployees = [
    { id: 1, name: "John Smith", defaultTeam: { name: "Mechanics" } },
    { id: 2, name: "Sarah Johnson", defaultTeam: { name: "Electricians" } },
    { id: 3, name: "Mike Chen", defaultTeam: { name: "IT" } },
    { id: 4, name: "Emma Wilson", defaultTeam: { name: "Mechanics" } },
    { id: 5, name: "David Brown", defaultTeam: { name: "Electricians" } },
  ]

  const demoWorkCenters = [
    { id: 1, code: "ASM-1", name: "Assembly 1" },
    { id: 2, code: "DRL-1", name: "Drill 1" },
    { id: 3, code: "WLD-1", name: "Welding Station" },
    { id: 4, code: "PKG-1", name: "Packaging Line 1" },
    { id: 5, code: "QC-1", name: "Quality Control Station" },
  ]

  const demoEquipmentDetails = {
    maintenanceTeam: { name: "Mechanics" },
    category: { name: "Industrial Machinery" },
    department: { name: "Production" },
    defaultTechnicianId: 1,
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [equipmentRes, employeesRes, workCentersRes] = await Promise.all([
          fetch("/api/equipment"),
          fetch("/api/employees?role=Technician"),
          fetch("/api/workcenters").catch(() => null),
        ])

        if (equipmentRes.ok && employeesRes.ok) {
          const equipmentData = await equipmentRes.json()
          const employeesData = await employeesRes.json()

          setEquipment(equipmentData)
          setEmployees(employeesData)

          if (workCentersRes?.ok) {
            const workCentersData = await workCentersRes.json()
            setWorkCenters(workCentersData)
          } else {
            setWorkCenters(demoWorkCenters)
          }
        } else {
          console.log("[v0] API failed, using demo data")
          setEquipment(demoEquipment)
          setEmployees(demoEmployees)
          setWorkCenters(demoWorkCenters)
        }
      } catch (error) {
        console.log("[v0] Using demo data for request form")
        setEquipment(demoEquipment)
        setEmployees(demoEmployees)
        setWorkCenters(demoWorkCenters)
      }
    }

    if (open) {
      fetchData()
    }
  }, [open])

  useEffect(() => {
    async function fetchEquipmentDetails() {
      if (!equipmentId) {
        setSelectedEquipmentData(null)
        return
      }

      try {
        const response = await fetch(`/api/equipment/${equipmentId}`)
        if (response.ok) {
          const data = await response.json()
          setSelectedEquipmentData(data)
          if (!assignedTechnicianId) {
            setAssignedTechnicianId(data.defaultTechnicianId.toString())
          }
        } else {
          setSelectedEquipmentData(demoEquipmentDetails)
          if (!assignedTechnicianId) {
            setAssignedTechnicianId("1")
          }
        }
      } catch (error) {
        console.log("[v0] Using demo equipment details")
        setSelectedEquipmentData(demoEquipmentDetails)
        if (!assignedTechnicianId) {
          setAssignedTechnicianId("1")
        }
      }
    }

    fetchEquipmentDetails()
  }, [equipmentId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!equipmentId || !assignedTechnicianId || !subject || !onAddRequest) return

    setSubmitting(true)

    try {
      const selectedEquipment = equipment.find((eq) => eq.id.toString() === equipmentId)
      const selectedTechnician = employees.find((emp) => emp.id.toString() === assignedTechnicianId)
      const selectedWorkCenter = workCenters.find((wc) => wc.id.toString() === workCenterId)

      const requestData = {
        type,
        subject,
        description,
        equipmentId: Number.parseInt(equipmentId),
        assignedTechnicianId: Number.parseInt(assignedTechnicianId),
        scheduledDate,
        equipmentName: selectedEquipment?.name,
        equipmentSerial: selectedEquipment?.serialNumber,
        technicianName: selectedTechnician?.name,
        teamName: selectedEquipment?.maintenanceTeam?.name || selectedTechnician?.defaultTeam?.name,
        workCenterName: selectedWorkCenter?.name,
        workCenterCode: selectedWorkCenter?.code,
      }

      console.log("[v0] Creating request with data:", requestData)
      await onAddRequest(requestData)

      onOpenChange(false)
      setType("Corrective")
      setEquipmentId("")
      setAssignedTechnicianId("")
      setWorkCenterId("")
      setSubject("")
      setDescription("")
      setScheduledDate(defaultDate?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0])
      setSelectedEquipmentData(null)
    } catch (error) {
      console.error("[v0] Error submitting request:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Maintenance Request</DialogTitle>
          <DialogDescription>Fill in the details to create a new maintenance request.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Request Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as "Corrective" | "Preventive")}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Corrective">Corrective</SelectItem>
                <SelectItem value="Preventive">Preventive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipment">Equipment</Label>
            <Select value={equipmentId} onValueChange={setEquipmentId}>
              <SelectTrigger id="equipment">
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                {equipment.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.name} - {item.serialNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEquipmentData && (
            <div className="rounded-lg border border-border bg-muted/50 p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Team:</span>
                <span className="font-medium">{selectedEquipmentData.maintenanceTeam.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium">{selectedEquipmentData.category.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department:</span>
                <span className="font-medium">{selectedEquipmentData.department.name}</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Brief description of the maintenance task"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assigned">Assigned To</Label>
            <Select value={assignedTechnicianId} onValueChange={setAssignedTechnicianId}>
              <SelectTrigger id="assigned">
                <SelectValue placeholder="Select technician" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id.toString()}>
                    {emp.name} {emp.defaultTeam && `- ${emp.defaultTeam.name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workcenter">Work Center (Optional)</Label>
            <Select value={workCenterId} onValueChange={setWorkCenterId}>
              <SelectTrigger id="workcenter">
                <SelectValue placeholder="Select work center" />
              </SelectTrigger>
              <SelectContent>
                {workCenters.map((wc) => (
                  <SelectItem key={wc.id} value={wc.id.toString()}>
                    {wc.name} - {wc.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Scheduled Date</Label>
            <Input
              id="date"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the maintenance work needed..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
