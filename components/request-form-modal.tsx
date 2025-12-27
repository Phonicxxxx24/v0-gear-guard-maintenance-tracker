"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockEquipment, type MaintenanceRequest } from "@/lib/mock-data"

interface RequestFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultDate?: Date
  onAddRequest?: (newRequest: MaintenanceRequest) => void
}

export function RequestFormModal({ open, onOpenChange, defaultDate, onAddRequest }: RequestFormModalProps) {
  const [type, setType] = useState<"corrective" | "preventive">("corrective")
  const [equipmentId, setEquipmentId] = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [scheduledDate, setScheduledDate] = useState(
    defaultDate?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0],
  )
  const [description, setDescription] = useState("")

  const selectedEquipment = mockEquipment.find((e) => e.id === equipmentId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedEquipment && assignedTo && onAddRequest) {
      const newRequest: MaintenanceRequest = {
        id: `req-${Date.now()}`,
        title: `${type === "preventive" ? "Preventive" : "Corrective"} - ${selectedEquipment.name}`,
        equipmentName: selectedEquipment.name,
        equipmentId: selectedEquipment.id,
        team: selectedEquipment.team,
        status: "new",
        assignedTo,
        scheduledDate,
        type,
      }

      console.log("[v0] Creating request:", newRequest)
      onAddRequest(newRequest)
    }

    onOpenChange(false)
    setType("corrective")
    setEquipmentId("")
    setAssignedTo("")
    setScheduledDate(defaultDate?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0])
    setDescription("")
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
            <Select value={type} onValueChange={(v) => setType(v as "corrective" | "preventive")}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="corrective">Corrective</SelectItem>
                <SelectItem value="preventive">Preventive</SelectItem>
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
                {mockEquipment.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} - {item.serialNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEquipment && (
            <div className="rounded-lg border border-border bg-muted/50 p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Team:</span>
                <span className="font-medium">{selectedEquipment.team}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium">{selectedEquipment.category}</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="assigned">Assigned To</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger id="assigned">
                <SelectValue placeholder="Select technician" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="John Smith">John Smith</SelectItem>
                <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                <SelectItem value="Mike Davis">Mike Davis</SelectItem>
                <SelectItem value="Emily Brown">Emily Brown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Scheduled Date</Label>
            <Input id="date" type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Request</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
