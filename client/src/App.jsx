import { useEffect, useState } from "react";

// Todo component for rendering individual todos and updating status
function Todo({ todo, setTodos }) {
  const updateTodo = async (todoId, todoStatus) => {
    const res = await fetch(`/api/todos/${todoId}`, {
      method: "PUT",
      body: JSON.stringify({ status: !todoStatus }), // Toggle the status
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();

    if (json.acknowledged) {
      setTodos((currentTodos) =>
        currentTodos.map((currentTodo) => {
          if (currentTodo._id === todoId) {
            return { ...currentTodo, status: !currentTodo.status };
          }
          return currentTodo;
        })
      );
    }
  };

  const deleteTodo = async (todoId) => {
    const res = await fetch(`/api/todos/${todoId}`, {
      method: "DELETE",
    });
    const json = await res.json();

    if (json.acknowledged) {
      setTodos((currentTodos) =>
        currentTodos.filter((currentTodo) => currentTodo._id !== todoId)
      );
    }
  };

  return (
    <div className="todo">
      <p>{todo.todo}</p>
      <div>
        <button
          className="todo__status"
          onClick={() => updateTodo(todo._id, todo.status)}
        >
          {todo.status ? "☑" : "☐"}
        </button>
        <button
          className="todo__delete"
          onClick={() => deleteTodo(todo._id)}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");

  // Function to get todos from the server
  const getTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  };

  // Function to create a new todo
  const createNewTodo = async (e) => {
    e.preventDefault();
    if (content.length > 3) {
      const res = await fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify({ todo: content }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newTodo = await res.json();

      setContent("");
      setTodos([...todos, newTodo]); // Add the new todo to the current state
    }
  };

  // Fetch todos when the component mounts
  useEffect(() => {
    getTodos();
  }, []);

  return (
    <main className="container">
      <h1 className="title">Extraordinary Todo</h1>
      <form className="form" onSubmit={createNewTodo}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter a new todo..."
          className="form__input"
          required
        />
        <button type="submit">Create Todo</button>
      </form>

      <div className="todos">
        {todos.length > 0 &&
          todos.map((todo) => (
            <Todo todo={todo} setTodos={setTodos} key={todo._id} />
          ))}
      </div>
    </main>
  );
}
