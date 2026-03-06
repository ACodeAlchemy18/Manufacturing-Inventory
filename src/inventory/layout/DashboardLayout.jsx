import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-gray-50">

      {/* 🔥 Topbar FULL WIDTH */}
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Body Section */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar (only this moves) */}
        <div
          className={`transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-0"
          } overflow-hidden`}
        >
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          <Outlet />
        </div>

      </div>
    </div>
  );
}