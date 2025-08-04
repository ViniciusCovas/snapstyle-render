import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is my photo data secure and private?",
    answer: "Yes, absolutely. We use enterprise-grade encryption and never share your photos with third parties. Your data is only used to create your design and is deleted after 30 days unless you opt for our renovation service."
  },
  {
    question: "How much does a full remodel cost?",
    answer: "Costs vary based on room size and style complexity. Most living rooms range from $8,000-$15,000 including custom furniture and installation. You'll get a detailed quote after seeing your AI design."
  },
  {
    question: "How long does the renovation process take?",
    answer: "After design approval, most projects are completed in 4-6 weeks. This includes custom furniture creation, delivery, and professional installation."
  },
  {
    question: "Can I make changes to the AI-generated design?",
    answer: "Absolutely! The AI design is just the starting point. Our design team works with you to refine every detail before we begin the renovation."
  },
  {
    question: "Do you work in my area?",
    answer: "We currently serve major metropolitan areas in the US and Mexico. Enter your location during the quote process to confirm service availability."
  },
  {
    question: "What if I don't like the final result?",
    answer: "We offer a complete satisfaction guarantee. If you're not happy with the final result, we'll make adjustments at no cost or provide a full refund."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-inter">
            Everything you need to know about our AI design service and renovation process.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl shadow-soft overflow-hidden hover:shadow-card transition-shadow duration-300"
            >
              <button
                className="w-full px-6 py-6 text-left flex justify-between items-center hover:bg-muted/30 transition-colors duration-200"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-poppins font-bold text-card-foreground pr-4">
                  {faq.question}
                </h3>
                <ChevronDown 
                  className={`h-5 w-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-card-foreground/80 font-inter leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6">
            <h3 className="font-poppins font-bold text-primary mb-2">
              Still have questions?
            </h3>
            <p className="text-muted-foreground font-inter mb-4">
              Our team is here to help! Get in touch and we'll respond within 24 hours.
            </p>
            <button className="btn-primary bg-accent text-accent-foreground hover:bg-accent/90 px-6 py-2 rounded-xl font-inter font-medium transition-all duration-300">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;