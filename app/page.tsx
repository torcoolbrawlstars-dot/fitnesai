import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Analysis from "@/components/Analysis";
import Workouts from "@/components/Workouts";
import ProgressDashboard from "@/components/ProgressDashboard";
import BeforeAfter from "@/components/BeforeAfter";
import WhyUs from "@/components/WhyUs";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Analysis />
      <Workouts />
      <ProgressDashboard />
      <BeforeAfter />
      <WhyUs />
      <Testimonials />
      <FAQ />
      <Pricing />
      <Footer />
    </main>
  );
}
