import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const industries = [
  {
    name: "Automotive",
    desc: "Smart mobility & automation systems",
    points: [
      "EV Systems Integration",
      "AI Vehicle Tracking",
      "Smart Manufacturing",
    ],
  },
  {
    name: "Electronics",
    desc: "Embedded & smart devices solutions",
    points: [
      "IoT Devices",
      "PCB Optimization",
      "Sensor Networks",
    ],
  },
  {
    name: "Pharmaceuticals",
    desc: "Digital healthcare & compliance tech",
    points: [
      "Drug Tracking Systems",
      "Lab Management",
      "Compliance Automation",
    ],
  },
  {
    name: "Food & Beverage",
    desc: "Supply chain & quality tracking systems",
    points: [
      "Cold Chain Monitoring",
      "Quality AI",
      "Inventory Automation",
    ],
  },
  {
    name: "Textile & Apparel",
    desc: "Inventory & production optimization",
    points: [
      "Fabric Tracking",
      "Smart Inventory",
      "Demand Forecasting",
    ],
  },
  {
    name: "Chemicals",
    desc: "Safety & process automation systems",
    points: [
      "Hazard Monitoring",
      "Process Automation",
      "Safety Systems",
    ],
  },
  {
    name: "Engineering & Machinery",
    desc: "Industrial IoT & monitoring",
    points: [
      "Predictive Maintenance",
      "Machine Monitoring",
      "Smart Factory",
    ],
  },
];

export default function IndustrySolutionsModern() {
  const [active, setActive] = useState(0);
  const current = industries[active];

  return (
    <section className="min-h-[75vh] bg-[#0f172a] text-white flex items-center overflow-hidden py-12">
      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-3 gap-16 px-8 lg:px-16">

        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center">
          <p className="text-cyan-400 font-medium text-sm tracking-wider mb-2">
            INDUSTRIES WE SERVE
          </p>

          <h2 className="text-3xl lg:text-4xl font-bold mb-8">
            Industry Solutions
          </h2>

          <div className="space-y-2 border-l border-slate-700 pl-5">
            {industries.map((item, index) => (
              <div
                key={index}
                onMouseEnter={() => setActive(index)}
                className={`relative cursor-pointer rounded-xl px-4 py-3 transition-all duration-300
                  ${
                    active === index
                      ? "bg-slate-800/60"
                      : "hover:bg-slate-800/30"
                  }`}
              >
                {active === index && (
                  <motion.div
                    layoutId="activeLine"
                    className="absolute -left-[21px] top-2 bottom-2 w-1 rounded-full bg-cyan-400"
                  />
                )}

                <h3 className="font-semibold text-white text-sm lg:text-base">
                  {item.name}
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:col-span-2 flex items-center pl-6 lg:pl-16 relative">

          {/* Glow */}
          <div className="absolute w-[320px] h-[320px] bg-cyan-500/10 blur-[100px] rounded-full right-0 top-1/2 -translate-y-1/2" />

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.35 }}
              className="relative z-10"
            >
              {/* Background Number */}
              <div className="absolute -top-16 -left-4 text-[110px] font-bold text-white/5 select-none">
                0{active + 1}
              </div>

              {/* Heading */}
              <h3 className="text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                {current.name}
              </h3>

              {/* Description */}
              <p className="text-slate-300 text-lg leading-relaxed max-w-xl mb-8">
                {current.desc}
              </p>

              {/* Capabilities */}
              <div>
                <p className="text-cyan-400 font-semibold uppercase tracking-wider text-sm mb-5">
                  Key Capabilities
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {current.points.map((point, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="text-slate-200">
                        {point}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}