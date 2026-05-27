import { useState } from 'react';

// Single todo item component with edit, delete, and complete actions.
export default function TodoItem({ todo, onUpdateTodo, onDeleteTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || '');
  const [isLoading, setIsLoading] = useState(false);

  // Save the edited todo back to the server.
  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onUpdateTodo(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || null,
        dueDate: editDueDate || null,
        completed: todo.completed,
      });
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset edit form and close editing mode.
  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditDueDate(todo.dueDate || '');
    setIsEditing(false);
  };

  // Toggle the completed state for this todo item.
  const handleToggleComplete = async () => {
    setIsLoading(true);
    try {
      await onUpdateTodo(todo.id, {
        title: todo.title,
        description: todo.description,
        dueDate: todo.dueDate,
        completed: !todo.completed,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render the edit form if the item is currently being edited.
  if (isEditing) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Title"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows="2"
            className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Description"
          />
          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 rounded bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 rounded bg-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render the normal view mode for the todo item.
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.completed || false}
          onChange={handleToggleComplete}
          disabled={isLoading}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className={`mt-1 text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
              {todo.description}
            </p>
          )}
          {todo.dueDate && (
            <p className="mt-2 text-xs text-gray-500">
              📅 Due: {new Date(todo.dueDate).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="rounded bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200"
          >
            Edit
          </button>
          <button
            onClick={() => onDeleteTodo(todo.id)}
            className="rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
