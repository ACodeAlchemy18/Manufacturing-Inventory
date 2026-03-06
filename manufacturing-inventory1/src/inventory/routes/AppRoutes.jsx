import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

import Dashboard from "../pages/Dashboard";
import RawMaterials from "../pages/RawMaterials";
import FinishedGoods from "../pages/FinishedGoods";
import StockMovement from "../pages/StockMovement";
import Reports from "../pages/Reports";

import PreAssembling from "../wip/PreAssembling";
import Phosphating from "../wip/Phosphating";
import Powdering from "../wip/Powdering";
import ProductionOverview from "../pages/ProductionOverview";


export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>

        {/* Default page */}
        <Route index element={<Dashboard />} />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="raw-materials" element={<RawMaterials />} />
        <Route
  path="production-overview"
  element={<ProductionOverview />}
/>

        {/* ✅ WIP Routes */}
       
      
        <Route path="wip/pre-assembling" element={<PreAssembling />} />
        <Route path="wip/phosphating" element={<Phosphating />} />
        <Route path="wip/powdering" element={<Powdering />} />

        <Route path="finished-goods" element={<FinishedGoods />} />
        <Route path="stock-movement" element={<StockMovement />} />
        <Route path="reports" element={<Reports />} />

      </Route>
    </Routes>
  );
}