export default function Todo() {
    return (
        <div className="todo">
      <p>{todo.todo}</p>
      <div>
        <button className="todo__status">
          {todo.status ? "☑" : "☐"}
        </button>
      </div>
    </div>
    )
  }