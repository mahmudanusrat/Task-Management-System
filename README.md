# Task Management System

This is a React-based task management system that allows users to create, update, and delete tasks. Tasks can be categorized into three sections: **To-Do**, **In Progress**, and **Done**. The system also supports drag-and-drop functionality to move tasks between categories.

## Live Demo  
🔗 **Live Project:** [TaskFlow](https://task-management-42632.web.app/) 

## Features

- **Task Creation**: Add new tasks with a title and description.
- **Task Categorization**: Tasks are categorized into **To-Do**, **In Progress**, and **Done**.
- **Drag-and-Drop**: Easily move tasks between categories using drag-and-drop.
- **Task Deletion**: Delete tasks that are no longer needed.
- **Real-Time Updates**: The task list is automatically refreshed after any changes.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **React Query**: For data fetching and state management.
- **Axios**: For making HTTP requests to the backend.
- **@hello-pangea/dnd**: A library for implementing drag-and-drop functionality.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/task-management-system.git
   cd task-management-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up the backend**:
   - Ensure you have a backend server running that provides the `/tasks` endpoint for CRUD operations.
   - Update the `axiosSecure` configuration in the `useAxiosSecure` hook to point to your backend API.

4. **Run the application**:
   ```bash
   npm start
   ```

## Usage

### Adding a Task
1. Navigate to the **To-Do** section.
2. Enter the task title and description in the input fields.
3. Click the **Add Task** button to create the task.

### Moving a Task
1. Click and hold a task card.
2. Drag it to the desired category (e.g., **In Progress** or **Done**).
3. Release the mouse button to drop the task into the new category.

### Deleting a Task
1. Click the **Delete** button on the task card you want to remove.
2. The task will be deleted, and the list will automatically refresh.

## Code Structure


## Dependencies

- `react`: ^18.0.0
- `react-query`: ^4.0.0
- `axios`: ^1.0.0
- `@hello-pangea/dnd`: ^16.0.0
