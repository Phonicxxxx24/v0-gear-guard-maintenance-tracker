"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { RequestFormModal } from "@/components/request-form-modal"
import type { CalendarEvent } from "@/lib/types"

interface CalendarViewProps {
  onAddRequest: (requestData: any) => Promise<void>
}

function getTeamColor(teamName: string) {
  if (teamName === "Mechanics") return "bg-blue-500/10 text-blue-500 border-blue-500/20"
  if (teamName === "Electricians") return "bg-amber-500/10 text-amber-500 border-amber-500/20"
  if (teamName === "IT Support") return "bg-purple-500/10 text-purple-500 border-purple-500/20"
  return "bg-gray-500/10 text-gray-500 border-gray-500/20"
}

const demoCalendarEvents: CalendarEvent[] = [
  {
    id: 1,
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 5).toISOString().split("T")[0],
    team: "Mechanics",
    description: "CNC Machine Preventive Maintenance",
  },
  {
    id: 2,
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 12).toISOString().split("T")[0],
    team: "Electricians",
    description: "Power Panel Inspection",
  },
  {
    id: 3,
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 18).toISOString().split("T")[0],
    team: "IT Support",
    description: "Server Backup Verification",
  },
  {
    id: 4,
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 22).toISOString().split("T")[0],
    team: "Mechanics",
    description: "Conveyor Belt Maintenance",
  },
  {
    id: 5,
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 25).toISOString().split("T")[0],
    team: "Electricians",
    description: "Generator Testing",
  },
]

export function CalendarView({ onAddRequest }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCalendarEvents() {
      try {
        setLoading(true)
        const response = await fetch("/api/requests/calendar")
        if (!response.ok) throw new Error("Failed to fetch calendar events")

        const data = await response.json()
        setEvents(data)
        console.log("[v0] Calendar events loaded from API")
      } catch (error) {
        console.log("[v0] API not available, using demo calendar events")
        setEvents(demoCalendarEvents)
      } finally {
        setLoading(false)
      }
    }

    fetchCalendarEvents()
  }, [])

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((e) => e.date === dateStr)
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(clickedDate)
    setIsModalOpen(true)
  }

  const handleModalClose = async (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      try {
        const response = await fetch("/api/requests/calendar")
        if (response.ok) {
          const data = await response.json()
          setEvents(data)
        }
      } catch (error) {
        console.log("[v0] Keeping existing calendar data")
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading calendar...</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-foreground">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Preventive Maintenance Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Calendar days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const eventsForDay = getEventsForDate(day)
                const isToday =
                  day === new Date().getDate() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear()

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`
                      aspect-square p-2 rounded-lg border border-border
                      hover:bg-accent hover:text-accent-foreground transition-colors
                      ${isToday ? "bg-primary/10 border-primary/20" : "bg-card/50"}
                      flex flex-col items-start justify-start
                    `}
                  >
                    <span className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : "text-foreground"}`}>
                      {day}
                    </span>
                    <div className="flex flex-col gap-1 w-full">
                      {eventsForDay.slice(0, 2).map((event) => (
                        <Badge
                          key={event.id}
                          variant="secondary"
                          className={`${getTeamColor(event.team)} text-xs px-1 py-0 h-4 justify-start truncate w-full`}
                        >
                          {event.team}
                        </Badge>
                      ))}
                      {eventsForDay.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{eventsForDay.length - 2}</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <RequestFormModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        defaultDate={selectedDate || undefined}
        onAddRequest={onAddRequest}
      />
    </>
  )
}
