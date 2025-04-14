import * as React from "react";
import { DayPicker, DayPickerSingleProps, DayPickerRangeProps, DayPickerMultipleProps, DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface BaseCalendarProps {
  className?: string;
  showOutsideDays?: boolean;
  events?: Array<{
    id: string;
    title: string;
    date: Date;
    isPartnerEvent?: boolean;
    isPrivate?: boolean;
  }>;
}

interface SingleCalendarProps extends BaseCalendarProps, Omit<DayPickerSingleProps, 'mode'> {
  mode: 'single';
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
}

interface RangeCalendarProps extends BaseCalendarProps, Omit<DayPickerRangeProps, 'mode' | 'selected' | 'onSelect'> {
  mode: 'range';
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
}

interface MultipleCalendarProps extends BaseCalendarProps, Omit<DayPickerMultipleProps, 'mode'> {
  mode: 'multiple';
  selected?: Date[];
  onSelect?: (dates: Date[] | undefined) => void;
}

type CalendarViewProps = SingleCalendarProps | RangeCalendarProps | MultipleCalendarProps;

export function CalendarView(props: CalendarViewProps) {
  const [realTimeEvents, setRealTimeEvents] = React.useState(props.events || []);

  React.useEffect(() => {
    const ws = new WebSocket('wss://api.heartsync.app/calendar');
    
    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'event_update') {
        setRealTimeEvents(prev => prev.map(e => e.id === data.event.id ? data.event : e));
      }
      if (data.type === 'event_create') {
        setRealTimeEvents(prev => [...prev, data.event]);
      }
    });

    return () => ws.close();
  }, []);
  if (props.mode === 'range') {
    return (
      <DayPicker
        {...props}
        mode="range"
        selected={props.selected as DateRange}
        onSelect={props.onSelect as (range: DateRange | undefined) => void}
        showOutsideDays={props.showOutsideDays}
        className={cn(
          "p-3 w-full",
          "rdp-day_today { font-bold }",
          props.className
        )}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: cn(
            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
            "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
          ),
          day: cn(
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:bg-accent focus:text-accent-foreground focus:outline-none"
          ),
          day_range_start: "day-range-start",
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "text-muted-foreground opacity-50",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
        }}
        components={{
          IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
          IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        }}
        modifiers={{
          event: props.events?.map((event) => event.date) || [],
          partnerEvent: props.events
            ?.filter((event) => event.isPartnerEvent)
            .map((event) => event.date) || [],
        }}
        modifiersStyles={{
          event: { border: '2px solid var(--primary)' },
          partnerEvent: { border: '2px solid var(--secondary)' },
        }}
      />
    );
  }

  if (props.mode === 'multiple') {
    return (
      <DayPicker
        {...props}
        mode="multiple"
        selected={props.selected as Date[]}
        onSelect={props.onSelect as (dates: Date[] | undefined) => void}
        showOutsideDays={props.showOutsideDays}
        className={cn(
          "p-3 w-full",
          "rdp-day_today { font-bold }",
          props.className
        )}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: cn(
            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
            "[&:has([aria-selected])]:rounded-md"
          ),
          day: cn(
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:bg-accent focus:text-accent-foreground focus:outline-none"
          ),
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "text-muted-foreground opacity-50",
          day_disabled: "text-muted-foreground opacity-50",
          day_hidden: "invisible",
        }}
        components={{
          IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
          IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        }}
        modifiers={{
          event: props.events?.map((event) => event.date) || [],
          partnerEvent: props.events
            ?.filter((event) => event.isPartnerEvent)
            .map((event) => event.date) || [],
        }}
        modifiersStyles={{
          event: { border: '2px solid var(--primary)' },
          partnerEvent: { border: '2px solid var(--secondary)' },
        }}
      />
    );
  }

  // Default to single mode
  return (
    <DayPicker
      {...props}
      mode="single"
      selected={props.selected as Date}
      onSelect={props.onSelect as (date: Date | undefined) => void}
      showOutsideDays={props.showOutsideDays}
      className={cn(
        "p-3 w-full",
        "rdp-day_today { font-bold }",
        props.className
      )}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
          "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
          "hover:bg-accent hover:text-accent-foreground",
          "focus:bg-accent focus:text-accent-foreground focus:outline-none"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_hidden: "invisible",
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      modifiers={{
        event: props.events?.map((event) => event.date) || [],
        partnerEvent: props.events
          ?.filter((event) => event.isPartnerEvent)
          .map((event) => event.date) || [],
      }}
      modifiersStyles={{
        event: { border: '2px solid var(--primary)' },
        partnerEvent: { border: '2px solid var(--secondary)' },
      }}
    />
  );
}