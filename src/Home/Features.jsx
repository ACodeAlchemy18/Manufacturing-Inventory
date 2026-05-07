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
      icon: <FaBoxesStacked />,
      title: "Live inventory management",
      description:
        "Get total inventory control from raw materials, work-in-progress, and finished goods.",
      link: "/inventory/raw-materials"
    },
    {
      icon: <FaGears />,
      title: "End-to-end traceability",
      description:
        "Track your products from materials to sold goods for effective quality assurance.",
      link: "/inventory/wip/pre-assembling"
    },
    {
      icon: <FaWarehouse />,
      title: "Accurate costing",
      description:
        "Track manufacturing costs and make better pricing decisions based on data.",
      link: "/inventory/finished-goods"
    },
    {
      icon: <FaTruckFast />,
      title: "Production planning",
      description:
        "Reprioritize tasks and reallocate materials for efficient sales order fulfillment.",
      link: "/inventory/stock-movement"
    },
    {
      icon: <FaChartLine />,
      title: "Inventory planning",
      description:
        "Generate forecasts based on accurate consumption data and plan ahead.",
      link: "/inventory/reports"
    },
    {
      icon: <FaBolt />,
      title: "Custom workflows via API",
      description:
        "Set up integrations and create workflows to streamline your business operations.",
      link: "/inventory/dashboard"
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
          Enhance your manufacturing experience with powerful tools designed for efficiency.
        </p>
      </motion.div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-8">

        {features.map((feature, index) => (
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
              <div className="relative text-3xl text-purple-500 mb-6 
                              group-hover:text-purple-700 group-hover:scale-110 transition duration-300">
                {feature.icon}
              </div>

              {/* Content */}
              <div className="relative flex-grow">
                <h3 className="text-xl font-semibold mb-3 
                               text-gray-900 group-hover:text-purple-700 transition">
                  {feature.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition">
                  {feature.description}
                </p>
              </div>

              {/* Bottom Section */}
              <div className="relative mt-6 flex items-center justify-between">

                <span className="text-purple-600 font-medium text-sm 
                                 group-hover:text-purple-800 group-hover:translate-x-1 transition">
                  Explore
                </span>

                <span className="text-lg text-purple-600 
                                 group-hover:text-purple-800 group-hover:translate-x-2 transition">
                  →
                </span>
              </div>

              {/* Bottom Border Animation */}
              <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-purple-500 to-purple-700 
                              group-hover:w-full transition-all duration-300"></div>

            </motion.div>
          </Link>
        ))}

      </div>

    </section>
  );
}