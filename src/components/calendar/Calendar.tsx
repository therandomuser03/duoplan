'use client';

import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { enUS } from 'date-fns/locale/en-US';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    'en-US': enUS,
  },
});

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
}

export function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start: new Date(),
    end: new Date(),
  });

  useEffect(() => {
    fetchEvents();
    const subscription = supabase
      .channel('calendar_events_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calendar_events',
        },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      return;
    }

    const formattedEvents = data?.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      start: new Date(event.start_time),
      end: new Date(event.end_time),
    })) || [];

    setEvents(formattedEvents);
  };

  const handleAddEvent = async () => {
    if (!newEvent.title.trim()) return;

    const { error } = await supabase.from('calendar_events').insert([
      {
        title: newEvent.title,
        description: newEvent.description,
        start_time: newEvent.start.toISOString(),
        end_time: newEvent.end.toISOString(),
      },
    ]);

    if (error) {
      console.error('Error adding event:', error);
      return;
    }

    setNewEvent({
      title: '',
      description: '',
      start: new Date(),
      end: new Date(),
    });
    setIsAdding(false);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setNewEvent({
      ...newEvent,
      start: slotInfo.start,
      end: slotInfo.end,
    });
    setIsAdding(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Calendar</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {isAdding && (
        <div className="p-4 bg-white rounded-lg shadow-md">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full p-2 rounded border"
            />
            <textarea
              placeholder="Event Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="w-full p-2 rounded border"
              rows={3}
            />
            <div className="flex gap-2">
              <input
                type="datetime-local"
                value={format(newEvent.start, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
                className="p-2 rounded border"
              />
              <input
                type="datetime-local"
                value={format(newEvent.end, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
                className="p-2 rounded border"
              />
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
                onClick={handleAddEvent}
              >
                Add Event
              </button>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-[600px] bg-white p-4 rounded-lg shadow">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          defaultView="month"
          views={['month', 'week', 'day']}
        />
      </div>
    </div>
  );
} 