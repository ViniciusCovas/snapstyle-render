import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "Austin, TX",
    text: "I couldn't believe how accurate the AI design was! The final renovation looked exactly like the preview. Amazing service from start to finish.",
    rating: 5,
    avatar: "SJ"
  },
  {
    name: "Miguel Rodriguez",
    location: "Mexico City",
    text: "The WhatsApp process was so convenient. Got my design in seconds and the quote was very reasonable. Highly recommended!",
    rating: 5,
    avatar: "MR"
  },
  {
    name: "Emma Chen",
    location: "San Francisco, CA",
    text: "Transformed my tiny apartment into a beautiful space. The turnkey service saved me so much time and stress.",
    rating: 5,
    avatar: "EC"
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold text-primary mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-inter">
            Real stories from homeowners who transformed their spaces with InteriorSnap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl p-6 shadow-card hover:shadow-lg transition-shadow duration-300"
            >
              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-card-foreground/80 font-inter leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-accent font-poppins font-bold text-sm">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <h4 className="font-poppins font-bold text-card-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-muted-foreground text-sm font-inter">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                ))}
              </div>
              <span className="text-muted-foreground font-inter">4.9/5 from 200+ reviews</span>
            </div>
            <div className="text-muted-foreground font-inter">
              • 500+ rooms transformed
            </div>
            <div className="text-muted-foreground font-inter">
              • 98% satisfaction rate
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;