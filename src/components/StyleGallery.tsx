import { useState } from "react";

const styles = [
  {
    name: "Scandinavian",
    description: "Clean lines, light wood, cozy minimalism",
    color: "from-blue-100 to-blue-50",
    textColor: "text-blue-800"
  },
  {
    name: "Japandi",
    description: "Japanese minimalism meets Scandinavian warmth",
    color: "from-amber-100 to-amber-50",
    textColor: "text-amber-800"
  },
  {
    name: "Industrial",
    description: "Raw materials, exposed brick, urban edge",
    color: "from-gray-100 to-gray-50",
    textColor: "text-gray-800"
  },
  {
    name: "Modern",
    description: "Sleek surfaces, bold colors, geometric forms",
    color: "from-purple-100 to-purple-50",
    textColor: "text-purple-800"
  },
  {
    name: "Bohemian",
    description: "Eclectic patterns, rich textures, vibrant colors",
    color: "from-rose-100 to-rose-50",
    textColor: "text-rose-800"
  },
  {
    name: "Farmhouse",
    description: "Rustic charm, natural materials, vintage touches",
    color: "from-green-100 to-green-50",
    textColor: "text-green-800"
  },
  {
    name: "Mid-Century",
    description: "Retro furniture, warm woods, atomic age style",
    color: "from-orange-100 to-orange-50",
    textColor: "text-orange-800"
  },
  {
    name: "Surprise Me",
    description: "Let our AI choose the perfect style for you",
    color: "from-gradient-primary",
    textColor: "text-primary"
  }
];

const StyleGallery = () => {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold text-primary mb-4">
            Choose Your Style
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-inter">
            From minimalist Scandinavian to bold Industrial - find the perfect aesthetic for your space.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {styles.map((style, index) => (
            <div
              key={index}
              className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 shadow-soft hover:shadow-card hover:-translate-y-1 ${
                selectedStyle === style.name 
                  ? 'ring-2 ring-accent shadow-card scale-105' 
                  : ''
              }`}
              style={{
                background: style.name === "Surprise Me" 
                  ? "var(--gradient-primary)" 
                  : `linear-gradient(135deg, ${style.color.split(' ').slice(1).join(' ')})`
              }}
              onClick={() => setSelectedStyle(selectedStyle === style.name ? null : style.name)}
            >
              <div className="text-center">
                <h3 className={`text-lg font-poppins font-bold mb-2 ${
                  style.name === "Surprise Me" ? "text-primary-foreground" : style.textColor
                }`}>
                  {style.name}
                </h3>
                <p className={`text-sm font-inter ${
                  style.name === "Surprise Me" ? "text-primary-foreground/80" : style.textColor.replace('800', '600')
                }`}>
                  {style.description}
                </p>
              </div>
              
              {/* Selection indicator */}
              {selectedStyle === style.name && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-accent-foreground rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedStyle && (
          <div className="mt-12 text-center">
            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 max-w-md mx-auto">
              <h4 className="font-poppins font-bold text-primary mb-2">
                {selectedStyle} Style Selected
              </h4>
              <p className="text-muted-foreground font-inter text-sm">
                Ready to see your room transformed? Upload your photo to get started!
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default StyleGallery;