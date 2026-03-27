import { NavLink } from "react-router-dom";
import {
  FaIndustry,
  FaBoxesStacked,
  FaGears,
  FaWarehouse,
  FaTruckFast,
  FaChartLine,
  FaChevronDown,
  FaScrewdriverWrench,
  FaFlask,
  FaSprayCanSparkles,
  FaChartPie,
  FaCircleCheck,
  FaBox,
  FaTruck
} from "react-icons/fa6";
import { useState } from "react";

export default function Sidebar() {
  const [openWip, setOpenWip] = useState(false);
  const [openPost, setOpenPost] = useState(false);
  const [openQC, setOpenQC] = useState(false);

  return (
    <div className="w-64 bg-[#f4f2ee] min-h-[calc(100vh-64px)] p-6 rounded-r-[30px]">

      <ul className="space-y-4">

        {/* Dashboard */}
        <NavItem to="/inventory/dashboard">
          <FaChartPie />
          Dashboard
        </NavItem>

        {/* Raw Materials */}
        <NavItem to="/inventory/raw-materials">
          <FaBoxesStacked />
          Raw Materials
        </NavItem>

        {/* ✅ NEW: Product Master */}
<NavItem to="/inventory/product-master">
  <FaBoxesStacked />
  Product Master
</NavItem>

        {/* ================= WIP INVENTORY ================= */}
        <div>
          <div
            onClick={() => setOpenWip(!openWip)}
            className="flex items-center justify-between px-4 py-3 rounded-xl 
                       text-purple-600 hover:bg-white hover:shadow-sm 
                       cursor-pointer transition"
          >
            <div className="flex items-center gap-3">
              <FaGears />
              WIP Inventory
            </div>

            <FaChevronDown
              className={`transition ${openWip ? "rotate-180" : ""}`}
            />
          </div>

          {openWip && (
            <ul className="ml-6 mt-3 space-y-2 text-sm">

              <SubNavItem to="/inventory/wip/pre-assembling">
                <FaScrewdriverWrench />
                Pre-Assembling
              </SubNavItem>

              <SubNavItem to="/inventory/wip/phosphating">
                <FaFlask />
                Phosphating
              </SubNavItem>

              <SubNavItem to="/inventory/wip/powdering">
                <FaSprayCanSparkles />
                Powdering
              </SubNavItem>

            </ul>
          )}
        </div>

        {/* ================= POST ASSEMBLING (SEPARATE) ================= */}
        <div>
          <div
            onClick={() => setOpenPost(!openPost)}
            className="flex items-center justify-between px-4 py-3 rounded-xl 
                       text-purple-600 hover:bg-white hover:shadow-sm 
                       cursor-pointer transition"
          >
            <div className="flex items-center gap-3">
              <FaCircleCheck />
              Post-Assembling
            </div>

            <FaChevronDown
              className={`transition ${openPost ? "rotate-180" : ""}`}
            />
          </div>

          {openPost && (
            <ul className="ml-6 mt-3 space-y-2 text-sm">

              {/* QUALITY CHECKING */}
              <div>
                <div
                  onClick={() => setOpenQC(!openQC)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg 
                             text-gray-700 hover:bg-white cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FaCircleCheck />
                    Quality Checking
                  </div>

                  <FaChevronDown
                    className={`transition ${openQC ? "rotate-180" : ""}`}
                  />
                </div>

                {openQC && (
                  <ul className="ml-5 mt-2 space-y-1">

                    <SubNavItem to="/inventory/post/qc-inspection">
                      Quality Inspection 
                    </SubNavItem>

                    <SubNavItem to="/inventory/post/functional-testing">
                      Functional Testing
                    </SubNavItem>

                  </ul>
                )}
              </div>

              {/* REWORK */}
              <SubNavItem to="/inventory/post/rework">
                <FaScrewdriverWrench />
                Rework
              </SubNavItem>

              {/* PACKAGING */}
              <SubNavItem to="/inventory/post/packaging">
                <FaBox />
                Packaging
              </SubNavItem>

              {/* DISPATCH */}
              <SubNavItem to="/inventory/post/dispatch">
                <FaTruck />
                Dispatch
              </SubNavItem>

            </ul>
          )}
        </div>

        {/* Production Overview */}
        <NavItem to="/inventory/production-overview">
          <FaIndustry />
          Production Overview
        </NavItem>

        {/* Finished Goods */}
        <NavItem to="/inventory/finished-goods">
          <FaWarehouse />
          Finished Goods
        </NavItem>

        {/* Stock Movement */}
        <NavItem to="/inventory/stock-movement">
          <FaTruckFast />
          Stock Movement
        </NavItem>

        {/* Reports */}
        <NavItem to="/inventory/reports">
          <FaChartLine />
          Reports
        </NavItem>

      </ul>
    </div>
  );
}


/* 🔥 Main Nav Item */
function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition
         ${
           isActive
             ? "bg-white text-purple-600 shadow-sm font-medium"
             : "text-purple-600 hover:bg-white hover:shadow-sm"
         }`
      }
    >
      {children}
    </NavLink>
  );
}


/* 🔥 Sub Nav Item */
function SubNavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-lg transition
         ${
           isActive
             ? "bg-white text-purple-600 shadow-sm"
             : "text-gray-600 hover:text-purple-600 hover:bg-white"
         }`
      }
    >
      {children}
    </NavLink>
  );
}