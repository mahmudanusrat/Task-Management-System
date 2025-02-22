import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const axiosSecure = useAxiosSecure();

  // Fetch tasks function
  const fetchTasks = async () => {
    try {
      const response = await axiosSecure.get(`/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle drag-and-drop
  const onDragEnd = async (result) => {
    const { source, destination } = result;

    // If dropped outside a droppable area, do nothing
    if (!destination) return;

    console.log("Source:", source);
    console.log("Destination:", destination);

    // Create a copy of the tasks array
    const updatedTasks = [...tasks];

    // Remove the task from the source index
    const [movedTask] = updatedTasks.splice(source.index, 1);

    // Update the task's category to the destination droppableId
    movedTask.category = destination.droppableId;

    // Insert the task at the destination index
    updatedTasks.splice(destination.index, 0, movedTask);

    // Update the state with the new tasks array
    setTasks(updatedTasks);

    try {
      // Send a PUT request to update the task's category in the backend
      await axiosSecure.put(`/tasks/${movedTask._id}`, {
        title: movedTask.title,
        description: movedTask.description,
        category: movedTask.category,
      });
      console.log("Task category updated successfully!");
    } catch (error) {
      console.error("Error updating task category:", error);
    }
  };

  // Add task and refresh list
  const addTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      await axiosSecure.post(`/tasks`, {
        title: newTask.title,
        description: newTask.description,
        category: "To-Do", // Default category for new tasks
      });

      // Clear input fields
      setNewTask({ title: "", description: "" });

      // Fetch updated tasks list
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      await axiosSecure.delete(`/tasks/${taskId}`);
      fetchTasks(); // Refresh task list after deletion
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 p-4">
        {["To-Do", "In Progress", "Done"].map((category) => (
          <Droppable droppableId={category} key={category}>
            {(provided) => (
              <div
                className="w-1/3 bg-base-200 p-4 rounded-lg shadow-lg"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2 className="text-2xl font-semibold text-center text-gray-700">
                  {category}
                </h2>

                {/* Task List */}
                <div>
                  {tasks
                    .filter((task) => task.category === category)
                    .map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided) => (
                          <div
                            className="task bg-white p-4 mb-3 rounded-md shadow-md hover:bg-base-100 transition"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <h3 className="font-semibold text-lg text-black">{task.title}</h3>
                            <p className="text-sm text-gray-600">{task.description}</p>
                            <button
                              onClick={() => deleteTask(task._id)}
                              className="btn btn-sm btn-danger mt-2"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>

                {/* Add Task Form - Only in "To-Do" Section */}
                {category === "To-Do" && (
                  <div className="mt-4 p-2 bg-gray-100 rounded-md">
                    <input
                      type="text"
                      placeholder="Task Title"
                      className="input input-bordered w-full mb-2"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Task Description"
                      className="input input-bordered w-full mb-2"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                    <button onClick={addTask} className="btn btn-primary w-full">
                      Add Task
                    </button>
                  </div>
                )}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskPage;