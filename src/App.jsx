import Column from "./features/tasks/components/Column";
import SearchInputs from "./features/tasks/components/SearchInputs";
import useSearchStore from "./store/searchStore";
import useTasks from "./features/tasks/hooks/useTasks";

function App() {
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const { tasks, isLoading, error, updateTaskStatus, addTask, deleteTask } =
    useTasks();
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const notStartedTasks = filteredTasks.filter(
    (task) => task.status === "not-started",
  );
  const inProgressTasks = filteredTasks.filter(
    (task) => task.status === "in-progress",
  );
  const completedTasks = filteredTasks.filter(
    (task) => task.status === "completed",
  );

  if (isLoading) {
    return <p className="status-message">Loading...</p>;
  }
  if (error) {
    return (
      <p className="status-message status-error">Error: {error.message}</p>
    );
  }

  return (
    <>
      <div>
        <SearchInputs />
      </div>

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
    </>
  );
}

export default App;
