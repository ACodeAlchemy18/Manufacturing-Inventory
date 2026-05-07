import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import BusinessSection from "./BusinessSection";
import Pricing from "./Pricing";
import Testimonials from "./Testimonials";
import Footer from "./Footer";

export default function Home() {
  return (
    <div className="bg-[#f5f3ee] scroll-smooth">

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section id="hero">
        <Hero />
      </section>

      {/* Features */}
      <section id="features" className="pt-10">
        <Features />
      </section>

      {/* Business / Use Case Section */}
      <section id="usecases" className="pt-10">
        <BusinessSection />
      </section>

      {/* Pricing */}
      <section id="pricing" className="pt-10">
        <Pricing />
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="pt-10">
        <Testimonials />
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
}