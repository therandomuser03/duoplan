// components/dashboard/WeeklyCalendar.tsx

"use client";

import React, { useMemo, useState } from "react";
import { format, startOfWeek, addDays, isToday, isSameDay, addWeeks, subWeeks } from "date-fns";
import { cn } from "@/lib/utils";

interface WeeklyCalendarProps {
  selectedDate: string; // YYYY-MM-DD format
  onDateSelect: (date: string) => void;
  className?: string;
}

export default function WeeklyCalendar({ selectedDate, onDateSelect, className }: WeeklyCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  const selectedDateObj = useMemo(() => new Date(selectedDate), [selectedDate]);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 }); // Sunday start

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      return {
        label: format(date, "EEE"), // "Mon", "Tue"
        dayNum: format(date, "d"), // "27"
        isToday: isToday(date),
        isSelected: isSameDay(date, selectedDateObj),
        date,
        dateString: format(date, "yyyy-MM-dd"), // For the selectedDate format
      };
    });
  }, [weekStart, selectedDateObj]);

  const weekRange = `${format(weekDays[0].date, "MMM d")} – ${format(
    weekDays[6].date,
    "MMM d, yyyy"
  )}`;

  const handleDayClick = (dateString: string) => {
    onDateSelect(dateString);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => 
      direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1)
    );
  };

  return (
    <div className={cn("flex-[3] bg-background rounded-xl p-6 shadow-md", className)}>
      <h2 className="text-2xl font-semibold mb-2">Weekly Calendar</h2>
      
      {/* Week Range with Navigation */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{weekRange}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateWeek('prev')}
            className="w-6 h-6 rounded bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            title="Previous week"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => navigateWeek('next')}
            className="w-6 h-6 rounded bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            title="Next week"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center border rounded-md py-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
              day.isSelected
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : day.isToday
                ? "bg-primary/20 border-primary"
                : "bg-muted border-muted hover:bg-muted/80"
            }`}
            onClick={() => handleDayClick(day.dateString)}
          >
            <div className={`text-xs ${
              day.isSelected 
                ? "text-primary-foreground/80" 
                : "text-muted-foreground"
            }`}>
              {day.label.toUpperCase()}
            </div>
            <div className="text-xl font-semibold">{day.dayNum}</div>
          </div>
        ))}
      </div>
      
      {/* Optional: Show selected date info */}
      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Selected: <span className="font-medium">{format(selectedDateObj, "EEEE, MMMM d, yyyy")}</span>
        </p>
      </div>
    </div>
  );
}