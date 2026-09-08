const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/tasks";

export async function getTasks() {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }
  return response.json();
}

export async function moveTask(id, status, completed) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status, completed }),
  });
  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }
}
export async function toggleTaskCompleted(id, completed) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  if (!response.ok) throw new Error(`Server responded with ${response.status}`);
}
export async function createTask(title, status, completed = false) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, status, completed }),
  });
  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }
  return response.json();
}

export async function deleteTask(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }
}
