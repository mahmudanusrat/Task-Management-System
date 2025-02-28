import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import React, { useEffect, useState } from "react";
import { Dialog, DialogHeader } from "@material-tailwind/react";
import axios from "axios";
import { CiMenuKebab } from "react-icons/ci";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { MdDeleteOutline } from "react-icons/md";
import { GrFormEdit } from "react-icons/gr";
import toast from "react-hot-toast";
import useTasks from "../../hooks/useTasks";

const Tasks = () => {
  const { tasks, setTasks, refetch, isLoading } = useTasks();
  const apiUrl = import.meta.env.VITE_API_URL;
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  const handleDeleteTaks = async (id) => {
    axios.delete(`${apiUrl}/tasks/${id}`).then(() => {
      toast.success("Task Deleted");
      refetch();
    });
  };
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(!open);
    if (open) {
      setUpdateTaskD({});
      setUpdateTaskId("");
    }
  };
  const [updateTaskId, setUpdateTaskId] = useState("");
  const [updateTaskD, setUpdateTaskD] = useState({});

  useEffect(() => {
    if (updateTaskId && open) {
      axios.get(`${apiUrl}/task/${updateTaskId}`).then((res) => {
        setUpdateTaskD(res.data);
      });
    }
  }, [updateTaskId, apiUrl, open]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;

    axios
      .put(`${apiUrl}/tasks/update/${updateTaskD?._id}`, { title, description })
      .then(() => {
        refetch();
      });
    handleOpen();
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = source.droppableId;
    const destinationColumn = destination.droppableId;

    if (sourceColumn === destinationColumn) {
      const items = reorder(
        [...tasks[sourceColumn]],
        source.index,
        destination.index
      );
      items.forEach((item, index) => (item.order = index));

      const updatedTasks = {
        ...tasks,
        [sourceColumn]: items.sort((a, b) => a.order - b.order),
      };

      setTasks(updatedTasks);

      await axios.put(`${apiUrl}/tasks/reorder`, {
        tasks: items.map(({ _id, order }) => ({ _id, order })),
      });
    } else {
      const sourceItems = [...tasks[sourceColumn]];
      const destinationItems = [...tasks[destinationColumn]];

      const [movedItem] = sourceItems.splice(source.index, 1);
      destinationItems.splice(destination.index, 0, movedItem);

      sourceItems.forEach((item, index) => (item.order = index));
      destinationItems.forEach((item, index) => (item.order = index));

      const updatedTasks = {
        ...tasks,
        [sourceColumn]: sourceItems.sort((a, b) => a.order - b.order),
        [destinationColumn]: destinationItems.sort((a, b) => a.order - b.order),
      };

      setTasks(updatedTasks);

      await axios.put(`${apiUrl}/tasks/drag/${movedItem._id}`, {
        category: destinationColumn,
        order: destination.index,
      });
    }
  };
  if (isLoading) {
    return (
      <div className=" w-full  h-full flex justify-center items-center">
        <h1 className=" text-xl flex items-center gap-2">
          <span className=" spinning" />
        </h1>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 md:gap-3 xl:gap-4 gap-2 h-full pt-10">
        {Object.entries(tasks).map(([column, items]) => (
          <Droppable key={column} droppableId={column}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-600 rounded p-2 xl:p-4 overflow-x-hidden border-2 min-h-full space-y-2 overflow-y-auto"
              >
                <h2 className="text-lg font-bold mb-4 capitalize flex theme-border-b pb-3 items-center gap-1">
                  {column === "todo"
                    ? "To Do"
                    : column === "inProgress"
                    ? "In Progress"
                    : "Done"}
                </h2>
                {items?.map((item, index) => (
                  <Draggable
                    key={item._id}
                    draggableId={item._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="cursor-default"
                      >
                        <div className="cursor-default py-3 bg-gray-700 px-2 rounded-t w-full justify-between flex items-center">
                          <div className="flex-1">
                            <p className="text-white px-3">{item.title}</p>
                          </div>
                          <Menu>
                            <MenuHandler>
                              <div>
                                <p className="text-white px-3 cursor-pointer">
                                  <CiMenuKebab />
                                </p>
                              </div>
                            </MenuHandler>
                            <MenuList className="bg-gray-700 px-0 w-fit">
                              <MenuItem
                                onClick={() => {
                                  handleOpen();
                                  setUpdateTaskId(item._id);
                                }}
                                className="hover:bg-black/20 rounded-none flex gap-1 items-center cursor-pointer"
                              >
                                <GrFormEdit /> Edit
                              </MenuItem>
                              <MenuItem
                                onClick={() => handleDeleteTaks(item._id)}
                                className="hover:bg-black/20 rounded-none flex gap-1 items-center cursor-pointer"
                              >
                                <MdDeleteOutline /> Delete
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </div>

                        <div className="p-3 theme-border rounded shadow-sm cursor-grab theme-bg shadow-background-dark/30 theme-card-bg relative">
                          <p className="text-xs lg:text-sm">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
        <div>
          <Dialog
            size="xs"
            open={open}
            handler={handleOpen}
            className=" p-4 text-black"
          >
            <DialogHeader className=" text-center mx-auto w-fit text-black">
              Update task
            </DialogHeader>
            <form
              onSubmit={handleUpdate}
              action=""
              className={` space-y-4 duration-200 `}
            >
              <input
                defaultValue={updateTaskD?.title}
                name="title"
                className=" w-full py-2 px-3 border color-text  rounded"
                placeholder=" Enter task title"
                type="text"
              />
              <textarea
                defaultValue={updateTaskD?.description}
                placeholder="Descroption"
                name="description"
                className=" w-full resize-none py-2 px-3 border color-text rounded "
                id=""
              ></textarea>
              <div className=" flex items-center justify-between">
                <button className="  btn  ">Update Task</button>
                <button className="btn">Cancel</button>
              </div>
            </form>
          </Dialog>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Tasks;
