import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBars, FaUserCircle } from "react-icons/fa";

export default function Topbar({ toggleSidebar }) {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const menuRef = useRef();

  // Get logged in user
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

  // Close dropdown when click outside
  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
      localStorage.removeItem("auth"); // ✅ IMPORTANT
    navigate("/");
  };

  // Open profile page
const handleProfile = () => {
  setShowMenu(false);
  navigate("/inventory/profile");
};
  return (
    <div className="bg-[#f4f2ee] px-6 py-4 flex justify-between items-center shadow-sm">

      {/* Left */}
      <div className="flex items-center gap-4">

        {/* Back */}
<button
  onClick={() => navigate("/")}
  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-black hover:text-white transition"
>
  <FaArrowLeft />
</button>

        {/* Sidebar */}
        <button
          onClick={toggleSidebar}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-black hover:text-white transition"
        >
          <FaBars />
        </button>

        <h1 className="text-xl font-semibold text-black">
          Manufacturing Inventory
        </h1>
      </div>

      {/* Right Profile */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-sm text-xl"
        >
          <FaUserCircle />
        </button>

        {/* Dropdown */}
        {showMenu && (
          <div className="absolute right-0 mt-3 w-52 bg-white shadow-lg rounded-xl border z-50 overflow-hidden">

            {/* User Info */}
            <div className="px-4 py-3 border-b">
              <p className="font-semibold">{user.name || "Admin"}</p>
              <p className="text-sm text-gray-500">
                {user.email || "admin@gmail.com"}
              </p>
            </div>

            {/* Profile */}
            <button
              onClick={handleProfile}
              className="w-full text-left px-4 py-3 hover:bg-gray-100"
            >
              Profile
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50"
            >
              Logout
            </button>

          </div>
        )}
      </div>

    </div>
  );
}