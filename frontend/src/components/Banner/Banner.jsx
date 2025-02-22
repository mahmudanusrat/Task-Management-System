import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div>
      <div className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-24 px-6 flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold">Manage Your Tasks Efficiently</h2>
        <p className="mt-4 text-lg max-w-lg">
          Organize your work, track progress, and boost productivity with
          TaskFlow.
        </p>
        <Link
          to="/tasks"
          className="mt-6 bg-white text-blue-600 font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-gray-100"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Banner;
