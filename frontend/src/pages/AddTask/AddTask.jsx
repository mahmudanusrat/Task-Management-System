import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import axios from "axios";
import useTasks from "../../hooks/useTasks";

const AddTask = () => {
  const { user } = useAuth();
  const { refetch } = useTasks();
  const viteApi = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;
    const timestamp = new Date().toISOString();
    const userEmail = user.email;

    // Validation
    if (!title) {
      setLoading(false);
      return toast.error("Title is required");
    }
    if (title.length > 50) {
      setLoading(false);
      return toast.error("Title cannot be more than 50 characters");
    }
    if (description.length > 200) {
      setLoading(false);
      return toast.error("Description cannot be more than 200 characters");
    }
    if (!description) {
      setLoading(false);
      return toast.error("Description is required");
    }

    const task = {
      title,
      description,
      timestamp,
      userEmail,
      category: "todo",
    };

    try {
      // Make the request to add a new task
      await axios.post(`${viteApi}/tasks`, task);
      refetch(); // Refetch tasks after adding
      form.reset(); // Reset the form fields
      toast.success("Task created successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create task");
    } finally {
      setLoading(false); // Reset the loading state
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="p-4 bg-white text-black border rounded-lg shadow-lg w-full max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4 duration-200">
          <input
            name="title"
            className="w-full py-2 px-3 border color-text rounded"
            placeholder="Enter task title"
            type="text"
          />
          <textarea
            placeholder="Description"
            name="description"
            className="w-full resize-none py-2 px-3 border color-text rounded"
          ></textarea>

          <button
            type="submit"
            className="btn w-full py-2 bg-blue-500 text-white rounded"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
