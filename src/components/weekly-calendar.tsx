"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Sample events data - you'll replace this with your actual data source
const SAMPLE_EVENTS = [
  { id: 1, date: new Date(2025, 4, 14), time: "2 PM", title: "Meeting", color: "bg-blue-100 text-blue-600 dark:bg-blue-800/40 dark:text-blue-200" },
  { id: 2, date: new Date(2025, 4, 14), time: "4 PM", title: "Coffee", color: "bg-green-100 text-green-600 dark:bg-green-800/40 dark:text-green-200" },
  { id: 3, date: new Date(2025, 4, 14), time: "7 PM", title: "Dinner", color: "bg-purple-100 text-purple-600 dark:bg-purple-800/40 dark:text-purple-200" },
]

export function WeeklyCalendar() {
  // State for the current week's start date
  const [weekStart, setWeekStart] = React.useState(() => {
    const today = new Date()
    const day = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate the date of the Sunday of this week
    const diff = today.getDate() - day
    return new Date(today.setDate(diff))
  })
  
  // Function to go to previous week
  const prevWeek = () => {
    const newStart = new Date(weekStart)
    newStart.setDate(newStart.getDate() - 7)
    setWeekStart(newStart)
  }
  
  // Function to go to next week
  const nextWeek = () => {
    const newStart = new Date(weekStart)
    newStart.setDate(newStart.getDate() + 7)
    setWeekStart(newStart)
  }
  
  // Get the end date of the week (Saturday)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  
  // Format date range for display (May 14 - May 20, 2025)
  const formatDateRange = () => {
    
    // For the start date, we need just the month and day
    const startMonth = weekStart.toLocaleString('default', { month: 'long' })
    const startDay = weekStart.getDate()
    
    // For the end date, we need month, day, and year
    const endMonth = weekEnd.toLocaleString('default', { month: 'long' })
    const endDay = weekEnd.getDate()
    const endYear = weekEnd.getFullYear()
    
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${endYear}`
  }
  
  // Generate array of dates for the week
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    return date
  })
  
  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return SAMPLE_EVENTS.filter(event => 
      event.date.getDate() === date.getDate() && 
      event.date.getMonth() === date.getMonth() && 
      event.date.getFullYear() === date.getFullYear()
    )
  }
  
  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  }
  
  return (
    <Card className="w-full border-none shadow-none bg-transparent">
      <CardHeader className="pb-2 text-2xl font-semibold">
        <CardTitle>Weekly Calendar</CardTitle>
      </CardHeader>
      
      <div className="flex items-center justify-between px-4 py-2">
        <Button variant="ghost" size="icon" onClick={prevWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">
          {formatDateRange()}
        </div>
        <Button variant="ghost" size="icon" onClick={nextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <CardContent className="p-0">
        <div className="grid grid-cols-7 text-center border-b border-gray-200 dark:border-gray-700">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
            <div key={day} className="py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 text-center">
          {weekDates.map((date, i) => {
            const today = isToday(date)
            const events = getEventsForDate(date)
            
            return (
              <div 
                key={i} 
                className={cn(
                  "border border-gray-200 dark:border-gray-700 p-1 h-32 overflow-auto",
                  today 
                    ? "bg-blue-50 dark:bg-blue-900/20" 
                    : "bg-white dark:bg-gray-800/50"
                )}
              >
                <div className={cn(
                  "text-sm font-medium mb-1 sticky top-0 z-10 p-1 rounded-full w-9 h-9 flex items-center justify-center mx-auto",
                  today 
                    ? "border border-blue-500 bg-neutral-900 text-blue-500" 
                    : "text-gray-700 dark:text-gray-300"
                )}>
                  {date.getDate()}
                </div>
                
                {events.map((event) => (
                  <div 
                    key={event.id} 
                    className={cn(
                      "text-xs mb-1 p-1 rounded",
                      event.color || "bg-blue-100 text-blue-600 dark:bg-blue-800/40 dark:text-blue-200"
                    )}
                  >
                    <div className="font-semibold">{event.time} - {event.title}</div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}