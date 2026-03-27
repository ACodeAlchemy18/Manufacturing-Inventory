import { motion } from "framer-motion";

export default function BusinessSection() {

  const fadeLeft = {
    hidden: { opacity: 0, x: -120 },
    show: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 }
    }
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 120 },
    show: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 }
    }
  };

  const imageClass =
    "w-full h-[260px] md:h-[320px] object-cover rounded-xl shadow-md";

  return (
    <section className="bg-white py-28 px-6 md:px-16">

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 70 }}
        viewport={{ once: true }}
        className="text-center max-w-3xl mx-auto mb-28"
      >
        <h2 className="text-4xl font-bold mb-5 leading-tight">
          How Our Manufacturing Inventory System Improves Your Production
        </h2>
      </motion.div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto space-y-32">

        {/* SECTION 1 */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.img
            variants={fadeLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            src="https://tse4.mm.bing.net/th/id/OIP.lC83hHfM-QkWa8jU1xJR0gHaEJ?pid=Api&P=0&h=180"
            className={imageClass}
          />

          <motion.div variants={fadeRight} initial="hidden" whileInView="show">
            <h3 className="text-2xl font-semibold mb-4 text-purple-600">
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
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeLeft} initial="hidden" whileInView="show">
            <h3 className="text-2xl font-semibold mb-4 text-purple-600">
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

          <motion.img
            variants={fadeRight}
            initial="hidden"
            whileInView="show"
            src="https://images.unsplash.com/photo-1581092335397-9583eb92d232"
            className={imageClass}
          />
        </div>

        {/* SECTION 3 */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.img
            variants={fadeLeft}
            initial="hidden"
            whileInView="show"
            src="https://tse4.mm.bing.net/th/id/OIP.c1OWKSf8H_bNZqCwFL1vJAHaDt?pid=Api&P=0&h=180"
            className={imageClass}
          />

          <motion.div variants={fadeRight} initial="hidden" whileInView="show">
            <h3 className="text-2xl font-semibold mb-4 text-purple-600">
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

      {/* 🔥 CTA SECTION (LIKE YOUR IMAGE) */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-32"
      >
        <div className="bg-[#e6c79c] rounded-3xl py-16 px-6 md:px-16 text-center max-w-6xl mx-auto shadow-lg">

          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#4a2e2e]">
            Get software that works with you
          </h2>

          <p className="text-gray-800 max-w-2xl mx-auto mb-10 text-lg">
            Test it yourself for free or book a demo with our team. 
            Explore features with your own data — no credit card required.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <button className="bg-black text-white px-8 py-3 rounded-lg font-semibold 
              hover:scale-105 hover:shadow-lg transition duration-300">
              Get started free
            </button>

            <button className="border-2 border-black px-8 py-3 rounded-lg font-semibold 
              hover:bg-black hover:text-white transition duration-300">
              Get a demo
            </button>
          </div>

        </div>
      </motion.div>

    </section>
  );
}