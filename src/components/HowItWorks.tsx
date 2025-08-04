import { Upload, Palette, Zap } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload",
    description: "Drag-and-drop or take a phone picture of your room"
  },
  {
    icon: Palette,
    title: "Pick a Style",
    description: "Choose from Scandinavian, Japandi, Industrial, and more"
  },
  {
    icon: Zap,
    title: "Instant Preview",
    description: "Get your redesigned room in under 10 seconds"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold text-primary mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-inter">
            Transform your space in three simple steps. No design experience needed.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-accent/30 to-accent/10 z-0"></div>
              )}
              
              <div className="relative z-10 mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center shadow-card">
                  <step.icon className="h-10 w-10 text-accent-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-coral rounded-full flex items-center justify-center text-coral-foreground font-poppins font-bold text-sm">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-xl font-poppins font-bold text-primary mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground font-inter leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;