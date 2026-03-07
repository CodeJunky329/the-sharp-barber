import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import AnimatedSection from '@/components/AnimatedSection';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { icon: Users, value: '10K+', label: 'Happy Clients' },
  { icon: Award, value: '15+', label: 'Years Experience' },
  { icon: Clock, value: '500+', label: '5-Star Reviews' },
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
