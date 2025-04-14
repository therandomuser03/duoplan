import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface StickyNoteProps {
  id: string;
  content: string;
  color: string;
  isCompleted: boolean;
  onUpdate: (id: string, content: string, color: string, isCompleted: boolean) => void;
  onDelete: (id: string) => void;
}

export function StickyNote({ id, content, color, isCompleted, onUpdate, onDelete }: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [editedColor, setEditedColor] = useState(color);

  const handleSave = () => {
    onUpdate(id, editedContent, editedColor, isCompleted);
    setIsEditing(false);
  };

  const handleToggleComplete = () => {
    onUpdate(id, content, color, !isCompleted);
  };

  return (
    <div
      className={`relative p-4 rounded-lg shadow-md transition-all duration-200 ${
        isCompleted ? 'opacity-60' : ''
      }`}
      style={{ backgroundColor: color }}
    >
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            className="w-full p-2 rounded bg-white/80"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2">
            <select
              className="p-1 rounded bg-white/80"
              value={editedColor}
              onChange={(e) => setEditedColor(e.target.value)}
            >
              <option value="#fef08a">Yellow</option>
              <option value="#bae6fd">Blue</option>
              <option value="#bbf7d0">Green</option>
              <option value="#fecaca">Red</option>
              <option value="#e9d5ff">Purple</option>
            </select>
            <button
              className="px-2 py-1 text-sm bg-white/80 rounded hover:bg-white"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-800">{content}</p>
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              className="p-1 rounded-full hover:bg-white/20"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              className="p-1 rounded-full hover:bg-white/20"
              onClick={() => onDelete(id)}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute bottom-2 right-2">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={handleToggleComplete}
              className="w-4 h-4 rounded"
            />
          </div>
        </>
      )}
    </div>
  );
} 