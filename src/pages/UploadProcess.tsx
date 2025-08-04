import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, Camera, X, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import RenderForm from "@/components/RenderForm";

// Import demo images for style references
import demoBefore1 from "@/assets/demo-before-1.jpg";
import demoAfter1 from "@/assets/demo-after-1.jpg";
import demoBefore2 from "@/assets/demo-before-2.jpg";
import demoAfter2 from "@/assets/demo-after-2.jpg";

const styles = [
  {
    name: "Scandinavian",
    description: "Clean lines, natural materials, and cozy minimalism",
    color: "from-blue-50 to-gray-50",
    textColor: "text-blue-900",
    beforeImage: demoBefore1,
    afterImage: demoAfter1,
  },
  {
    name: "Japandi",
    description: "Japanese minimalism meets Scandinavian functionality",
    color: "from-green-50 to-teal-50",
    textColor: "text-green-900",
    beforeImage: demoBefore2,
    afterImage: demoAfter2,
  },
  {
    name: "Modern",
    description: "Contemporary design with sleek sophistication",
    color: "from-gray-50 to-slate-50",
    textColor: "text-gray-900",
    beforeImage: demoBefore1,
    afterImage: demoAfter1,
  },
  {
    name: "Bohemian",
    description: "Eclectic mix of colors, patterns, and textures",
    color: "from-orange-50 to-red-50",
    textColor: "text-orange-900",
    beforeImage: demoBefore2,
    afterImage: demoAfter2,
  },
  {
    name: "Industrial",
    description: "Raw materials and urban aesthetic",
    color: "from-amber-50 to-yellow-50",
    textColor: "text-amber-900",
    beforeImage: demoBefore1,
    afterImage: demoAfter1,
  },
  {
    name: "Minimalist",
    description: "Less is more with clean, uncluttered spaces",
    color: "from-indigo-50 to-purple-50",
    textColor: "text-indigo-900",
    beforeImage: demoBefore2,
    afterImage: demoAfter2,
  },
];

const UploadProcess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Photo Upload
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  // Step 2: Style Selection
  const [selectedStyle, setSelectedStyle] = useState("");
  const [hoveredStyle, setHoveredStyle] = useState<string | null>(null);

  // Step 3: User Details & Render
  const [renderFormOpen, setRenderFormOpen] = useState(false);

  const progressPercentage = (currentStep / 3) * 100;

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('room-photos')
        .upload(fileName, selectedFile);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('room-photos')
        .getPublicUrl(data.path);

      setUploadedImageUrl(publicUrl);
      
      toast({
        title: "Photo uploaded successfully!",
        description: "Now choose a style for your room"
      });
      
      setCurrentStep(2);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const handleStyleSelect = (styleName: string) => {
    setSelectedStyle(styleName);
    setCurrentStep(3);
    setRenderFormOpen(true);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      if (currentStep === 3) {
        setRenderFormOpen(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with progress */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={currentStep === 1 ? handleBackToHome : handlePreviousStep}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {currentStep === 1 ? 'Home' : 'Back'}
            </Button>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h1 className="font-semibold text-lg">Transform Your Room</h1>
                <span className="text-sm text-muted-foreground">Step {currentStep} of 3</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>
          
          {/* Step indicators */}
          <div className="flex items-center justify-center mt-4 space-x-8">
            <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep > 1 ? 'bg-primary text-primary-foreground' : currentStep === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {currentStep > 1 ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <span className="font-medium">Upload Photo</span>
            </div>
            
            <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep > 2 ? 'bg-primary text-primary-foreground' : currentStep === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {currentStep > 2 ? <Check className="h-4 w-4" /> : '2'}
              </div>
              <span className="font-medium">Choose Style</span>
            </div>
            
            <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                3
              </div>
              <span className="font-medium">Get Result</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Photo Upload */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Upload Your Room Photo</h2>
              <p className="text-muted-foreground">Choose a clear photo of the room you'd like to redesign</p>
            </div>

            <div className="max-w-2xl mx-auto">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-80 object-cover rounded-lg border"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-4 right-4"
                    onClick={() => {
                      setPreview(null);
                      setSelectedFile(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                  <Upload className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
                  <p className="text-lg font-medium mb-2">Upload your room photo</p>
                  <p className="text-muted-foreground mb-8">
                    Choose a photo of your room to redesign
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-5 w-5" />
                      Upload File
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleCameraCapture}
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Take Photo
                    </Button>
                  </div>
                </div>
              )}

              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />

              {selectedFile && (
                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    size="lg"
                    className="px-8"
                  >
                    {uploading ? "Uploading..." : "Continue to Style Selection"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Style Selection */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Choose Your Style</h2>
              <p className="text-muted-foreground">Select a design style to transform your room</p>
            </div>

            {/* Uploaded image preview */}
            {uploadedImageUrl && (
              <div className="max-w-md mx-auto">
                <p className="text-sm text-muted-foreground text-center mb-2">Your uploaded photo:</p>
                <img
                  src={uploadedImageUrl}
                  alt="Your room"
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {styles.map((style) => (
                <div
                  key={style.name}
                  className={`relative rounded-lg border cursor-pointer transition-all duration-300 overflow-hidden group ${
                    selectedStyle === style.name ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                  }`}
                  onClick={() => handleStyleSelect(style.name)}
                  onMouseEnter={() => setHoveredStyle(style.name)}
                  onMouseLeave={() => setHoveredStyle(null)}
                >
                  {/* Before/After Images */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={style.beforeImage}
                      alt={`${style.name} style before`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                        hoveredStyle === style.name ? 'opacity-0' : 'opacity-100'
                      }`}
                    />
                    <img
                      src={style.afterImage}
                      alt={`${style.name} style after`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                        hoveredStyle === style.name ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Before/After indicator */}
                    <div className="absolute top-3 left-3 bg-white/90 text-gray-900 px-2 py-1 rounded text-xs font-medium">
                      {hoveredStyle === style.name ? 'After' : 'Before'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{style.name}</h3>
                    <p className="text-sm text-muted-foreground">{style.description}</p>
                  </div>

                  {/* Hover instruction */}
                  <div className="absolute bottom-4 right-4 text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    Hover to preview
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: User Details Form */}
        {currentStep === 3 && selectedStyle && uploadedImageUrl && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Almost Ready!</h2>
              <p className="text-muted-foreground">Enter your details to receive your transformed room</p>
            </div>

            {/* Summary */}
            <div className="max-w-2xl mx-auto bg-muted/30 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Your Selection:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Original Photo:</p>
                  <img
                    src={uploadedImageUrl}
                    alt="Your room"
                    className="w-full h-32 object-cover rounded border"
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Selected Style:</p>
                  <div className="bg-background rounded border p-4 h-32 flex items-center justify-center">
                    <div className="text-center">
                      <h4 className="font-semibold text-lg">{selectedStyle}</h4>
                      <p className="text-sm text-muted-foreground">
                        {styles.find(s => s.name === selectedStyle)?.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Render Form Modal */}
      <RenderForm
        open={renderFormOpen}
        onOpenChange={setRenderFormOpen}
        imageUrl={uploadedImageUrl}
        selectedStyle={selectedStyle}
      />
    </div>
  );
};

export default UploadProcess;