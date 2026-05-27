import { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

// Root application component for the task manager.
export default function App() {
  // Local state for todos, loading state, and error messages.
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Base URL for API calls.
  const API_URL = 'http://localhost:5000/api';

  // Fetch todos once when the component mounts.
  useEffect(() => {
    fetchTodos();
  }, []);

  // Load the todo list from the backend API.
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/todos`);
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError('Failed to load todos.');
    } finally {
      setLoading(false);
    }
  };

  // Add a new todo via the API and update local state.
  const handleAddTodo = async (newTodo) => {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo),
      });
      if (!response.ok) throw new Error('Failed to add todo');
      const todo = await response.json();
      setTodos([todo, ...todos]);
      setError(null);
    } catch (err) {
      console.error('Error adding todo:', err);
      setError('Failed to add todo');
    }
  };

  // Update an existing todo and refresh the matching item in state.
  const handleUpdateTodo = async (id, updatedTodo) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      });
      if (!response.ok) throw new Error('Failed to update todo');
      const updated = await response.json();
      setTodos(todos.map(todo => todo.id === id ? updated : todo));
      setError(null);
    } catch (err) {
      console.error('Error updating todo:', err);
      setError('Failed to update todo');
    }
  };

  // Delete a todo item and remove it from local state.
  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete todo');
      setTodos(todos.filter(todo => todo.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete todo');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-xl bg-white shadow-xl">
          <div className="border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">My Tasks</h1>
            <p className="mt-2 text-blue-100">Stay organized and productive</p>
          </div>

          <div className="p-6">
            {/* Render an error alert when an API call fails. */}
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Form to create a new todo item. */}
            <TodoForm onAddTodo={handleAddTodo} />

            {/* Render loading, empty state, or the todo list. */}
            {loading ? (
              <div className="py-8 text-center text-gray-500">
                Loading your tasks...
              </div>
            ) : todos.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No tasks yet. Create one to get started!
              </div>
            ) : (
              <TodoList
                todos={todos}
                onUpdateTodo={handleUpdateTodo}
                onDeleteTodo={handleDeleteTodo}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
