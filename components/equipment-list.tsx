"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import { EquipmentFormModal } from "@/components/equipment-form-modal"
import type { MaintenanceRequestWithRelations } from "@/lib/types"
import { useEquipment } from "@/lib/hooks/use-equipment"

interface EquipmentListProps {
  requests: MaintenanceRequestWithRelations[]
}

function getTeamColor(teamName: string) {
  if (teamName === "Mechanics") return "bg-blue-500/10 text-blue-500 border-blue-500/20"
  if (teamName === "Electricians") return "bg-amber-500/10 text-amber-500 border-amber-500/20"
  if (teamName === "IT") return "bg-purple-500/10 text-purple-500 border-purple-500/20"
  return "bg-gray-500/10 text-gray-500 border-gray-500/20"
}

export function EquipmentList({ requests }: EquipmentListProps) {
  const { equipment, loading, addEquipment } = useEquipment()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [teamFilter, setTeamFilter] = useState<string>("all")

  const getMaintenanceCount = (equipmentId: number) => {
    return requests.filter((r) => r.equipmentId === equipmentId && r.state !== "Repaired" && r.state !== "Scrap").length
  }

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTeam = teamFilter === "all" || item.maintenanceTeam.name === teamFilter
    return matchesSearch && matchesTeam
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading equipment...</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-semibold text-foreground">Equipment</h2>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Equipment
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or serial..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="Mechanics">Mechanics</SelectItem>
                  <SelectItem value="Electricians">Electricians</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Equipment Table */}
        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Equipment List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Maintenance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEquipment.map((item) => {
                    const maintenanceCount = getMaintenanceCount(item.id)
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-muted-foreground">{item.serialNumber}</TableCell>
                        <TableCell>{item.category.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`${getTeamColor(item.maintenanceTeam.name)} border`}>
                            {item.maintenanceTeam.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{item.location}</TableCell>
                        <TableCell>
                          {maintenanceCount > 0 ? (
                            <Badge variant="outline" className="text-primary border-primary/20">
                              {maintenanceCount} open
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">No open requests</span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <EquipmentFormModal open={isModalOpen} onOpenChange={setIsModalOpen} onAddEquipment={addEquipment} />
    </>
  )
}
