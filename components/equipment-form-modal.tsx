"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EquipmentFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddEquipment?: (equipmentData: any) => void
}

export function EquipmentFormModal({ open, onOpenChange, onAddEquipment }: EquipmentFormModalProps) {
  const [name, setName] = useState("")
  const [serialNumber, setSerialNumber] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [departmentId, setDepartmentId] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [location, setLocation] = useState("")
  const [purchaseDate, setPurchaseDate] = useState("")
  const [warrantyEnd, setWarrantyEnd] = useState("")
  const [maintenanceInterval, setMaintenanceInterval] = useState("90")
  const [submitting, setSubmitting] = useState(false)

  const [categories, setCategories] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<any>(null)

  const demoCategories = [
    { id: 1, name: "Industrial Machinery", responsibleTeamId: 1, responsibleTeam: { name: "Mechanics" } },
    { id: 2, name: "Electrical Systems", responsibleTeamId: 2, responsibleTeam: { name: "Electricians" } },
    { id: 3, name: "IT Equipment", responsibleTeamId: 3, responsibleTeam: { name: "IT" } },
    { id: 4, name: "HVAC Systems", responsibleTeamId: 1, responsibleTeam: { name: "Mechanics" } },
    { id: 5, name: "Safety Equipment", responsibleTeamId: 2, responsibleTeam: { name: "Electricians" } },
  ]

  const demoDepartments = [
    { id: 1, name: "Production", code: "PROD" },
    { id: 2, name: "Quality Assurance", code: "QA" },
    { id: 3, name: "IT Department", code: "IT" },
    { id: 4, name: "Maintenance", code: "MAINT" },
    { id: 5, name: "Logistics", code: "LOG" },
  ]

  const demoEmployees = [
    { id: 1, name: "John Smith", department: { name: "Production" } },
    { id: 2, name: "Sarah Johnson", department: { name: "Quality Assurance" } },
    { id: 3, name: "Mike Chen", department: { name: "IT Department" } },
    { id: 4, name: "Emma Wilson", department: { name: "Maintenance" } },
    { id: 5, name: "David Brown", department: { name: "Logistics" } },
  ]

  useEffect(() => {
    async function fetchFormData() {
      if (!open) return

      try {
        const [categoriesRes, departmentsRes, employeesRes] = await Promise.all([
          fetch("/api/equipment-categories"),
          fetch("/api/departments"),
          fetch("/api/employees"),
        ])

        if (categoriesRes.ok && departmentsRes.ok && employeesRes.ok) {
          const categoriesData = await categoriesRes.json()
          const departmentsData = await departmentsRes.json()
          const employeesData = await employeesRes.json()

          setCategories(categoriesData)
          setDepartments(departmentsData)
          setEmployees(employeesData)
        } else {
          console.log("[v0] API failed, using demo data")
          setCategories(demoCategories)
          setDepartments(demoDepartments)
          setEmployees(demoEmployees)
        }
      } catch (error) {
        console.log("[v0] Using demo data for equipment form")
        setCategories(demoCategories)
        setDepartments(demoDepartments)
        setEmployees(demoEmployees)
      }
    }

    fetchFormData()
  }, [open])

  useEffect(() => {
    if (categoryId) {
      const category = categories.find((c) => c.id.toString() === categoryId)
      setSelectedCategory(category)
    } else {
      setSelectedCategory(null)
    }
  }, [categoryId, categories])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCategory) return

    setSubmitting(true)

    try {
      const selectedDept = departments.find((d) => d.id.toString() === departmentId)
      const selectedEmp = employees.find((emp) => emp.id.toString() === employeeId)

      const equipmentData = {
        name,
        serialNumber,
        categoryId: Number.parseInt(categoryId),
        departmentId: Number.parseInt(departmentId),
        employeeId: Number.parseInt(employeeId),
        location: location || "Not Specified",
        purchaseDate: purchaseDate || new Date().toISOString(),
        warrantyExpiry: warrantyEnd || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        maintenanceInterval: Number.parseInt(maintenanceInterval),
        maintenanceTeamId: selectedCategory.responsibleTeamId,
        defaultTechnicianId: Number.parseInt(employeeId),
        // Additional data for demo mode
        category: selectedCategory.name,
        department: selectedDept?.name,
        responsibleEmployee: selectedEmp?.name,
      }

      console.log("[v0] Creating equipment with data:", equipmentData)

      const response = await fetch("/api/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(equipmentData),
      })

      if (!response.ok) {
        // Demo mode fallback
        if (onAddEquipment) {
          console.log("[v0] Using demo mode to add equipment")
          onAddEquipment(equipmentData)
        }
      }

      // Close modal and reset form
      onOpenChange(false)
      setName("")
      setSerialNumber("")
      setCategoryId("")
      setDepartmentId("")
      setEmployeeId("")
      setLocation("")
      setPurchaseDate("")
      setWarrantyEnd("")
      setMaintenanceInterval("90")
      setSelectedCategory(null)
    } catch (error) {
      console.error("[v0] Error creating equipment:", error)
      // Demo mode fallback
      if (onAddEquipment) {
        const selectedDept = departments.find((d) => d.id.toString() === departmentId)
        const selectedEmp = employees.find((emp) => emp.id.toString() === employeeId)

        onAddEquipment({
          name,
          serialNumber,
          location: location || "Not Specified",
          purchaseDate: purchaseDate || new Date().toISOString(),
          warrantyExpiry: warrantyEnd || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          maintenanceInterval: Number.parseInt(maintenanceInterval),
          category: selectedCategory.name,
          department: selectedDept?.name,
          responsibleEmployee: selectedEmp?.name,
        })

        // Close modal and reset
        onOpenChange(false)
        setName("")
        setSerialNumber("")
        setCategoryId("")
        setDepartmentId("")
        setEmployeeId("")
        setLocation("")
        setPurchaseDate("")
        setWarrantyEnd("")
        setMaintenanceInterval("90")
        setSelectedCategory(null)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCategory && (
            <div className="rounded-lg border border-border bg-muted/50 p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Maintenance Team:</span>
                <span className="font-medium">{selectedCategory.responsibleTeam.name}</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={departmentId} onValueChange={setDepartmentId} required>
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employee">Responsible Employee</Label>
            <Select value={employeeId} onValueChange={setEmployeeId} required>
              <SelectTrigger id="employee">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id.toString()}>
                    {emp.name} - {emp.department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., Building A, Floor 2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interval">Maintenance Interval (days)</Label>
            <Input
              id="interval"
              type="number"
              placeholder="90"
              value={maintenanceInterval}
              onChange={(e) => setMaintenanceInterval(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchase">Purchase Date</Label>
              <Input id="purchase" type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="warranty">Warranty End</Label>
              <Input id="warranty" type="date" value={warrantyEnd} onChange={(e) => setWarrantyEnd(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create Equipment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
