import { useState, useEffect } from "react";
import Column from "./features/tasks/components/Column";
function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch("http://localhost:3001/tasks");
        const data = await response.json();
        setTasks(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    }

    fetchTasks();
  }, []);

  const notStartedTasks = tasks.filter((task) => task.status === "not-started");
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  async function updateTaskStatus(id, newStatus) {
    const previousTasks = tasks;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task,
      ),
    );
    try {
      const response = await fetch(`http://localhost:3001/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
    } catch (err) {
      console.error("Failed to update task status:", err);
      setTasks(previousTasks);
    }
  }

  if (isLoading) {
    return <p className="status-message">Loading...</p>;
  }
  if (error) {
    return <p className="status-message status-error">Error :{error}</p>;
  }

  async function addTask(title, status) {
    try {
      const response = await fetch("http://localhost:3001/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, status }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      const newTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  }

  async function deleteTask(id) {
    const previousTasks = tasks;
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    try {
      const response = await fetch(`http://localhost:3001/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
    } catch (err) {
      console.error("Failed to delete task:", err);
      setTasks(previousTasks);
    }
  }
  return (
    <div className="board">
      <Column
        title="Not Started"
        tasks={notStartedTasks}
        onStatusChange={updateTaskStatus}
        onAddTask={addTask}
        status="not-started"
        onDelete={deleteTask}
      />
      <Column
        title="In Progress"
        tasks={inProgressTasks}
        onStatusChange={updateTaskStatus}
        onAddTask={addTask}
        status="in-progress"
        onDelete={deleteTask}
      />
      <Column
        title="Completed"
        tasks={completedTasks}
        onStatusChange={updateTaskStatus}
        onAddTask={addTask}
        status="completed"
        onDelete={deleteTask}
      />
    </div>
  );
}

export default App;
