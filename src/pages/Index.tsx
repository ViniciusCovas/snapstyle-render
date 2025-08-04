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
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");

  const handlePhotoUploaded = (imageUrl: string) => {
    setUploadedImageUrl(imageUrl);
    // Auto-scroll to style gallery
    document.getElementById('styles')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStyleSelected = (style: string) => {
    if (uploadedImageUrl) {
      setSelectedStyle(style);
    }
  };

  return (
    <div className="min-h-screen">
      <Hero 
        onPhotoUploaded={handlePhotoUploaded}
        uploadedImageUrl={uploadedImageUrl}
        selectedStyle={selectedStyle}
        onStyleSelected={handleStyleSelected}
      />
      <HowItWorks />
      <DemoSlider />
      <StyleGallery onStyleSelect={handleStyleSelected} />
      <WhyRemodel />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
