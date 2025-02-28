import { Outlet } from "react-router";
import Navbar from "../components/Navbar/Navbar";

const MainLayout = () => {
  return (
    <div className="bg-white w-full mx-auto">
      <Navbar></Navbar>
      <div className=" min-h-[calc(100vh-68px)] bg-gradient-to-r from-blue-500 to-purple-600 ">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
