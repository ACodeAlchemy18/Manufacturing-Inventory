import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#f5f3ee] min-h-screen flex items-center px-6 md:px-12 pt-20">
      
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Tag */}
          <span className="bg-black text-white px-4 py-1 rounded-full text-sm">
            Smart Manufacturing ERP
          </span>

          {/* Heading */}
         <h1 className="text-4xl md:text-6xl font-bold mt-6 leading-tight text-gray-900">
  Transform Your{" "}
  <span className="bg-gradient-to-r from-lime-500 to-green-600 bg-clip-text text-transparent">
    Manufacturing Operations
  </span>{" "}
  with Smart ERP
</h1>

          {/* Description */}
          <p className="text-gray-600 mt-6 text-lg max-w-lg">
            Manage production, inventory, procurement, quality, and
            finances from a single platform 
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/demo")}
              className="bg-lime-400 px-6 py-3 rounded-lg font-semibold hover:bg-lime-500 transition"
            >
              Request Demo
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/contact")}
              className="border border-black px-6 py-3 rounded-lg hover:bg-black hover:text-white transition"
            >
              Contact Sales
            </motion.button>

          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-12">

            {[
              { value: "500+", label: "Manufacturers" },
              { value: "35%", label: "Efficiency Gain" },
              { value: "99.9%", label: "Data Accuracy" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <h3 className="text-2xl font-bold text-gray-900">
                  {item.value}
                </h3>
                <p className="text-gray-500 text-sm">{item.label}</p>
              </motion.div>
            ))}

          </div>
        </motion.div>

        {/* RIGHT CONTENT (UI Preview Card) */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-semibold text-gray-800">
                ERP Dashboard Overview
              </h4>
              <span className="text-xs bg-lime-400 px-3 py-1 rounded-full">
                Live
              </span>
            </div>

            {/* Stats Boxes */}
            <div className="grid grid-cols-2 gap-4">

              <div className="bg-[#f5f3ee] p-4 rounded-xl">
                <p className="text-sm text-gray-500">Production Orders</p>
                <h3 className="text-xl font-bold text-gray-900">
                  1,250
                </h3>
              </div>

              <div className="bg-[#f5f3ee] p-4 rounded-xl">
                <p className="text-sm text-gray-500">Inventory Status</p>
                <h3 className="text-xl font-bold text-gray-900">
                  98%
                </h3>
              </div>

              <div className="bg-[#f5f3ee] p-4 rounded-xl">
                <p className="text-sm text-gray-500">Quality Score</p>
                <h3 className="text-xl font-bold text-gray-900">
                  99.2%
                </h3>
              </div>

              <div className="bg-[#f5f3ee] p-4 rounded-xl">
                <p className="text-sm text-gray-500">Cost Savings</p>
                <h3 className="text-xl font-bold text-green-500">
                  30%
                </h3>
              </div>

            </div>
          </div>

          {/* Floating Cards */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute -top-6 -left-6 bg-black text-white px-4 py-3 rounded-xl shadow-lg text-sm"
          >
            Production Running Smoothly
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute -bottom-6 -right-6 bg-lime-400 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold"
          >
            Business Growth 📈
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}