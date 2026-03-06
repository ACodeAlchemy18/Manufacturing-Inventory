import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBars } from "react-icons/fa6";

export default function Topbar({ toggleSidebar }) {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f4f2ee] px-6 py-4 flex justify-between items-center shadow-sm">

      {/* Left */}
      <div className="flex items-center gap-4">

        {/* Back to Home */}
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 flex items-center justify-center rounded-full 
          border border-gray-300 hover:bg-black hover:text-white transition"
        >
          <FaArrowLeft />
        </button>

        {/* Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="w-10 h-10 flex items-center justify-center rounded-full 
          border border-gray-300 hover:bg-black hover:text-white transition"
        >
          <FaBars />
        </button>

        <h1 className="text-xl font-semibold text-black">
          Manufacturing Inventory
        </h1>

      </div>

      {/* Right */}
      <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-semibold shadow-sm">
        A
      </div>

    </div>
  );
}