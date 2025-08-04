import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Camera } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";
import UploadModal from "./UploadModal";
import RenderForm from "./RenderForm";

interface HeroProps {
  onPhotoUploaded: (imageUrl: string) => void;
  uploadedImageUrl: string;
  selectedStyle: string;
  onStyleSelected: (style: string) => void;
}

const Hero = ({ onPhotoUploaded, uploadedImageUrl, selectedStyle, onStyleSelected }: HeroProps) => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [renderFormOpen, setRenderFormOpen] = useState(false);

  const handleUpload = () => {
    setUploadModalOpen(true);
  };

  const handleStyleSelected = (style: string) => {
    if (uploadedImageUrl) {
      onStyleSelected(style);
      setRenderFormOpen(true);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-primary/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-poppins font-bold mb-6 leading-tight">
          See your room redesigned in{" "}
          <span className="text-accent">10 seconds</span>
        </h1>
        
        <p className="text-lg sm:text-xl lg:text-2xl mb-8 text-white/90 max-w-2xl mx-auto font-inter">
          Transform any space with AI-powered interior design. Upload a photo and get a stunning makeover instantly.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={handleUpload}
            className="btn-primary text-lg px-8 py-6 h-auto font-inter font-medium"
            size="lg"
          >
            <Upload className="mr-2 h-5 w-5" />
            Upload Your Photo
          </Button>
          
          <Button 
            onClick={handleUpload}
            variant="outline"
            className="text-lg px-8 py-6 h-auto font-inter font-medium border-white/30 text-white hover:bg-white/10 hover:text-white"
            size="lg"
          >
            <Camera className="mr-2 h-5 w-5" />
            Take Photo Now
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-white/70 font-inter">
          No signup required • Free instant preview • Full design via email
        </div>
      </div>

      <UploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onPhotoUploaded={onPhotoUploaded}
      />

      <RenderForm
        open={renderFormOpen}
        onOpenChange={setRenderFormOpen}
        imageUrl={uploadedImageUrl}
        selectedStyle={selectedStyle}
      />
    </section>
  );
};

export default Hero;