import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import demoBefore1 from "@/assets/demo-before-1.jpg";
import demoAfter1 from "@/assets/demo-after-1.jpg";
import demoBefore2 from "@/assets/demo-before-2.jpg";
import demoAfter2 from "@/assets/demo-after-2.jpg";

const demos = [
  {
    before: demoBefore1,
    after: demoAfter1,
    style: "Scandinavian",
    room: "Living Room"
  },
  {
    before: demoBefore2,
    after: demoAfter2,
    style: "Japandi",
    room: "Bedroom"
  }
];

const DemoSlider = () => {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [showAfter, setShowAfter] = useState(false);

  const nextDemo = () => {
    setCurrentDemo((prev) => (prev + 1) % demos.length);
    setShowAfter(false);
  };

  const prevDemo = () => {
    setCurrentDemo((prev) => (prev - 1 + demos.length) % demos.length);
    setShowAfter(false);
  };

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold text-primary mb-4">
            See the Magic in Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-inter">
            Real transformations from our AI designer. Hover to see the stunning results.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            {/* Image Container */}
            <div 
              className="relative aspect-video rounded-2xl overflow-hidden shadow-card cursor-pointer"
              onMouseEnter={() => setShowAfter(true)}
              onMouseLeave={() => setShowAfter(false)}
            >
              <img 
                src={demos[currentDemo].before}
                alt="Before renovation"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${showAfter ? 'opacity-0' : 'opacity-100'}`}
              />
              <img 
                src={demos[currentDemo].after}
                alt="After renovation"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${showAfter ? 'opacity-100' : 'opacity-0'}`}
              />
              
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-white/20 text-6xl font-poppins font-bold transform rotate-12">
                  InteriorSnap
                </div>
              </div>
              
              {/* Before/After Labels */}
              <div className="absolute top-4 left-4 bg-primary/80 text-primary-foreground px-3 py-1 rounded-full text-sm font-inter font-medium">
                {showAfter ? 'After' : 'Before'}
              </div>
              
              {/* Style Label */}
              <div className="absolute top-4 right-4 bg-accent/90 text-accent-foreground px-3 py-1 rounded-full text-sm font-inter font-medium">
                {demos[currentDemo].style} • {demos[currentDemo].room}
              </div>
            </div>

            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={prevDemo}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={nextDemo}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {demos.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentDemo ? 'bg-accent' : 'bg-muted-foreground/30'
                }`}
                onClick={() => {
                  setCurrentDemo(index);
                  setShowAfter(false);
                }}
              />
            ))}
          </div>

          {/* Instruction */}
          <div className="text-center mt-6">
            <p className="text-muted-foreground font-inter">
              💡 Hover over the image to see the transformation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSlider;