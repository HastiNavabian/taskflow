import { useState } from 'react'
import Column from './features/tasks/components/Column'
import mockTasks from './features/tasks/mockTasks'
function App() {

  const [tasks, setTasks] = useState(mockTasks)
  const notStartedTasks = tasks.filter((task) => task.status === "not-started")
  const inProgressTasks = tasks.filter((task)=> task.status === "in-progress")
  const completedTasks = tasks.filter((task)=> task.status === "completed")

  function updateTaskStatus(id, newStatus) {
  setTasks((prevTasks) =>
    prevTasks.map((task) =>
      task.id === id
        ? { ...task, status: newStatus }
        : task
    )
  )
}
  return (
    <div className="board">
      <Column title="Not Started" tasks={notStartedTasks} onStatusChange={updateTaskStatus} />
      <Column title="In Progress" tasks={inProgressTasks} onStatusChange={updateTaskStatus}/>
      <Column title="Completed" tasks={completedTasks} onStatusChange={updateTaskStatus} />
    </div>
  )
}

export default App
