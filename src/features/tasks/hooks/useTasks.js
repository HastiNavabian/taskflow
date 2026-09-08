import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTasks,
  createTask,
  deleteTask as deleteTaskApi,
  moveTask as moveTaskApi,
  toggleTaskCompleted as toggleTaskCompletedApi,
} from "../../../services/taskApi";
async function snapshotAndCancel(queryClient) {
  await queryClient.cancelQueries({ queryKey: ["tasks"] });
  return queryClient.getQueryData(["tasks"]);
}

function rollback(queryClient, context) {
  queryClient.setQueryData(["tasks"], context.previousTasks);
}

function syncWithServer(queryClient) {
  queryClient.invalidateQueries({ queryKey: ["tasks"] });
}
function useTasks() {
  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const addTaskMutation = useMutation({
    mutationFn: ({ title, status, completed }) =>
      createTask(title, status, completed),
    onMutate: async ({ title, status, completed }) => {
      const previousTasks = await snapshotAndCancel(queryClient);
      const tempTask = {
        id: `temp-${crypto.randomUUID()}`,
        title,
        status,
        completed,
      };
      queryClient.setQueryData(["tasks"], (old) => [...old, tempTask]);
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      rollback(queryClient, context);
    },
    onSettled: () => {
      syncWithServer(queryClient);
    },
  });

  const moveTaskMutation = useMutation({
    mutationFn: ({ id, status, completed }) =>
      moveTaskApi(id, status, completed),
    onMutate: async ({ id, status, completed }) => {
      const previousTasks = await snapshotAndCancel(queryClient);
      queryClient.setQueryData(["tasks"], (old) =>
        old.map((task) =>
          task.id === id ? { ...task, status: status, completed } : task,
        ),
      );
      return { previousTasks };
    },
    onError: (err, variables, context) => rollback(queryClient, context),
    onSettled: () => syncWithServer(queryClient),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id) => deleteTaskApi(id),
    onMutate: async (id) => {
      const previousTasks = await snapshotAndCancel(queryClient);
      queryClient.setQueryData(["tasks"], (old) =>
        old.filter((task) => task.id !== id),
      );
      return { previousTasks };
    },
    onError: (err, id, context) => {
      rollback(queryClient, context);
    },
    onSettled: () => {
      syncWithServer(queryClient);
    },
  });

  const toggleTaskCompletedMutation = useMutation({
    mutationFn: ({ id, completed }) => toggleTaskCompletedApi(id, completed),
    onMutate: async ({ id, completed }) => {
      const previousTasks = await snapshotAndCancel(queryClient);
      queryClient.setQueryData(["tasks"], (old) =>
        old.map((task) =>
          task.id === id ? { ...task, completed: completed } : task,
        ),
      );
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      rollback(queryClient, context);
    },
    onSettled: () => {
      syncWithServer(queryClient);
    },
  });

  function addTask(title, status, completed) {
    addTaskMutation.mutate({ title, status, completed });
  }
  function deleteTask(id) {
    deleteTaskMutation.mutate(id);
  }
  function toggleTaskCompleted(id, completed) {
    toggleTaskCompletedMutation.mutate({ id, completed });
  }
  function moveTask(id, status, completed) {
    moveTaskMutation.mutate({ id, status, completed });
  }
  return {
    tasks,
    isLoading,
    error,
    moveTask,
    addTask,
    deleteTask,
    toggleTaskCompleted,
  };
}

export default useTasks;
