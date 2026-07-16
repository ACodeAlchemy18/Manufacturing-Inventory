import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#0f172a] text-white px-6 md:px-12 py-16">
      
      <div className="max-w-7xl mx-auto">

        {/* Top Section */}
        <div className="grid md:grid-cols-5 gap-8 mb-12">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2
              onClick={() => navigate("/")}
              className="text-2xl font-bold cursor-pointer mb-4"
            >
              Manufacto
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
            Manufacturing ERP software that helps businesses manage production, inventory,  quality,
and financial operations from a single platform.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-6">
              {[FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram].map(
                (Icon, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    className="bg-white/10 p-2 rounded-full cursor-pointer hover:bg-white hover:text-[#0f172a] transition"
                  >
                    <Icon size={14} />
                  </motion.div>
                )
              )}
            </div>
          </motion.div>

          {/* Links 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="font-semibold mb-4">Product</h3>

<ul className="space-y-3 text-gray-400 text-sm">
  <li className="hover:text-white cursor-pointer">Production Management</li>
  <li className="hover:text-white cursor-pointer">Inventory Management</li>
  <li className="hover:text-white cursor-pointer">Procurement</li>
  <li className="hover:text-white cursor-pointer">Quality Control</li>
  <li className="hover:text-white cursor-pointer">ERP Dashboard</li>
</ul>
          </motion.div>

 {/* Links 2 */}
          <motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
>
  <h3 className="font-semibold mb-4">Support</h3>

  <ul className="space-y-3 text-gray-400 text-sm">
    <li className="hover:text-white cursor-pointer">
      Help Center
    </li>

    <li className="hover:text-white cursor-pointer">
      Documentation
    </li>

    <li className="hover:text-white cursor-pointer">
      Request Demo
    </li>

    <li className="hover:text-white cursor-pointer">
      Contact Sales
    </li>
  </ul>
</motion.div>

          {/* Links 3 */}
          <motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.3 }}
>
  <h3 className="font-semibold mb-4">Company</h3>

  <ul className="space-y-3 text-gray-400 text-sm">
    <li className="hover:text-white cursor-pointer">
      About Us
    </li>

    <li className="hover:text-white cursor-pointer">
      Our Mission
    </li>

    <li className="hover:text-white cursor-pointer">
      Careers
    </li>

    <li className="hover:text-white cursor-pointer">
      Contact Us
    </li>
  </ul>
</motion.div>
          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="font-semibold mb-4">Get Industry Insights</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get latest updates about manufacturing tech.
            </p>

            <div className="flex items-center bg-white/10 rounded-lg overflow-hidden">
              <input
                type="email"
                placeholder="Enter email"
                className="bg-transparent px-4 py-2 w-full outline-none text-sm"
              />
              <button className="bg-lime-400 text-black px-4 py-2 text-sm font-semibold hover:bg-lime-500 transition">
                Subscribe
              </button>
            </div>
          </motion.div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Manufacto. All rights reserved.
          </p>

          <div className="flex space-x-6 text-gray-400 text-sm">
            <span className="hover:text-white cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-white cursor-pointer">
              Terms of Service
            </span>
              <span className="hover:text-white cursor-pointer">
    Cookie Policy
  </span>

          </div>

        </div>

      </div>
    </footer>
  );
}