import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import DemoSlider from "@/components/DemoSlider";
import StyleGallery from "@/components/StyleGallery";
import WhyRemodel from "@/components/WhyRemodel";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <HowItWorks />
      <DemoSlider />
      <StyleGallery />
      <WhyRemodel />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
