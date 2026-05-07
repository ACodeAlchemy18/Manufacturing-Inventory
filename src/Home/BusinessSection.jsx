import { motion } from "framer-motion";

export default function BusinessSection() {

  const fadeLeft = {
    hidden: { opacity: 0, x: -60 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 60 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const imageWrapper =
    "relative overflow-hidden rounded-2xl shadow-xl group will-change-transform";

  const imageClass =
    "w-full h-[260px] md:h-[340px] object-cover transition duration-500 group-hover:scale-110";

  const overlay =
    "absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500";

  const sectionCard =
    "bg-[#f8f7f4] rounded-3xl p-6 md:p-10 shadow-md hover:shadow-2xl transition duration-300";

  const fallback =
    "https://via.placeholder.com/800x500?text=Manufacturing+Image";

  return (
    <section className="bg-white py-20 md:py-28 px-4 sm:px-6 md:px-16">

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-center max-w-3xl mx-auto mb-20 md:mb-28"
      >
        <h2 className="text-3xl md:text-5xl font-bold">
          How Our Manufacturing Inventory System Improves Your Production
        </h2>
      </motion.div>

      <div className="max-w-6xl mx-auto space-y-16 md:space-y-24">

        {/* SECTION 1 */}
        <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${sectionCard}`}>
          
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className={imageWrapper}
          >
            <img
              src="https://images.pexels.com/photos/2569842/pexels-photo-2569842.jpeg"
              onError={(e) => (e.target.src = fallback)}
              alt="Factory"
              className={imageClass}
            />
            <div className={overlay}></div>
          </motion.div>

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-purple-600">
              Reduce Production Delays & Material Shortages
            </h3>
            <p className="text-gray-600 mb-6">
              Monitor raw materials and work-in-progress in real-time.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li>✔ Real-time tracking</li>
              <li>✔ Smart alerts</li>
              <li>✔ Avoid downtime</li>
              <li>✔ Better planning</li>
            </ul>
          </motion.div>
        </div>

        {/* SECTION 2 */}
        <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${sectionCard}`}>
          
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-purple-600">
              Track Every Stage of Manufacturing
            </h3>
            <p className="text-gray-600 mb-6">
              Full visibility from pre-assembling to dispatch.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li>✔ End-to-end tracking</li>
              <li>✔ Scrap monitoring</li>
              <li>✔ Quality control</li>
              <li>✔ Full visibility</li>
            </ul>
          </motion.div>

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className={imageWrapper}
          >
            <img
              src="https://images.pexels.com/photos/3846554/pexels-photo-3846554.jpeg"
              onError={(e) => (e.target.src = fallback)}
              alt="Production"
              className={imageClass}
            />
            <div className={overlay}></div>
          </motion.div>
        </div>

        {/* SECTION 3 */}
        <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${sectionCard}`}>
          
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className={imageWrapper}
          >
            <img
              src="https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg"
              onError={(e) => (e.target.src = fallback)}
              alt="Analytics"
              className={imageClass}
            />
            <div className={overlay}></div>
          </motion.div>

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-purple-600">
              Make Smarter Decisions with Data
            </h3>
            <p className="text-gray-600 mb-6">
              Optimize operations using analytics.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li>✔ Dashboards</li>
              <li>✔ Reports</li>
              <li>✔ Cost optimization</li>
              <li>✔ Forecasting</li>
            </ul>
          </motion.div>
        </div>

      </div>

    </section>
  );
}