import { motion } from "framer-motion";
import {
  FaIndustry,
  FaBoxes,
  FaShoppingCart,
  FaChartLine,
  FaMoneyBillWave,
  FaUsers,
  FaTools,
  FaClipboardCheck,
} from "react-icons/fa";

export default function ERPModules() {
  const modules = [
    {
      icon: <FaIndustry />,
      title: "Manufacturing",
      description: "Production planning & scheduling",
    },
    {
      icon: <FaBoxes />,
      title: "Inventory",
      description: "Real-time stock tracking",
    },
    {
      icon: <FaShoppingCart />,
      title: "Procurement",
      description: "Purchase order management",
    },
    {
      icon: <FaChartLine />,
      title: "Sales",
      description: "Orders & customer management",
    },
    {
      icon: <FaMoneyBillWave />,
      title: "Finance",
      description: "Accounting & invoicing",
    },
    {
      icon: <FaUsers />,
      title: "HR & Payroll",
      description: "Employee & payroll management",
    },
    {
      icon: <FaTools />,
      title: "Maintenance",
      description: "Equipment maintenance tracking",
    },
    {
      icon: <FaClipboardCheck />,
      title: "Quality Assurance",
      description: "Inspection & quality control",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">


          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6">
            Complete Manufacturing ERP Suite
          </h2>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Everything you need to manage production, inventory,
            finance, workforce and quality from one platform.
          </p>
        </div>

        {/* 4 Cards Top + 4 Cards Bottom */}
        <div className="grid grid-cols-4 gap-6">
  {modules.map((module, index) => (
    <motion.div
      key={index}
      whileHover={{ y: -8 }}
      className="
        bg-[#f5f3ee]
        rounded-3xl
        p-6
        shadow-sm
        hover:shadow-xl
        transition-all
        duration-300
      "
    >
      <div className="text-3xl text-lime-500 mb-4">
        {module.icon}
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {module.title}
      </h3>

      <p className="text-gray-600 text-sm">
        {module.description}
      </p>
    </motion.div>
  ))}
</div>

      </div>
    </section>
  );
}