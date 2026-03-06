export default function Pricing() {
  return (
    <section className="bg-[#f5f3ee] py-24 px-12">
      
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Simple Pricing for Every Manufacturer
          </h2>
          <p className="text-gray-600 text-lg">
            Choose the best plan to manage your manufacturing inventory
            from raw materials to finished goods.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-10">

          {/* Starter Plan */}
          <div className="bg-white p-10 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-200">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">
              Starter
            </h3>

            <p className="text-4xl font-bold mb-8 text-gray-900">
              ₹999
              <span className="text-lg font-medium text-gray-500"> /month</span>
            </p>

            <ul className="space-y-4 text-gray-600 mb-10">
              <li>✔ Raw Material Tracking</li>
              <li>✔ Basic Stock Updates</li>
              <li>✔ Limited Reports</li>
              <li>✔ Email Support</li>
            </ul>

            <button className="w-full border border-black text-black py-3 rounded-full hover:bg-black hover:text-white transition">
              Get Started
            </button>
          </div>

          {/* Professional Plan (Most Popular) */}
<div className="relative bg-[#0f172a] text-white p-10 rounded-2xl shadow-xl scale-105">

  {/* Badge */}
  <span className="absolute top-6 right-6 bg-white text-[#0f172a] text-sm px-4 py-1 rounded-full font-medium">
    Most Popular
  </span>

  <h3 className="text-2xl font-semibold mb-6">
    Professional
  </h3>

  <p className="text-4xl font-bold mb-8">
    ₹2499
    <span className="text-lg font-medium text-gray-300"> /month</span>
  </p>

  <ul className="space-y-4 text-gray-300 mb-10">
    <li>✔ Everything in Starter</li>
    <li>✔ Full WIP Inventory Control</li>
    <li>✔ Stock Movement Tracking</li>
    <li>✔ Advanced Reports & Analytics</li>
    <li>✔ Priority Support</li>
  </ul>

  <button className="w-full bg-white text-[#0f172a] py-3 rounded-full hover:bg-gray-200 transition">
    Get Demo
  </button>
</div>
          {/* Enterprise Plan */}
          <div className="bg-white p-10 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-200">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">
              Enterprise
            </h3>

            <p className="text-4xl font-bold mb-8 text-gray-900">
              ₹4999
              <span className="text-lg font-medium text-gray-500"> /month</span>
            </p>

            <ul className="space-y-4 text-gray-600 mb-10">
              <li>✔ Multi-Factory Support</li>
              <li>✔ Real-Time Live Inventory</li>
              <li>✔ Custom Integrations</li>
              <li>✔ Dedicated Manager</li>
              <li>✔ 24/7 Support</li>
            </ul>

            <button className="w-full border border-black text-black py-3 rounded-full hover:bg-black hover:text-white transition">
              Contact Sales
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}