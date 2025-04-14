'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { StickyNote } from './StickyNote';
import { supabase } from '@/lib/supabase';

interface PlannerItem {
  id: string;
  content: string;
  color: string;
  is_completed: boolean;
}

export function PlannerBoard() {
  const [items, setItems] = useState<PlannerItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newColor, setNewColor] = useState('#fef08a');

  useEffect(() => {
    fetchItems();
    const subscription = supabase
      .channel('planner_items_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'planner_items',
        },
        () => {
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('planner_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching items:', error);
      return;
    }

    setItems(data || []);
  };

  const handleAdd = async () => {
    if (!newContent.trim()) return;

    const { error } = await supabase.from('planner_items').insert([
      {
        content: newContent,
        color: newColor,
        is_completed: false,
      },
    ]);

    if (error) {
      console.error('Error adding item:', error);
      return;
    }

    setNewContent('');
    setNewColor('#fef08a');
    setIsAdding(false);
  };

  const handleUpdate = async (id: string, content: string, color: string, isCompleted: boolean) => {
    const { error } = await supabase
      .from('planner_items')
      .update({ content, color, is_completed: isCompleted })
      .eq('id', id);

    if (error) {
      console.error('Error updating item:', error);
      return;
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('planner_items').delete().eq('id', id);

    if (error) {
      console.error('Error deleting item:', error);
      return;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Shared Planner</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
        >
          <Plus className="w-4 h-4" />
          Add Note
        </button>
      </div>

      {isAdding && (
        <div className="p-4 bg-white rounded-lg shadow-md">
          <textarea
            className="w-full p-2 rounded border"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Enter your note..."
            rows={3}
          />
          <div className="flex gap-2 mt-2">
            <select
              className="p-1 rounded border"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
            >
              <option value="#fef08a">Yellow</option>
              <option value="#bae6fd">Blue</option>
              <option value="#bbf7d0">Green</option>
              <option value="#fecaca">Red</option>
              <option value="#e9d5ff">Purple</option>
            </select>
            <button
              className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-500"
              onClick={handleAdd}
            >
              Add
            </button>
            <button
              className="px-4 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <StickyNote
            key={item.id}
            id={item.id}
            content={item.content}
            color={item.color}
            isCompleted={item.is_completed}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
} 