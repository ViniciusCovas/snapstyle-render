import { useState } from "react";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import DemoSlider from "@/components/DemoSlider";
import StyleGallery from "@/components/StyleGallery";
import WhyRemodel from "@/components/WhyRemodel";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  const [heroRef, setHeroRef] = useState<{ handleStyleSelected: (style: string) => void } | null>(null);

  const handleHeroRef = (ref: { handleStyleSelected: (style: string) => void } | null) => {
    if (ref !== heroRef) {
      setHeroRef(ref);
    }
  };

  return (
    <div className="min-h-screen">
      <Hero ref={handleHeroRef} />
      <HowItWorks />
      <DemoSlider />
      <StyleGallery onStyleSelect={heroRef?.handleStyleSelected} />
      <WhyRemodel />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
