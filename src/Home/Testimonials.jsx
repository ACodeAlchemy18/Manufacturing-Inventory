import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Testimonials() {
  const testimonials = [
    {
      text: "We reduced inventory errors by 35% and now track every stage from raw material to dispatch in real-time.",
      name: "Rajesh Patil",
      role: "Production Head, Auto Components"
    },
    {
      text: "Before this system, we relied on Excel. Now our entire manufacturing process is automated and transparent.",
      name: "Amit Sharma",
      role: "Factory Owner, Nashik"
    },
    {
      text: "The QC tracking and scrap monitoring features helped us cut down production waste significantly.",
      name: "Sneha Kulkarni",
      role: "Quality Manager"
    },
    {
      text: "Production planning is now faster and more accurate. We always know what can be produced and when.",
      name: "Vikram Desai",
      role: "Operations Manager"
    }
  ];

  return (
    <section className="bg-[#f8f7f4] py-24 px-6 md:px-12">

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center max-w-3xl mx-auto mb-20"
      >
        <h2 className="text-4xl font-bold mb-4">
          What Manufacturers Say
        </h2>
        <p className="text-gray-500 text-lg">
          Trusted by production teams to improve efficiency and control operations.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

        {testimonials.map((item, index) => (
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              x: index % 2 === 0 ? -100 : 100 // left/right
            }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="bg-[#e9e6df] p-8 rounded-[20px] relative 
                       hover:shadow-2xl hover:scale-[1.03] 
                       transition duration-300"
          >

            <FaQuoteLeft className="text-purple-400 text-xl mb-4" />

            <p className="text-gray-800 leading-relaxed mb-6 text-[15px]">
              {item.text}
            </p>

            <div>
              <h4 className="font-semibold text-gray-900 text-sm">
                {item.name}
              </h4>
              <p className="text-gray-500 text-xs">
                {item.role}
              </p>
            </div>

            <FaQuoteRight className="text-purple-400 text-xl absolute bottom-4 right-4 opacity-70" />

          </motion.div>
        ))}

      </div>
    </section>
  );
}