import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTasks,
  updateTaskStatus as updateTaskStatusApi,
  createTask,
  deleteTask as deleteTaskApi,
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

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, newStatus }) => updateTaskStatusApi(id, newStatus),

    onMutate: async ({ id, newStatus }) => {
      const previousTasks = await snapshotAndCancel(queryClient);
      queryClient.setQueryData(["tasks"], (old) =>
        old.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task,
        ),
      );
      return { previousTasks };
    },
    onError: (err, variables, context) => rollback(queryClient, context),

    onSettled: () => syncWithServer(queryClient),
  });

  const addTaskMutation = useMutation({
    mutationFn: ({ title, status }) => createTask(title, status),
    onMutate: async ({ title, status }) => {
      const previousTasks = await snapshotAndCancel(queryClient);
      const tempTask = {
        id: `temp-${crypto.randomUUID()}`,
        title,
        status,
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
