import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

/* Pages */
import Dashboard from "../pages/Dashboard";
import RawMaterials from "../pages/RawMaterials";
import FinishedGoods from "../pages/FinishedGoods";
import StockMovement from "../pages/StockMovement";
import Reports from "../pages/Reports";
import ProductionOverview from "../pages/ProductionOverview";
import ProductMaster from "../pages/ProductMaster";

/* WIP */
import PreAssembling from "../wip/PreAssembling";
import Phosphating from "../wip/Phosphating";
import Powdering from "../wip/Powdering";

/* ✅ POST ASSEMBLING (NEW) */
import QualityInspection from "../post/QualityInspection";
import FunctionalTesting from "../post/FunctionalTesting";
import Rework from "../post/Rework";
import Packaging from "../post/Packaging";
import Dispatch from "../post/Dispatch";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>

        {/* Default */}
        <Route index element={<Dashboard />} />

        {/* Main Routes */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="raw-materials" element={<RawMaterials />} />
        <Route path="product-master" element={<ProductMaster />} />
        <Route path="production-overview" element={<ProductionOverview />} />
        <Route path="finished-goods" element={<FinishedGoods />} />
        <Route path="stock-movement" element={<StockMovement />} />
        <Route path="reports" element={<Reports />} />

        {/* ================= WIP ================= */}
        <Route path="wip/pre-assembling" element={<PreAssembling />} />
        <Route path="wip/phosphating" element={<Phosphating />} />
        <Route path="wip/powdering" element={<Powdering />} />

        {/* ================= POST ASSEMBLING ================= */}

        {/* Quality Checking */}
        <Route
          path="post/qc-inspection"
          element={<QualityInspection />}
        />
        <Route
          path="post/functional-testing"
          element={<FunctionalTesting />}
        />

        {/* Other Steps */}
        <Route path="post/rework" element={<Rework />} />
        <Route path="post/packaging" element={<Packaging />} />
        <Route path="post/dispatch" element={<Dispatch />} />

      </Route>
    </Routes>
  );
}