import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">TaskFlow</h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 items-center">
        <NavLink to="/" className="hover:text-gray-400">Home</NavLink>
        <NavLink to="/tasks" className="hover:text-gray-400">Tasks</NavLink>

        {user ? (
          <div className="flex items-center space-x-4">
            <button onClick={logOut} className="hover:text-gray-400">Logout</button>
            <img
              src={user?.photoURL}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border"
            />
          </div>
        ) : (
          <NavLink to="/login" className="hover:text-gray-400">Login</NavLink>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-800 text-white p-4 flex flex-col space-y-2 md:hidden">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/tasks" onClick={() => setIsMobileMenuOpen(false)}>Tasks</Link>
          {user ? (
            <>
              <button onClick={logOut} className="text-left">Logout</button>
              <img
                src={user?.photoURL}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border mt-2"
              />
            </>
          ) : (
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
