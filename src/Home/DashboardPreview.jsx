import { motion } from "framer-motion";
import {
  TrendingUp,
  Package,
  Factory,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPreview() {
  return (
    <section className="bg-[#faf8f3] py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >


            <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Complete Visibility Across
              <br />
              Your Manufacturing
              <br />
              Operations
            </h2>

           

            <div className="mt-10 space-y-5">
              {[
                "Real-Time KPI Analytics",
                "Production Reports",
                "Inventory Tracking",
                "Machine Monitoring",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2
                    size={20}
                    className="text-lime-500"
                  />
                  <span className="text-slate-700 font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT DASHBOARD */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >

            {/* Main Dashboard Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-[0_15px_50px_rgba(0,0,0,0.08)]">

              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900">
                  Manufacturing Analytics
                </h3>

                <div className="bg-lime-100 text-lime-700 px-3 py-1 rounded-full text-sm font-medium">
                  Live
                </div>
              </div>

              {/* KPI CARDS */}
              <div className="grid grid-cols-2 gap-4 mb-6">

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-slate-500 text-sm">
                    Production
                  </p>

                  <h4 className="text-2xl font-bold mt-1">
                    12.5K
                  </h4>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-slate-500 text-sm">
                    Efficiency
                  </p>

                  <h4 className="text-2xl font-bold mt-1">
                    94%
                  </h4>
                </div>

              </div>

              {/* CHART */}
              <div className="bg-lime-400 rounded-3xl p-5">

                <div className="flex justify-between items-center mb-5">
                  <span className="font-semibold text-slate-900">
                    Production Output
                  </span>

                  <span className="text-sm text-slate-700">
                    Last 6 Months
                  </span>
                </div>

                <div className="flex items-end gap-3 h-44">

                  <div className="bg-white rounded-t-lg w-full h-[35%]" />
                  <div className="bg-white rounded-t-lg w-full h-[55%]" />
                  <div className="bg-white rounded-t-lg w-full h-[45%]" />
                  <div className="bg-white rounded-t-lg w-full h-[75%]" />
                  <div className="bg-white rounded-t-lg w-full h-[65%]" />
                  <div className="bg-white rounded-t-lg w-full h-[95%]" />

                </div>

                <div className="flex justify-between mt-3 text-xs text-slate-700">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>

              </div>
            </div>

            {/* Floating KPI */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                repeat: Infinity,
                duration: 4,
              }}
              className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-lg p-4 w-52"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp
                  size={18}
                  className="text-lime-600"
                />
                <span className="font-medium text-sm">
                  KPI Analytics
                </span>
              </div>

              <h4 className="text-2xl font-bold">
                92%
              </h4>

              <p className="text-slate-500 text-sm">
                Performance Growth
              </p>
            </motion.div>

            {/* Floating Inventory */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 5,
              }}
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-lg p-4 w-56"
            >
              <div className="flex items-center gap-2 mb-3">
                <Package
                  size={18}
                  className="text-lime-600"
                />
                <span className="font-medium text-sm">
                  Inventory
                </span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-lime-500 h-2 rounded-full w-[78%]" />
              </div>

              <p className="text-sm text-slate-600 mt-2">
                78% Stock Utilized
              </p>
            </motion.div>

            {/* Floating Production */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                repeat: Infinity,
                duration: 6,
              }}
              className="absolute top-1/2 -left-12 bg-white rounded-2xl shadow-lg p-4 w-52"
            >
              <div className="flex items-center gap-2 mb-2">
                <Factory
                  size={18}
                  className="text-lime-600"
                />
                <span className="font-medium text-sm">
                  Production
                </span>
              </div>

              <h4 className="text-xl font-bold">
                12,500
              </h4>

              <p className="text-slate-500 text-sm">
                Units This Month
              </p>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}