'use client';

import * as React from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { CalendarView } from "@/components/calendar/calendar-view";
import { EventForm } from "@/components/calendar/event-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  isPrivate: boolean;
  isPartnerEvent?: boolean;
}

export default function CalendarPage() {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );
  const [events, setEvents] = React.useState<Event[]>([]);

  const fetchEvents = React.useCallback(async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      if (data.events) {
        setEvents(data.events.map((event: any) => ({
          ...event,
          date: new Date(event.date),
          isPartnerEvent: event.userId !== session?.user?.email,
        })));
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, [session?.user?.email]);

  React.useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);
  const [isEventDialogOpen, setIsEventDialogOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setIsEventDialogOpen(true);
  };

  const handleEventSubmit = async (data: any) => {
    try {
      if (selectedEvent) {
        // Update existing event
        const response = await fetch(`/api/events/${selectedEvent.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            date: selectedDate || new Date(),
          }),
        });

        if (response.ok) {
          await fetchEvents();
        }
      } else {
        // Create new event
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            date: selectedDate || new Date(),
          }),
        });

        if (response.ok) {
          await fetchEvents();
        }
      }
      setIsEventDialogOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error submitting event:', error);
    }
  };

  const handleEventDelete = async () => {
    if (selectedEvent) {
      try {
        const response = await fetch(`/api/events/${selectedEvent.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchEvents();
          setIsEventDialogOpen(false);
          setSelectedEvent(null);
        }
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <Button onClick={() => setIsEventDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-6">
        <CalendarView
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          events={events}
        />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Events</h2>
          <div className="space-y-2">
            {events
              .filter(
                (event) =>
                  format(event.date, "yyyy-MM-dd") ===
                  format(selectedDate || new Date(), "yyyy-MM-dd")
              )
              .map((event) => (
                <div
                  key={event.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-accent"
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsEventDialogOpen(true);
                  }}
                >
                  <div className="font-medium">{event.title}</div>
                  {event.startTime && (
                    <div className="text-sm text-muted-foreground">
                      {event.startTime} - {event.endTime}
                    </div>
                  )}
                  {event.isPartnerEvent && (
                    <div className="text-sm text-partner-event">Partner's Event</div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? "Edit Event" : "Create New Event"}
            </DialogTitle>
          </DialogHeader>
          <EventForm
            defaultValues={selectedEvent || undefined}
            onSubmit={handleEventSubmit}
            onDelete={selectedEvent ? handleEventDelete : undefined}
            isEditing={!!selectedEvent}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}