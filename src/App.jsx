import Column from "./features/tasks/components/Column";
import SearchInput from "./features/tasks/components/SearchInput";
import useSearchStore from "./store/searchStore";
import useTasks from "./features/tasks/hooks/useTasks";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

function App() {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

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

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    const taskId = active.id;
    const newStatus = over.id;
    updateTaskStatus(taskId, newStatus);
  }

  return (
    <>
      <div>
        <SearchInput />
      </div>

      <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
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
      </DndContext>
    </>
  );
}
export default App;
