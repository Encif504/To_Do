import { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

// Alternative app component version for task management.
export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchTodos();
  }, []);

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
      setError('Failed to load todos. Make sure the server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

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
            {/* Display any API errors in a warning box. */}
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700 text-sm">
                ⚠️ {error}
              </div>
            )}

            <TodoForm onAddTodo={handleAddTodo} />

            {/* Show loading, empty state, or the todo list. */}
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
