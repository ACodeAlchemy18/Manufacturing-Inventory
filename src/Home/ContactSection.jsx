import { ArrowRight, Factory, Boxes, BarChart3, ShieldCheck } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="py-28 bg-[#f5f3ee] relative overflow-hidden">
      {/* Background Blur Effects */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#0f172a]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-black/5 rounded-full blur-3xl"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">  
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="px-4 py-2 rounded-full border border-black/10 text-sm font-medium text-[#0f172a] bg-white/60 backdrop-blur-md">
            CONTACT US
          </span>
        </div> 
        {/* Main Container */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left Side */}
          <div className="space-y-6">
            {/* Intro Card */}
            <div className="backdrop-blur-xl bg-white/50 border border-white/60 rounded-[32px] p-8 shadow-lg">
              <h3 className="text-3xl font-bold text-[#0f172a]">
                Ready to Modernize Your Factory?
              </h3>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Our Manufacturing ERP helps companies streamline production,
                inventory, procurement, finance, and quality management from a
                single intelligent platform.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white/60 rounded-2xl p-5 border border-black/5">
                  <Factory size={28} className="text-[#0f172a]" />
                  <h4 className="font-semibold mt-3 text-[#0f172a]">
                    Production
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">
                    Smart planning & scheduling
                  </p>
                </div>
                <div className="bg-white/60 rounded-2xl p-5 border border-black/5">
                  <Boxes size={28} className="text-[#0f172a]" />
                  <h4 className="font-semibold mt-3 text-[#0f172a]">
                    Inventory
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">
                    Real-time stock visibility
                  </p>
                </div>
                <div className="bg-white/60 rounded-2xl p-5 border border-black/5">
                  <BarChart3 size={28} className="text-[#0f172a]" />
                  <h4 className="font-semibold mt-3 text-[#0f172a]">
                    Analytics
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">
                    Actionable business insights
                  </p>
                </div>
                <div className="bg-white/60 rounded-2xl p-5 border border-black/5">
                  <ShieldCheck size={28} className="text-[#0f172a]" />
                  <h4 className="font-semibold mt-3 text-[#0f172a]">
                    Quality
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">
                    End-to-end process control
                  </p>
                </div> 
              </div>
            </div>
          </div>
          {/* Contact Form */}
          <div className="backdrop-blur-xl bg-white/50 border border-white/60 rounded-[32px] p-8 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold text-[#0f172a]">
                Request a Demo
              </h3>
              <div className="w-12 h-12 rounded-2xl bg-[#0f172a] flex items-center justify-center">
                <ArrowRight className="text-white" size={20} />
              </div>
            </div>
            <form className="space-y-5">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full bg-white/70 border border-black/10 rounded-2xl px-5 py-4 outline-none focus:border-[#0f172a]"
              />
              <input
                type="text"
                placeholder="Company Name"
                className="w-full bg-white/70 border border-black/10 rounded-2xl px-5 py-4 outline-none focus:border-[#0f172a]"
              />
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-white/70 border border-black/10 rounded-2xl px-5 py-4 outline-none focus:border-[#0f172a]"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full bg-white/70 border border-black/10 rounded-2xl px-5 py-4 outline-none focus:border-[#0f172a]"
                />
              </div>
              <textarea
                rows="5"
                placeholder="Tell us about your manufacturing requirements..."
                className="w-full bg-white/70 border border-black/10 rounded-2xl px-5 py-4 outline-none resize-none focus:border-[#0f172a]"
              ></textarea>
              <button
                type="submit"
                className="group w-full bg-[#0f172a] hover:bg-black text-white py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                Schedule Free Demo
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition"
                />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}







