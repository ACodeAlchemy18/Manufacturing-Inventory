import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import BusinessSection from "./BusinessSection";
import Testimonials from "./Testimonials"; // ✅ NEW
import Pricing from "./Pricing";
import Footer from "./Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <BusinessSection /> 
      <Testimonials /> {/* ✅ ADD HERE */}
      <Pricing />
      <Footer />
    </>
  );
}