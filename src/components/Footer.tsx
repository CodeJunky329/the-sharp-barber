import { Scissors, Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="border-t border-border/50 bg-card/40 backdrop-blur-sm">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Scissors className="h-5 w-5 text-primary" />
            <span className="text-xl font-serif font-bold text-gradient-gold">LUXE</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Premium grooming for the modern gentleman. Every cut is a masterpiece.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-primary">Navigate</h4>
          <div className="flex flex-col gap-2">
            {['/', '/about', '/work', '/booking'].map((path, i) => (
              <Link key={path} to={path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {['Home', 'About', 'Gallery', 'Book Now'][i]}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-primary">Contact</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary/70" /> +1 (555) 123-4567</span>
            <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary/70" /> info@luxebarber.com</span>
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary/70" /> 123 Style Ave, NYC</span>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-primary">Hours</h4>
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <span>Mon – Fri: 9AM – 8PM</span>
            <span>Saturday: 10AM – 6PM</span>
            <span>Sunday: Closed</span>
          </div>
          <div className="flex gap-3 pt-2">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></a>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-border/30 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} LUXE Barbershop. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
