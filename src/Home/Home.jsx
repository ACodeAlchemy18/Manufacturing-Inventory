import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import Benefits from "./Benefits";
import ERPModules from "./ERPModules";
import IndustrySolutions from "./IndustrySolutions";
import DashboardPreview from "./DashboardPreview";
import Pricing from "./Pricing";
import ContactSection from "./ContactSection";
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

      {/* Benefits */}
<section id="benefits" className="pt-10">
  <Benefits />
</section>

{/* ERP Modules */}
      <section id="modules" className="pt-10">
        <ERPModules />
      </section>


      {/* IndustrySolutions */}
      <section id="usecases" className="pt-10">
        <IndustrySolutions />
      </section>

       {/* DashboardPreview */}
      <section id="dashboard-preview" className="pt-10">
  <DashboardPreview />
</section>

      {/* Pricing */}
      <section id="pricing" className="pt-10">
        <Pricing />
      </section>

       {/* Contact Section */}
      <section id="contact">
        <ContactSection />
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