"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EquipmentFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EquipmentFormModal({ open, onOpenChange }: EquipmentFormModalProps) {
  const [name, setName] = useState("")
  const [serialNumber, setSerialNumber] = useState("")
  const [category, setCategory] = useState("")
  const [team, setTeam] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock API call
    console.log("Creating equipment:", {
      name,
      serialNumber,
      category,
      team,
    })
    onOpenChange(false)
    // Reset form
    setName("")
    setSerialNumber("")
    setCategory("")
    setTeam("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Equipment</DialogTitle>
          <DialogDescription>Add new equipment to the maintenance tracker.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Equipment Name</Label>
            <Input
              id="name"
              placeholder="e.g., Hydraulic Press"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serial">Serial Number</Label>
            <Input
              id="serial"
              placeholder="e.g., HP-2024-001"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="e.g., Heavy Machinery"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="team">Team</Label>
            <Select value={team} onValueChange={setTeam} required>
              <SelectTrigger id="team">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mechanics">Mechanics</SelectItem>
                <SelectItem value="Electricians">Electricians</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Equipment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
