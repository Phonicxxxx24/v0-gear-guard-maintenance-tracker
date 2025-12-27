"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { RequestFormModal } from "@/components/request-form-modal"
import { type MaintenanceRequest, getTeamColor } from "@/lib/mock-data"

type Column = "new" | "in-progress" | "repaired" | "scrap"

const columnTitles: Record<Column, string> = {
  new: "New",
  "in-progress": "In Progress",
  repaired: "Repaired",
  scrap: "Scrap",
}

interface KanbanBoardProps {
  requests: MaintenanceRequest[]
  onUpdateRequest: (id: string, updates: Partial<MaintenanceRequest>) => void
  onDeleteRequest: (id: string) => void
  onAddRequest: (newRequest: MaintenanceRequest) => void
}

export function KanbanBoard({ requests, onUpdateRequest, onDeleteRequest, onAddRequest }: KanbanBoardProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDragStart = (id: string) => {
    setDraggedItem(id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (column: Column) => {
    if (!draggedItem) return
    onUpdateRequest(draggedItem, { status: column })
    setDraggedItem(null)
  }

  const isOverdue = (date: string) => {
    return new Date(date) < new Date()
  }

  const columns: Column[] = ["new", "in-progress", "repaired", "scrap"]

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">Maintenance Requests</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => (
          <div
            key={column}
            className="flex flex-col gap-4"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column)}
          >
            <div className="rounded-lg border border-border bg-card/50 p-3 backdrop-blur-sm">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                {columnTitles[column]}
                <span className="ml-2 text-foreground">({requests.filter((r) => r.status === column).length})</span>
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              {requests
                .filter((request) => request.status === column)
                .map((request) => (
                  <Card
                    key={request.id}
                    draggable
                    onDragStart={() => handleDragStart(request.id)}
                    className="cursor-move hover:shadow-lg transition-all border-border bg-card/80 backdrop-blur-sm group"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm font-medium text-foreground leading-snug">
                          {request.title}
                        </CardTitle>
                        <div className="flex items-center gap-1">
                          {isOverdue(request.scheduledDate) &&
                            request.status !== "repaired" &&
                            request.status !== "scrap" && (
                              <Badge variant="destructive" className="text-xs shrink-0">
                                OVERDUE
                              </Badge>
                            )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeleteRequest(request.id)
                            }}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-muted-foreground">{request.equipmentName}</div>

                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className={`${getTeamColor(request.team)} border`}>
                          {request.team}
                        </Badge>

                        <Avatar className="h-6 w-6 border border-border">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {request.assignedTo
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {new Date(request.scheduledDate).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>

      <RequestFormModal open={isModalOpen} onOpenChange={setIsModalOpen} onAddRequest={onAddRequest} />
    </>
  )
}
