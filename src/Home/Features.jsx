import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBoxesStacked,
  FaGears,
  FaWarehouse,
  FaTruckFast,
  FaChartLine,
  FaBolt
} from "react-icons/fa6";

export default function Features() {
 const features = [
  {
    icon: <FaGears />,
    title: "Production Planning & Scheduling",
    description:
      "Plan, schedule, and monitor production processes efficiently to maximize output and reduce downtime.",
    link: "/features/production-planning"
  },
  {
    icon: <FaBoxesStacked />,
    title: "Inventory Management",
    description:
      "Track raw materials, work-in-progress, and finished goods with real-time inventory visibility.",
    link: "/features/inventory-management"
  },
  {
    icon: <FaTruckFast />,
    title: "Procurement & Purchase Orders",
    description:
      "Automate supplier management, purchase requests, approvals, and procurement workflows.",
    link: "/features/procurement"
  },
  {
    icon: <FaBolt />,
    title: "Quality Control Management",
    description:
      "Ensure product quality with inspections, compliance tracking, and quality assurance workflows.",
    link: "/features/quality-control"
  },
  {
    icon: <FaWarehouse />,
    title: "Warehouse Management",
    description:
      "Manage stock movements, warehouse operations, storage locations, and dispatch activities.",
    link: "/features/warehouse-management"
  },
  {
    icon: <FaChartLine />,
    title: "Financial & Accounting Integration",
    description:
      "Connect manufacturing operations with accounting, invoicing, budgeting, and financial reporting.",
    link: "/features/accounting"
  },
  {
    icon: <FaChartLine />,
    title: "Real-Time Reporting & Analytics",
    description:
      "Access dashboards, KPIs, and business insights for data-driven decision making.",
    link: "/features/analytics"
  },
  {
    icon: <FaWarehouse />,
    title: "Multi-Plant Management",
    description:
      "Monitor and manage multiple factories, warehouses, and production units from one platform.",
    link: "/features/multi-plant"
  }
];

  return (
    <section className="bg-white py-24 px-6 md:px-12">

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center max-w-3xl mx-auto mb-20"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          Manufacturing Inventory Features
        </h2>
        <p className="text-gray-500 text-lg leading-relaxed">
         Streamline production, inventory, procurement, quality control,
  finance, and operations with one integrated ERP platform.
        </p>
      </motion.div>

      {/* Grid Layout */}
<div className="max-w-7xl mx-auto">

  {/* First 6 Features */}
  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">

    {features.slice(0, 6).map((feature, index) => (
      <Link key={index} to={feature.link} className="h-full">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          viewport={{ once: true }}
          whileHover={{ y: -10 }}
          className="group relative bg-[#f4f2ee] p-8 rounded-2xl
                     flex flex-col justify-between h-full
                     shadow-sm hover:shadow-2xl
                     transition duration-300 cursor-pointer overflow-hidden"
        >

          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-50 to-purple-100 opacity-0 group-hover:opacity-100 transition duration-300"></div>

          {/* Icon */}
          <div
            className="relative text-3xl text-purple-500 mb-6
                       group-hover:text-purple-700 group-hover:scale-110 transition duration-300"
          >
            {feature.icon}
          </div>

          {/* Content */}
          <div className="relative flex-grow">
            <h3
              className="text-xl font-semibold mb-3
                         text-gray-900 group-hover:text-purple-700 transition"
            >
              {feature.title}
            </h3>

            <p
              className="text-gray-600 text-sm leading-relaxed
                         group-hover:text-gray-700 transition"
            >
              {feature.description}
            </p>
          </div>

          {/* Bottom Section */}
          <div className="relative mt-6 flex items-center justify-between">

            <span
              className="text-purple-600 font-medium text-sm
                         group-hover:text-purple-800 group-hover:translate-x-1 transition"
            >
              Explore
            </span>

            <span
              className="text-lg text-purple-600
                         group-hover:text-purple-800 group-hover:translate-x-2 transition"
            >
              →
            </span>

          </div>

          {/* Bottom Border Animation */}
          <div
            className="absolute bottom-0 left-0 h-[3px] w-0
                       bg-gradient-to-r from-purple-500 to-purple-700
                       group-hover:w-full transition-all duration-300"
          ></div>

        </motion.div>
      </Link>
    ))}

  </div>

  {/* Last 2 Features Centered */}
  <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">

    {features.slice(6).map((feature, index) => (
      <Link key={index + 6} to={feature.link} className="h-full">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: (index + 6) * 0.1, duration: 0.5 }}
          viewport={{ once: true }}
          whileHover={{ y: -10 }}
          className="group relative bg-[#f4f2ee] p-8 rounded-2xl
                     flex flex-col justify-between h-full
                     shadow-sm hover:shadow-2xl
                     transition duration-300 cursor-pointer overflow-hidden"
        >

          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-50 to-purple-100 opacity-0 group-hover:opacity-100 transition duration-300"></div>

          {/* Icon */}
          <div
            className="relative text-3xl text-purple-500 mb-6
                       group-hover:text-purple-700 group-hover:scale-110 transition duration-300"
          >
            {feature.icon}
          </div>

          {/* Content */}
          <div className="relative flex-grow">
            <h3
              className="text-xl font-semibold mb-3
                         text-gray-900 group-hover:text-purple-700 transition"
            >
              {feature.title}
            </h3>

            <p
              className="text-gray-600 text-sm leading-relaxed
                         group-hover:text-gray-700 transition"
            >
              {feature.description}
            </p>
          </div>

          {/* Bottom Section */}
          <div className="relative mt-6 flex items-center justify-between">

            <span
              className="text-purple-600 font-medium text-sm
                         group-hover:text-purple-800 group-hover:translate-x-1 transition"
            >
              Explore
            </span>

            <span
              className="text-lg text-purple-600
                         group-hover:text-purple-800 group-hover:translate-x-2 transition"
            >
              →
            </span>

          </div>

          {/* Bottom Border Animation */}
          <div
            className="absolute bottom-0 left-0 h-[3px] w-0
                       bg-gradient-to-r from-purple-500 to-purple-700
                       group-hover:w-full transition-all duration-300"
          ></div>

        </motion.div>
      </Link>
    ))}

  </div>

</div>

    </section>
  );
}