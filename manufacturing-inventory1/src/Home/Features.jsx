import { Link } from "react-router-dom";
import {
  FaBoxesStacked,
  FaGears,
  FaWarehouse,
  FaTruckFast,
  FaChartLine,
  FaBolt
} from "react-icons/fa6";

export default function Features() {
  return (
    <section className="bg-white py-24 px-6 md:px-12">
      
      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h2 className="text-4xl font-bold mb-4">
          Manufacturing Inventory Features
        </h2>
        <p className="text-gray-500 text-lg">
          Enhance your manufacturing experience with features that keep your
          operations running smoothly.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 auto-rows-fr">

        <FeatureCard
          icon={<FaBoxesStacked />}
          title="Live inventory management"
          description="Get total inventory control from raw materials, work-in-progress, and finished goods."
          link="/inventory/raw-materials"
        />

        <FeatureCard
          icon={<FaGears />}
          title="End-to-end traceability"
          description="Track your products from materials to sold goods for effective quality assurance."
          link="/inventory/wip/pre-assembling"
        />

        <FeatureCard
          icon={<FaWarehouse />}
          title="Accurate costing"
          description="Track manufacturing costs and make better pricing decisions based on data."
          link="/inventory/finished-goods"
        />

        <FeatureCard
          icon={<FaTruckFast />}
          title="Production planning"
          description="Reprioritize tasks and reallocate materials for efficient sales order fulfillment."
          link="/inventory/stock-movement"
        />

        <FeatureCard
          icon={<FaChartLine />}
          title="Inventory planning"
          description="Generate forecasts based on accurate consumption data and plan ahead."
          link="/inventory/reports"
        />

        <FeatureCard
          icon={<FaBolt />}
          title="Custom workflows via API"
          description="Set up integrations and create workflows to streamline your business operations."
          link="/inventory/dashboard"
        />

      </div>
    </section>
  );
}


/* 🔥 Equal Height Card */
function FeatureCard({ icon, title, description, link }) {
  return (
    <div className="bg-[#f4f2ee] p-10 rounded-[30px] 
                    flex flex-col h-full 
                    transition duration-300 hover:shadow-xl">

      {/* Icon */}
      <div className="text-3xl text-purple-500 mb-8">
        {icon}
      </div>

      {/* Content grows */}
      <div className="flex-grow">
        <h3 className="text-2xl font-semibold text-purple-600 mb-4">
          {title}
        </h3>

        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Read More always at bottom */}
      <Link
        to={link}
        className="text-purple-600 font-medium hover:underline mt-8 inline-block"
      >
        Read more →
      </Link>

    </div>
  );
}