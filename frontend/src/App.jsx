import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import TasksPage from "./pages/TasksPage/TasksPage";
import Login from "./pages/Login/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout></MainLayout>}>
        <Route index element={<Home></Home>}></Route>
        <Route path="/tasks" element={
          <ProtectedRoute>
            <TasksPage />
          </ProtectedRoute>
        } />
      </Route>
      <Route path="/login" element={<Login/>} />
      
    </Routes>
  );
}

export default App;
