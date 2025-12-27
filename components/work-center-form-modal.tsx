"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type WorkCenterFormData = {
  code: string
  name: string
  tag?: string
  alternativeWorkcenters?: string
  costPerHour: number
  capacityTimeEfficient: number
  oeeTarget: number
}

type WorkCenterFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: WorkCenterFormData) => void
}

export function WorkCenterFormModal({ isOpen, onClose, onSubmit }: WorkCenterFormModalProps) {
  const [formData, setFormData] = useState<WorkCenterFormData>({
    code: "",
    name: "",
    tag: "",
    alternativeWorkcenters: "",
    costPerHour: 100,
    capacityTimeEfficient: 100,
    oeeTarget: 85,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      code: "",
      name: "",
      tag: "",
      alternativeWorkcenters: "",
      costPerHour: 100,
      capacityTimeEfficient: 100,
      oeeTarget: 85,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Work Center</DialogTitle>
          <DialogDescription>Create a new work center with capacity and cost information.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">
                Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="code"
                placeholder="e.g., ASM-1"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Assembly 1"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag">Tag</Label>
            <Input
              id="tag"
              placeholder="e.g., Main Assembly Line"
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alternativeWorkcenters">Alternative Workcenters</Label>
            <Input
              id="alternativeWorkcenters"
              placeholder="e.g., ASM-2, ASM-3"
              value={formData.alternativeWorkcenters}
              onChange={(e) => setFormData({ ...formData, alternativeWorkcenters: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="costPerHour">Cost per Hour ($)</Label>
              <Input
                id="costPerHour"
                type="number"
                step="0.01"
                min="0"
                value={formData.costPerHour}
                onChange={(e) => setFormData({ ...formData, costPerHour: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacityTimeEfficient">Capacity</Label>
              <Input
                id="capacityTimeEfficient"
                type="number"
                step="0.01"
                min="0"
                value={formData.capacityTimeEfficient}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacityTimeEfficient: Number.parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="oeeTarget">OEE Target (%)</Label>
              <Input
                id="oeeTarget"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.oeeTarget}
                onChange={(e) => setFormData({ ...formData, oeeTarget: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Work Center</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
