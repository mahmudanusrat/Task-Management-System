import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "./useAuth";

const useTasks = () => {
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
  const viteApi = import.meta.env.VITE_API_URL;
  const { user } = useAuth();

  const { refetch, data, isError, error, isLoading } = useQuery({
    queryKey: user?.email ? ["tasks", user.email] : ["tasks", "guest"],  // Avoid undefined keys
    queryFn: async () => {
      if (!user?.email) return { todo: [], inProgress: [], done: [] }; // Always return data
      const { data } = await axios.get(`${viteApi}/tasks/${user.email}`);
      return {
        todo: data.todo.sort((a, b) => a.order - b.order),
        inProgress: data.inProgress.sort((a, b) => a.order - b.order),
        done: data.done.sort((a, b) => a.order - b.order),
      };
    },
    enabled: !!user?.email, // Ensure the query only runs if a user exists
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  if (isError) {
    console.error("Error fetching tasks:", error);
  }

  return { tasks, setTasks, refetch, isLoading };
};

export default useTasks;
