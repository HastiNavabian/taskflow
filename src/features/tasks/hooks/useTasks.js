import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function useTasks() {
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

    onMutate: async ({ id, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData(["tasks"]);
      queryClient.setQueryData(["tasks"], (old) =>
        old.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task,
        ),
      );
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["tasks"], context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
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
    onMutate: async ({ title, status }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData(["tasks"]);
      const tempTask = {
        id: `temp-${crypto.randomUUID()}`,
        title,
        status,
      };
      queryClient.setQueryData(["tasks"], (old) => [...old, tempTask]);
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["tasks"], context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`http://localhost:3001/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok)
        throw new Error(`Server responded with ${response.status}`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData(["tasks"]);
      queryClient.setQueryData(["tasks"], (old) =>
        old.filter((task) => task.id !== id),
      );
      return { previousTasks };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["tasks"], context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
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

  return {
    tasks,
    isLoading,
    error,
    updateTaskStatus,
    addTask,
    deleteTask,
  };
}

export default useTasks;
