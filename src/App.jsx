import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Column from "./features/tasks/components/Column";

function App() {
  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3001/tasks");
      if (!response.ok)
        throw new Error(`Server responded with ${response.status}`);
      return response.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, newStatus }) => {
      const response = await fetch(`http://localhost:3001/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok)
        throw new Error(`Server responded with ${response.status}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const addTaskMutation = useMutation({
    mutationFn: async ({ title, status }) => {
      const response = await fetch("http://localhost:3001/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, status }),
      });
      if (!response.ok)
        throw new Error(`Server responded with ${response.status}`);
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`http://localhost:3001/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok)
        throw new Error(`Server responded with ${response.status}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  function updateTaskStatus(id, newStatus) {
    updateStatusMutation.mutate({ id, newStatus });
  }
  function addTask(title, status) {
    addTaskMutation.mutate({ title, status });
  }
  function deleteTask(id) {
    deleteTaskMutation.mutate(id);
  }

  const notStartedTasks = tasks.filter((task) => task.status === "not-started");
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  if (isLoading) {
    return <p className="status-message">Loading...</p>;
  }
  if (error) {
    return (
      <p className="status-message status-error">Error: {error.message}</p>
    );
  }

  return (
    <div className="board">
      <Column
        title="Not Started"
        status="not-started"
        tasks={notStartedTasks}
        onStatusChange={updateTaskStatus}
        onAddTask={addTask}
        onDelete={deleteTask}
      />
      <Column
        title="In Progress"
        status="in-progress"
        tasks={inProgressTasks}
        onStatusChange={updateTaskStatus}
        onAddTask={addTask}
        onDelete={deleteTask}
      />
      <Column
        title="Completed"
        status="completed"
        tasks={completedTasks}
        onStatusChange={updateTaskStatus}
        onAddTask={addTask}
        onDelete={deleteTask}
      />
    </div>
  );
}

export default App;
