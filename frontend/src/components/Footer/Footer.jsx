import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-900 text-white text-center py-4 mt-auto">
        <p>&copy; 2025 TaskFlow. All Rights Reserved.</p>
        <div className="mt-2">
          <Link to="/privacy" className="mx-2 hover:text-gray-400">
            Privacy Policy
          </Link>
          <Link to="/terms" className="mx-2 hover:text-gray-400">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
