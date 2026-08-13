import { useState } from "react";
import Modal from "./Modal";
function TaskCard({ id, title, status, onStatusChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      <button onClick={() => setIsModalOpen(true)}>Details</button>
      {isModalOpen && (
        <Modal>
          <h3>{title}</h3>
          <p> Status : {status}</p>
          <button onClick={() => setIsModalOpen(false)}>Close</button>
        </Modal>
      )}
    </div>
  );
}

export default TaskCard;
