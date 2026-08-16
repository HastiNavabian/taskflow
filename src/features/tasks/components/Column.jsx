import TaskCard from "./TaskCard";
import Button from "./Button";
import { useState } from "react";

function Column({ title, tasks, status, onStatusChange, onAddTask, onDelete }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (newTitle.trim() === "") return;
    onAddTask(newTitle, status);
    setNewTitle("");
    setIsAdding(false);
  }

  return (
    <div className="column">
      <h2>{title}</h2>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          status={task.status}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}

      {isAdding ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Task title"
            autoFocus
          />
          <div>
            <Button type="submit">Add</Button>
            <Button variant="secondary" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div>
          <Button variant="secondary" onClick={() => setIsAdding(true)}>
            Add Task
          </Button>
        </div>
      )}
    </div>
  );
}
export default Column;
