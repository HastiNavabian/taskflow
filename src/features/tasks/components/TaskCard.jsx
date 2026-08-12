function TaskCard({ id, title, status, onStatusChange }) {
  return (
    <div className="task-card">
      {title}
      <select
        value={status}
        onChange={(e) => onStatusChange(id, e.target.value)}
      >
        <option value="not-started">Not Started</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
}

export default TaskCard;
