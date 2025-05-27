// components/dashboard/WeeklyCalendar.tsx

"use client";

import React, { useMemo } from "react";
import { format, startOfWeek, addDays, isToday } from "date-fns";

export default function WeeklyCalendar() {
  const today = new Date();

  const weekStart = startOfWeek(today, { weekStartsOn: 0 }); // Sunday start

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      return {
        label: format(date, "EEE"), // "Mon", "Tue"
        dayNum: format(date, "d"), // "27"
        isToday: isToday(date),
        date,
      };
    });
  }, [weekStart]);

  const weekRange = `${format(weekDays[0].date, "MMM d")} – ${format(
    weekDays[6].date,
    "MMM d, yyyy"
  )}`;

  return (
    <div className="flex-[3] bg-background rounded-xl p-6 shadow-md">
      <h2 className="text-2xl font-semibold mb-2">Weekly Calendar</h2>
      <p className="text-sm text-muted-foreground mb-4">{weekRange}</p>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center border border-muted rounded-md py-6 cursor-pointer ${
              day.isToday ? "bg-primary/20 border-primary" : "bg-muted"
            }`}
          >
            <div className="text-xs text-muted-foreground">{day.label.toUpperCase()}</div>
            <div className="text-xl font-semibold">{day.dayNum}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
