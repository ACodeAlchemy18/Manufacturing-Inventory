import { useState, useEffect } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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

  const [index, setIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="bg-[#f8f7f4] py-24 px-6 md:px-12">

      <div className="max-w-6xl mx-auto text-center">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            What Manufacturers Say
          </h2>
          <p className="text-gray-500 text-lg">
            Trusted by production teams to improve efficiency and control operations.
          </p>
        </motion.div>

        {/* Slider */}
        <div className="relative max-w-3xl mx-auto">

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.5 }}
              className="bg-[#e9e6df] p-10 rounded-2xl shadow-lg"
            >

              <FaQuoteLeft className="text-purple-400 text-2xl mb-6 mx-auto" />

              <p className="text-gray-800 text-lg leading-relaxed mb-8">
                {testimonials[index].text}
              </p>

              <div>
                <h4 className="font-semibold text-gray-900">
                  {testimonials[index].name}
                </h4>
                <p className="text-gray-500 text-sm">
                  {testimonials[index].role}
                </p>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex justify-center items-center gap-6 mt-8">

            <button
              onClick={prevSlide}
              className="px-4 py-2 border border-black rounded-full hover:bg-black hover:text-white transition"
            >
              ←
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <span
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`w-3 h-3 rounded-full cursor-pointer transition ${
                    i === index ? "bg-black" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="px-4 py-2 border border-black rounded-full hover:bg-black hover:text-white transition"
            >
              →
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}