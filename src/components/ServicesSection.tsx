import AnimatedSection from '@/components/AnimatedSection';
import { Scissors, Sparkles, Crown, Droplets } from 'lucide-react';

const services = [
  { icon: Scissors, title: 'Classic Cut', price: 'R45', desc: 'Precision haircut tailored to your style with hot towel finish.' },
  { icon: Crown, title: 'Royal Shave', price: 'R35', desc: 'Traditional straight razor shave with premium oils and balms.' },
  { icon: Sparkles, title: 'Beard Sculpting', price: 'R30', desc: 'Expert beard shaping, trimming and conditioning treatment.' },
  { icon: Droplets, title: 'LUXE Package', price: 'R95', desc: 'Full haircut, shave, facial massage and scalp treatment.' },
];

const ServicesSection = () => (
  <section className="py-20 sm:py-28 relative">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(42_78%_52%/0.04)_0%,transparent_60%)]" />
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <AnimatedSection className="text-center mb-12 sm:mb-16">
        <span className="text-xs uppercase tracking-[0.3em] text-primary/70 font-sans">What We Offer</span>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold mt-3 mb-4">Our <span className="text-gradient-gold">Services</span></h2>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">Crafted with care, delivered with excellence.</p>
      </AnimatedSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {services.map((service, i) => (
          <AnimatedSection key={service.title} delay={i * 0.1}>
            <div className="group glass rounded-xl p-6 sm:p-8 hover:border-primary/30 transition-all duration-500 bg-gold-shimmer h-full">
              <service.icon className="h-8 w-8 text-primary mb-4 transition-transform group-hover:scale-110 duration-500" />
              <h3 className="font-serif text-lg font-semibold mb-1">{service.title}</h3>
              <p className="text-primary font-sans font-semibold text-lg mb-3">{service.price}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
