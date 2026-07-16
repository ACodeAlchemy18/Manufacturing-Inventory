import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaChartLine,
  FaBoxes,
  FaEye,
  FaAward,
  FaLightbulb,
  FaIndustry,
  FaDollarSign
} from "react-icons/fa";

export default function Benefits() {
   
  const benefits = [
  {
    icon: <FaChartLine />,
    title: "Increase Production Efficiency",
    description:
      "Optimize production workflows and maximize factory output."
  },
  {
    icon: <FaDollarSign />,
    title: "Reduce Operational Costs",
    description:
      "Reduce waste and control manufacturing expenses."
  },
  {
    icon: <FaBoxes />,
    title: "Improve Inventory Accuracy",
    description:
      "Track inventory levels in real time with complete accuracy."
  },
  {
    icon: <FaEye />,
    title: "Real-Time Visibility",
    description:
      "Monitor operations from anywhere with live dashboards."
  },
  {
    icon: <FaLightbulb />,
    title: "Better Decision Making",
    description:
      "Use real-time analytics for smarter business decisions."
  },
  {
    icon: <FaAward />,
    title: "Enhanced Product Quality",
    description:
      "Improve quality control and compliance standards."
  }
];
 const [activeBenefit, setActiveBenefit] = useState(benefits[0]);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            ERP Benefits That Drive Growth
          </h2>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Transform your manufacturing operations with a powerful ERP
            platform designed for productivity, visibility, and growth.
          </p>
        </div>

        {/* Circle Section */}
    <div className="relative w-[550px] h-[550px] mx-auto hidden lg:block">

  {/* Circle */}
  <div className="absolute inset-0 rounded-full border border-lime-200"></div>

  {benefits.map((benefit, index) => {
const positions = [
  "top-0 left-1/2 -translate-x-1/2",          // Top
  "top-[22%] right-0",                        // Top Right
  "bottom-[22%] right-0",                     // Bottom Right
  "bottom-0 left-1/2 -translate-x-1/2",       // Bottom
  "bottom-[22%] left-0",                      // Bottom Left
  "top-[22%] left-0",                         // Top Left
];
    return (
      <motion.div
  key={index}
  onMouseEnter={() => setActiveBenefit(benefit)}
  className={`absolute w-40 text-center cursor-pointer ${positions[index]}`}
>
        <motion.div
  whileHover={{
    scale: 1.15,
    rotate: 5
  }}
  className="
    w-16 h-16 mx-auto
    rounded-full
    bg-white
    shadow-xl
    flex items-center
    justify-center
    text-2xl
    text-lime-500
    border border-lime-100
  "
>
  {benefit.icon}
</motion.div>

        <p className="mt-3 font-medium text-gray-800 text-sm">
          {benefit.title}
        </p>
      </motion.div>
    );
  })}

  {/* Center */}
  <motion.div
  className="absolute inset-0 flex items-center justify-center pointer-events-none"
>
  <div
    className="
      w-60
      h-60
      rounded-full
      bg-white
      shadow-2xl
      border-8
      border-lime-100
      flex
      flex-col
      items-center
      justify-center
      text-center
      p-8
    "
  >
    <FaIndustry className="text-5xl text-lime-500 mb-4" />

    <h3 className="font-bold text-gray-900 text-xl">
      {activeBenefit.title}
    </h3>

    <p className="text-sm text-gray-600 mt-3">
      {activeBenefit.description}
    </p>
  </div>
</motion.div>
</div>

        {/* Mobile Version */}
        <div className="grid sm:grid-cols-2 gap-6 lg:hidden">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="bg-[#f5f3ee] p-6 rounded-2xl"
            >
              <div className="text-3xl text-lime-500 mb-4">
                {item.icon}
              </div>

              <h3 className="font-semibold text-gray-900">
                {item.title}
              </h3>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button
            className="bg-lime-500 hover:bg-lime-600
                       text-white font-semibold
                       px-8 py-4 rounded-full
                       shadow-lg transition"
          >
            Explore ERP Benefits
          </button>
        </div>

      </div>
    </section>
  );
}

