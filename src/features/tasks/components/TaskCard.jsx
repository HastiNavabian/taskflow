import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import { useDraggable } from "@dnd-kit/core";
function TaskCard({ id, title, status, onStatusChange, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      className="task-card"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {title}
      <select
        value={status}
        onChange={(e) => onStatusChange(id, e.target.value)}
      >
        <option value="not-started">Not Started</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <Button onClick={() => setIsModalOpen(true)}>Details</Button>
      <Button variant="danger" onClick={() => onDelete(id)}>
        Delete
      </Button>
      {isModalOpen && (
        <Modal>
          <h3>{title}</h3>
          <p> Status : {status}</p>
          <Button onClick={() => setIsModalOpen(false)}>Close</Button>
        </Modal>
      )}
    </div>
  );
}

export default TaskCard;
