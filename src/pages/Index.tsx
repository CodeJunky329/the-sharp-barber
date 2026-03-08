import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import AnimatedSection from '@/components/AnimatedSection';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Users, Clock, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { icon: Users, value: '10K+', label: 'Happy Clients' },
  { icon: Award, value: '15+', label: 'Years Experience' },
  { icon: Clock, value: '500+', label: '5-Star Reviews' },
];

const testimonials = [
  {
    name: 'Marcus Johnson',
    role: 'Regular Client',
    text: "Best barbershop I've ever been to. The attention to detail is unmatched — every fade is crisp, every lineup is perfect.",
    rating: 5,
  },
  {
    name: 'David Chen',
    role: 'VIP Member',
    text: "LUXE isn't just a barbershop, it's an experience. The hot towel shave alone is worth the trip. I won't go anywhere else.",
    rating: 5,
  },
  {
    name: 'James Wright',
    role: 'Monthly Client',
    text: "From the moment you walk in, you feel like royalty. The team genuinely cares about getting your look exactly right.",
    rating: 5,
  },
];

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <ServicesSection />

    {/* Stats */}
    <section className="py-16 border-y border-border/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.1}>
              <div className="flex flex-col items-center gap-2">
                <stat.icon className="h-6 w-6 text-primary/70" />
                <span className="text-3xl sm:text-4xl font-serif font-bold text-gradient-gold">{stat.value}</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="py-20 sm:py-28 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(42_78%_52%/0.04)_0%,transparent_60%)]" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-primary/70 font-sans">Testimonials</span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold mt-3 mb-4">What Our <span className="text-gradient-gold">Clients</span> Say</h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">Don't just take our word for it.</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <AnimatedSection key={t.name} delay={i * 0.12}>
              <div className="glass rounded-xl p-6 sm:p-8 h-full flex flex-col hover:border-primary/30 transition-all duration-500">
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1 mb-6">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <div>
                  <p className="font-serif font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold mb-4">Ready for a <span className="text-gradient-gold">Fresh Look</span>?</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8 text-sm sm:text-base">Book your session today and experience the LUXE difference.</p>
          <Link to="/booking">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm uppercase tracking-wider px-10 group">
              Book Now <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>

    <Footer />
  </div>
);

export default Index;
