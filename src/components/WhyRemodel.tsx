import { CheckCircle, Shield, Clock, Palette, Wrench, Heart } from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Custom Furniture Design",
    description: "Every piece designed specifically for your space and style preferences"
  },
  {
    icon: Wrench,
    title: "Turnkey Service",
    description: "From design to installation, we handle everything so you don't have to"
  },
  {
    icon: Shield,
    title: "5-Year Warranty",
    description: "Complete warranty coverage on all furniture and installation work"
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    description: "Most projects completed within 4-6 weeks from design approval"
  },
  {
    icon: CheckCircle,
    title: "Quality Materials",
    description: "Premium, sustainable materials sourced from trusted suppliers"
  },
  {
    icon: Heart,
    title: "Satisfaction Guarantee",
    description: "Not happy? We'll make it right or your money back"
  }
];

const WhyRemodel = () => {
  return (
    <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold mb-4">
            Why Remodel with Us?
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto font-inter">
            Beyond beautiful designs, we deliver complete interior solutions with unmatched quality and service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-primary-foreground/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-primary-foreground/10 transition-colors duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-poppins font-bold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-primary-foreground/70 font-inter leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-accent/10 border border-accent/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-poppins font-bold mb-4">
              Ready to Transform Your Space?
            </h3>
            <p className="text-primary-foreground/80 font-inter mb-6">
              Get your free AI design first, then let's discuss bringing it to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-3 rounded-xl font-inter font-medium transition-all duration-300">
                See My Design
              </button>
              <button className="border border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-3 rounded-xl font-inter font-medium transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyRemodel;