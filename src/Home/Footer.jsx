import {
  FaIndustry,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaGithub,
  FaTwitter
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 pt-20 pb-8 px-12">
      
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">

        {/* Column 1 - About */}
        <div>
          <h3 className="flex items-center gap-2 text-xl font-bold mb-4 text-white">
            <FaIndustry />
            Manufacturing
          </h3>

          <p className="text-gray-400 leading-relaxed">
            Smart manufacturing inventory software to manage raw materials,
            WIP stages, finished goods, and reports with real-time control.
          </p>
        </div>

        {/* Column 2 - Product */}
        <div>
          <h4 className="font-semibold mb-4 text-lg text-white">Product</h4>
          <ul className="space-y-3 text-gray-400">
            <li className="hover:text-white cursor-pointer transition">Features</li>
            <li className="hover:text-white cursor-pointer transition">Use Cases</li>
            <li className="hover:text-white cursor-pointer transition">Pricing</li>
            <li className="hover:text-white cursor-pointer transition">Demo</li>
          </ul>
        </div>

        {/* Column 3 - Modules */}
        <div>
          <h4 className="font-semibold mb-4 text-lg text-white">
            Inventory Modules
          </h4>
          <ul className="space-y-3 text-gray-400">
            <li className="hover:text-white cursor-pointer transition">Raw Materials</li>
            <li className="hover:text-white cursor-pointer transition">WIP Inventory</li>
            <li className="hover:text-white cursor-pointer transition">Finished Goods</li>
            <li className="hover:text-white cursor-pointer transition">Stock Movement</li>
          </ul>
        </div>

        {/* Column 4 - Contact */}
        <div>
          <h4 className="font-semibold mb-4 text-lg text-white">Contact</h4>

          <p className="flex items-center gap-2 text-gray-400 mb-3">
            <FaEnvelope /> support@manufacturing.com
          </p>

          <p className="flex items-center gap-2 text-gray-400 mb-4">
            <FaPhone /> +91 98765 43210
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 text-xl text-gray-400">
            <FaLinkedin className="cursor-pointer hover:text-white transition" />
            <FaGithub className="cursor-pointer hover:text-white transition" />
            <FaTwitter className="cursor-pointer hover:text-white transition" />
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-500 text-sm">
        © 2026 Manufacturing Inventory System | All Rights Reserved
      </div>

    </footer>
  );
}