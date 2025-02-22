import { Outlet } from 'react-router';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const MainLayout = () => {
    return (
        <div className="bg-white w-full mx-auto">
       <Navbar></Navbar>
       <div className=" min-h-[calc(100vh-68px)] dark:bg-[#303030] dark:text-white">
          <Outlet />
        </div>
        <Footer></Footer>
    </div>
    );
};

export default MainLayout;