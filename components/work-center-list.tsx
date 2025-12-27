"use client"

import { useState, useEffect } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WorkCenterFormModal } from "@/components/work-center-form-modal"

type WorkCenter = {
  id: number
  code: string
  name: string
  tag?: string
  alternativeWorkcenters?: string
  costPerHour: number
  capacityTimeEfficient: number
  oeeTarget: number
}

export function WorkCenterList() {
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>([])
  const [filteredWorkCenters, setFilteredWorkCenters] = useState<WorkCenter[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Demo data fallback
  useEffect(() => {
    const demoWorkCenters: WorkCenter[] = [
      {
        id: 1,
        code: "ASM-1",
        name: "Assembly 1",
        tag: "Main Assembly Line",
        alternativeWorkcenters: "ASM-2",
        costPerHour: 100.0,
        capacityTimeEfficient: 100.0,
        oeeTarget: 85.0,
      },
      {
        id: 2,
        code: "DRL-1",
        name: "Drill 1",
        tag: "Precision Drilling",
        alternativeWorkcenters: "DRL-2, DRL-3",
        costPerHour: 80.0,
        capacityTimeEfficient: 120.0,
        oeeTarget: 90.0,
      },
      {
        id: 3,
        code: "WLD-1",
        name: "Welding Station",
        tag: "Heavy Welding",
        alternativeWorkcenters: "WLD-2",
        costPerHour: 120.0,
        capacityTimeEfficient: 80.0,
        oeeTarget: 75.0,
      },
      {
        id: 4,
        code: "PKG-1",
        name: "Packaging Line 1",
        tag: "Automated Packaging",
        alternativeWorkcenters: "PKG-2",
        costPerHour: 60.0,
        capacityTimeEfficient: 150.0,
        oeeTarget: 95.0,
      },
      {
        id: 5,
        code: "QC-1",
        name: "Quality Control Station",
        tag: "Final Inspection",
        alternativeWorkcenters: "",
        costPerHour: 90.0,
        capacityTimeEfficient: 100.0,
        oeeTarget: 98.0,
      },
    ]

    setWorkCenters(demoWorkCenters)
    setFilteredWorkCenters(demoWorkCenters)
  }, [])

  useEffect(() => {
    const filtered = workCenters.filter(
      (wc) =>
        wc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wc.tag?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredWorkCenters(filtered)
  }, [searchTerm, workCenters])

  const handleAddWorkCenter = (newWorkCenter: Omit<WorkCenter, "id">) => {
    const workCenter: WorkCenter = {
      id: Date.now(),
      ...newWorkCenter,
    }
    setWorkCenters([...workCenters, workCenter])
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Work Centers</CardTitle>
            <CardDescription>Manage production work centers and their capacities</CardDescription>
          </div>
          <Button onClick={() => setIsModalOpen(true)} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Work Center
          </Button>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search work centers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Work Center</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Alternative Workcenters</TableHead>
                <TableHead className="text-right">Cost/Hour</TableHead>
                <TableHead className="text-right">Capacity</TableHead>
                <TableHead className="text-right">Time Eff.</TableHead>
                <TableHead className="text-right">OEE Target</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkCenters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No work centers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredWorkCenters.map((wc) => (
                  <TableRow key={wc.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{wc.name}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-mono">{wc.code}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{wc.tag || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">{wc.alternativeWorkcenters || "-"}</TableCell>
                    <TableCell className="text-right font-medium">${wc.costPerHour.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{wc.capacityTimeEfficient.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{wc.capacityTimeEfficient.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-semibold">
                        {wc.oeeTarget.toFixed(0)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredWorkCenters.length} of {workCenters.length} work centers
        </div>
      </CardContent>

      <WorkCenterFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddWorkCenter} />
    </Card>
  )
}
