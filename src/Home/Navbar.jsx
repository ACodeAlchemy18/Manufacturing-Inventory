export default function Navbar() {
  return (
    <nav className="w-full bg-[#f5f3ee] px-12 py-6 flex items-center justify-between">
      
      {/* Logo */}
      <h1 className="text-2xl font-bold tracking-wide text-black">
        manufacto
      </h1>

      {/* Center Menu */}
      <div className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
        <a href="#" className="hover:text-black">Features</a>
        <a href="#" className="hover:text-black">Use cases</a>
        <a href="#" className="hover:text-black">Resources</a>
        <a href="#" className="hover:text-black">Pricing</a>
      </div>

      {/* Right Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        <a href="#" className="text-gray-700 hover:text-black">
          Log in
        </a>

        <button className="border border-black px-4 py-2 rounded-lg hover:bg-black hover:text-white transition">
          Get a demo
        </button>

        <button className="bg-lime-400 px-5 py-2 rounded-lg font-semibold hover:bg-lime-500 transition">
          Get started free
        </button>
      </div>
    </nav>
  );
}