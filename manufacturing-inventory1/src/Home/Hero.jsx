export default function Hero() {
  return (
    <section className="bg-[#f5f3ee] min-h-screen flex items-center px-12">
      
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center w-full">

        {/* LEFT SIDE */}
        <div>

          <h1 className="text-5xl font-bold leading-tight mb-6 text-black">
            Stay in stock with live <br />
            manufacturing <br />
            inventory software
          </h1>

          <p className="text-gray-600 text-lg mb-8 max-w-lg">
            Manufacturing inventory management software helps companies track
            stock levels and optimize production with real-time data insights.
          </p>

          <div className="flex space-x-4">
            <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
              Get started free
            </button>

            <button className="border border-black px-6 py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition">
              Get a demo
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white rounded-xl shadow-2xl p-6">
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Inventory</h3>
            <div className="flex space-x-2">
              <div className="w-6 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-6 h-2 bg-lime-400 rounded-full"></div>
              <div className="w-6 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-4 text-sm font-semibold text-gray-500 mb-2">
            <span>Item</span>
            <span>In stock</span>
            <span>Committed</span>
            <span>Expected</span>
          </div>

          <div className="grid grid-cols-4 text-sm py-2 border-b">
            <span>Blade tip [Silver]</span>
            <span>183 pcs</span>
            <span>145 pcs</span>
            <span>200 pcs</span>
          </div>

          <div className="grid grid-cols-4 text-sm py-2">
            <span>Blade tip [Gold]</span>
            <span>110 pcs</span>
            <span>125 pcs</span>
            <span className="text-red-500">-15 pcs</span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="h-2 bg-gray-200 rounded-full"></div>
            <div className="h-2 bg-gray-200 rounded-full"></div>
            <div className="h-2 bg-gray-200 rounded-full"></div>
          </div>

        </div>

      </div>
    </section>
  );
}