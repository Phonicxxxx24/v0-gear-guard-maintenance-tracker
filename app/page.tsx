"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KanbanBoard } from "@/components/kanban-board"
import { EquipmentList } from "@/components/equipment-list"
import { CalendarView } from "@/components/calendar-view"
import { Wrench } from "lucide-react"
import { type MaintenanceRequest, mockRequests } from "@/lib/mock-data"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("kanban")
  const [requests, setRequests] = useState<MaintenanceRequest[]>(mockRequests)

  const handleAddRequest = (newRequest: MaintenanceRequest) => {
    setRequests((prev) => [...prev, newRequest])
  }

  const handleDeleteRequest = (id: string) => {
    setRequests((prev) => prev.filter((req) => req.id !== id))
  }

  const handleUpdateRequest = (id: string, updates: Partial<MaintenanceRequest>) => {
    setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, ...updates } : req)))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">GearGuard</h1>
                <p className="text-sm text-muted-foreground">Maintenance Tracker</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="mt-0">
            <KanbanBoard
              requests={requests}
              onUpdateRequest={handleUpdateRequest}
              onDeleteRequest={handleDeleteRequest}
              onAddRequest={handleAddRequest}
            />
          </TabsContent>

          <TabsContent value="equipment" className="mt-0">
            <EquipmentList requests={requests} />
          </TabsContent>

          <TabsContent value="calendar" className="mt-0">
            <CalendarView requests={requests} onAddRequest={handleAddRequest} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
