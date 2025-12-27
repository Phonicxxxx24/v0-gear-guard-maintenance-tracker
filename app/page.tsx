"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KanbanBoard } from "@/components/kanban-board"
import { EquipmentList } from "@/components/equipment-list"
import { CalendarView } from "@/components/calendar-view"
import { WorkCenterList } from "@/components/work-center-list"
import { Button } from "@/components/ui/button"
import { Wrench, LogOut } from "lucide-react"
import { useRequests } from "@/lib/hooks/use-requests"

export default function HomePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("kanban")
  const [user, setUser] = useState<any>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const { requests, loading, addRequest, updateRequestState, deleteRequest } = useRequests()

  useEffect(() => {
    async function checkAuth() {
      const demoMode = localStorage.getItem("demoMode")
      if (demoMode === "true") {
        setIsDemoMode(true)
        setUser({ name: "Demo User", role: "Viewer" })
        setCheckingAuth(false)
        return
      }

      try {
        const response = await fetch("/api/auth/me")

        if (!response.ok) {
          router.push("/login")
          return
        }

        const data = await response.json()
        setUser(data.employee)
      } catch (error) {
        router.push("/login")
      } finally {
        setCheckingAuth(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      if (isDemoMode) {
        localStorage.removeItem("demoMode")
        router.push("/login")
        return
      }

      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">GearGuard</h1>
                <p className="text-sm text-muted-foreground font-medium">Maintenance Tracker</p>
              </div>
            </div>

            {user && (
              <div className="flex items-center gap-4">
                {isDemoMode && (
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-full shadow-sm">
                    <span className="text-sm font-semibold text-primary animate-pulse">Demo Mode</span>
                  </div>
                )}
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground font-medium">{user.role}</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-xl bg-transparent">
                  <LogOut className="h-4 w-4 mr-2" />
                  {isDemoMode ? "Exit Demo" : "Logout"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 h-12 bg-card/80 backdrop-blur-sm border border-border shadow-sm rounded-xl p-1">
            <TabsTrigger value="kanban" className="rounded-lg font-medium">
              Kanban Board
            </TabsTrigger>
            <TabsTrigger value="equipment" className="rounded-lg font-medium">
              Equipment
            </TabsTrigger>
            <TabsTrigger value="workcenters" className="rounded-lg font-medium">
              Work Centers
            </TabsTrigger>
            <TabsTrigger value="calendar" className="rounded-lg font-medium">
              Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="mt-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <KanbanBoard
                requests={requests}
                onUpdateRequest={updateRequestState}
                onDeleteRequest={deleteRequest}
                onAddRequest={addRequest}
              />
            )}
          </TabsContent>

          <TabsContent value="equipment" className="mt-0">
            <EquipmentList requests={requests} />
          </TabsContent>

          <TabsContent value="workcenters" className="mt-0">
            <WorkCenterList />
          </TabsContent>

          <TabsContent value="calendar" className="mt-0">
            <CalendarView onAddRequest={addRequest} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
