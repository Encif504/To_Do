import TodoItem from './TodoItem';

// List container that renders all todo items.
export default function TodoList({ todos, onUpdateTodo, onDeleteTodo }) {
  return (
    <div className="space-y-3 mt-6">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdateTodo={onUpdateTodo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </div>
  );
}
