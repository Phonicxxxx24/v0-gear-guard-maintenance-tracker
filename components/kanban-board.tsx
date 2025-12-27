"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { RequestFormModal } from "@/components/request-form-modal"
import type { MaintenanceRequestWithRelations } from "@/lib/types"

type Column = "New" | "In Progress" | "Repaired" | "Scrap"

const columnTitles: Record<Column, string> = {
  New: "New",
  "In Progress": "In Progress",
  Repaired: "Repaired",
  Scrap: "Scrap",
}

interface KanbanBoardProps {
  requests: MaintenanceRequestWithRelations[]
  onUpdateRequest: (id: number, state: string) => Promise<void>
  onDeleteRequest: (id: number) => Promise<void>
  onAddRequest: (requestData: any) => Promise<void>
}

function getTeamColor(teamName: string) {
  if (teamName === "Mechanics") return "bg-blue-500/10 text-blue-500 border-blue-500/20"
  if (teamName === "Electricians") return "bg-amber-500/10 text-amber-500 border-amber-500/20"
  if (teamName === "IT Support") return "bg-purple-500/10 text-purple-500 border-purple-500/20"
  return "bg-gray-500/10 text-gray-500 border-gray-500/20"
}

export function KanbanBoard({ requests, onUpdateRequest, onDeleteRequest, onAddRequest }: KanbanBoardProps) {
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [movingCardId, setMovingCardId] = useState<number | null>(null)

  const handleDragStart = (id: number) => {
    setDraggedItem(id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (column: Column) => {
    if (!draggedItem) return
    setMovingCardId(draggedItem)
    try {
      await onUpdateRequest(draggedItem, column)
      setTimeout(() => setMovingCardId(null), 300)
    } catch (error) {
      console.error("[v0] Drop failed:", error)
      setMovingCardId(null)
    }
    setDraggedItem(null)
  }

  const isOverdue = (date: Date | null) => {
    if (!date) return false
    return new Date(date) < new Date()
  }

  const getNextColumn = (currentColumn: Column): Column | null => {
    const columnOrder: Column[] = ["New", "In Progress", "Repaired", "Scrap"]
    const currentIndex = columnOrder.indexOf(currentColumn)
    if (currentIndex < columnOrder.length - 1) {
      return columnOrder[currentIndex + 1]
    }
    return null
  }

  const getPreviousColumn = (currentColumn: Column): Column | null => {
    const columnOrder: Column[] = ["New", "In Progress", "Repaired", "Scrap"]
    const currentIndex = columnOrder.indexOf(currentColumn)
    if (currentIndex > 0) {
      return columnOrder[currentIndex - 1]
    }
    return null
  }

  const handleMoveCard = async (requestId: number, newColumn: Column) => {
    setMovingCardId(requestId)
    try {
      await onUpdateRequest(requestId, newColumn)
      setTimeout(() => setMovingCardId(null), 300)
    } catch (error) {
      console.error("[v0] Move failed:", error)
      setMovingCardId(null)
    }
  }

  const columns: Column[] = ["New", "In Progress", "Repaired", "Scrap"]

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-foreground">Maintenance Requests</h2>
        <Button onClick={() => setIsModalOpen(true)} size="lg" className="shadow-lg">
          <Plus className="mr-2 h-5 w-5" />
          New Request
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1600px] mx-auto">
        {columns.map((column) => (
          <div
            key={column}
            className="flex flex-col gap-4"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column)}
          >
            <div className="rounded-2xl border border-border bg-gradient-to-br from-card/80 to-card/50 p-4 backdrop-blur-sm shadow-sm">
              <h3 className="font-semibold text-base text-foreground tracking-wide">
                {columnTitles[column]}
                <span className="ml-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold">
                  {requests.filter((r) => r.state === column).length}
                </span>
              </h3>
            </div>

            <div className="flex flex-col gap-4 min-h-[400px]">
              {requests
                .filter((request) => request.state === column)
                .map((request) => (
                  <Card
                    key={request.id}
                    draggable
                    onDragStart={() => handleDragStart(request.id)}
                    className={`cursor-move hover:shadow-xl transition-all duration-300 border-border bg-card backdrop-blur-sm group rounded-2xl ${
                      movingCardId === request.id ? "scale-95 opacity-50" : "hover:scale-[1.02]"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base font-semibold text-foreground leading-snug">
                          {request.subject}
                        </CardTitle>
                        <div className="flex items-center gap-1">
                          {isOverdue(request.scheduledDate) &&
                            request.state !== "Repaired" &&
                            request.state !== "Scrap" && (
                              <Badge variant="destructive" className="text-xs shrink-0 font-bold shadow-sm">
                                OVERDUE
                              </Badge>
                            )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hover:bg-destructive/10"
                            onClick={async (e) => {
                              e.stopPropagation()
                              await onDeleteRequest(request.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm font-medium text-muted-foreground">
                        {request.equipment?.name || "Unknown Equipment"}
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge
                          variant="secondary"
                          className={`${getTeamColor(request.maintenanceTeam?.name || "")} border rounded-full font-medium`}
                        >
                          {request.maintenanceTeam?.name || "Unassigned"}
                        </Badge>

                        {request.assignedTechnician && (
                          <Avatar className="h-7 w-7 border-2 border-border shadow-sm">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                              {request.assignedTechnician.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>

                      {request.scheduledDate && (
                        <div className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg inline-block">
                          {new Date(request.scheduledDate).toLocaleDateString()}
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-3 border-t border-border">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 text-sm flex-1 rounded-xl font-medium hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all duration-200 disabled:opacity-40 bg-transparent"
                          disabled={!getPreviousColumn(request.state as Column)}
                          onClick={async (e) => {
                            e.stopPropagation()
                            const prevColumn = getPreviousColumn(request.state as Column)
                            if (prevColumn) {
                              await handleMoveCard(request.id, prevColumn)
                            }
                          }}
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Back
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 text-sm flex-1 rounded-xl font-medium hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all duration-200 disabled:opacity-40 bg-transparent"
                          disabled={!getNextColumn(request.state as Column)}
                          onClick={async (e) => {
                            e.stopPropagation()
                            const nextColumn = getNextColumn(request.state as Column)
                            if (nextColumn) {
                              await handleMoveCard(request.id, nextColumn)
                            }
                          }}
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
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
