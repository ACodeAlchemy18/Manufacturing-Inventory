import { motion } from "framer-motion";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "₹999",
      desc: "Best for small manufacturers getting started",
      features: [
        "Raw Material Tracking",
        "Basic Stock Updates",
        "Limited Reports",
        "Email Support"
      ],
      highlight: false,
      button: "Get Started"
    },
    {
      name: "Professional",
      price: "₹2499",
      desc: "For growing factories with advanced needs",
      features: [
        "Everything in Starter",
        "Full WIP Inventory Control",
        "Stock Movement Tracking",
        "Advanced Reports & Analytics",
        "Priority Support"
      ],
      highlight: true,
      button: "Get Demo"
    },
    {
      name: "Enterprise",
      price: "₹4999",
      desc: "For large-scale manufacturing operations",
      features: [
        "Multi-Factory Support",
        "Real-Time Live Inventory",
        "Custom Integrations",
        "Dedicated Manager",
        "24/7 Support"
      ],
      highlight: false,
      button: "Contact Sales"
    }
  ];

  return (
    <section className="bg-[#f5f3ee] py-24 px-6 md:px-12 overflow-hidden">

      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Simple Pricing for Every Manufacturer
          </h2>
          <p className="text-gray-600 text-lg">
            Choose the best plan to manage your manufacturing inventory
            from raw materials to finished goods.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-10">

          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -12 }}
              className={`relative group rounded-2xl p-8 md:p-10 overflow-hidden
                transition duration-300
                ${
                  plan.highlight
                    ? "bg-[#0f172a] text-white shadow-2xl scale-105"
                    : "bg-white text-gray-900 border border-gray-200 hover:shadow-2xl"
                }`}
            >

              {/* Glow Background */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 
                              bg-gradient-to-br from-transparent via-purple-100 to-purple-200 pointer-events-none"></div>

              {/* Badge */}
              {plan.highlight && (
                <span className="absolute top-5 right-5 bg-white text-[#0f172a] text-xs px-3 py-1 rounded-full font-medium shadow">
                  Most Popular
                </span>
              )}

              {/* Title */}
              <h3 className="relative text-2xl font-semibold mb-3">
                {plan.name}
              </h3>

              {/* Description */}
              <p
                className={`relative text-sm mb-6 ${
                  plan.highlight ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {plan.desc}
              </p>

              {/* Price */}
              <div className="relative mb-8">
                <span className="text-4xl font-bold">
                  {plan.price}
                </span>
                <span
                  className={`text-sm ml-1 ${
                    plan.highlight ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  /month
                </span>
              </div>

              {/* Features */}
              <ul className="relative space-y-3 mb-10">
                {plan.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    viewport={{ once: true }}
                    className={`text-sm flex items-center gap-2 ${
                      plan.highlight ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    ✔ {feature}
                  </motion.li>
                ))}
              </ul>

              {/* Button */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className={`relative w-full py-3 rounded-full font-semibold transition duration-300
                  ${
                    plan.highlight
                      ? "bg-white text-[#0f172a] hover:bg-gray-200"
                      : "border border-black text-black hover:bg-black hover:text-white"
                  }`}
              >
                {plan.button}
              </motion.button>

              {/* Bottom Glow Line */}
              <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-purple-500 to-purple-700 
                              group-hover:w-full transition-all duration-500"></div>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}