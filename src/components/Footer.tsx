import { MessageCircle, Mail, Phone, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-poppins font-bold mb-4">
              InteriorSnap
            </h3>
            <p className="text-primary-foreground/70 font-inter mb-6">
              Transform any room in 10 seconds with AI-powered interior design.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-poppins font-bold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors font-inter">AI Design</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors font-inter">Full Renovation</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors font-inter">Custom Furniture</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors font-inter">Installation</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-poppins font-bold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors font-inter">Help Center</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors font-inter">Privacy Policy</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors font-inter">Terms of Service</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors font-inter">Warranty</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-poppins font-bold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-accent" />
                <span className="text-primary-foreground/70 font-inter">WhatsApp Support</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent" />
                <span className="text-primary-foreground/70 font-inter">hello@interiorsnap.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-accent" />
                <span className="text-primary-foreground/70 font-inter">1-800-INTERIOR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-primary-foreground/70 font-inter text-sm">
            © 2024 InteriorSnap. All rights reserved.
          </p>
          <p className="text-primary-foreground/50 font-inter text-xs mt-2 sm:mt-0">
            Powered by{" "}
            <a 
              href="https://lovable.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              lovable.dev
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;