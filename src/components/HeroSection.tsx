import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Background layers */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(42_78%_52%/0.06)_0%,transparent_70%)]" />
    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,hsl(0_0%_4%/0.8)_100%)]" />

    {/* Floating decorative elements */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      className="absolute top-20 right-10 sm:right-20 w-32 sm:w-64 h-32 sm:h-64 border border-primary/10 rounded-full"
    />
    <motion.div
      animate={{ rotate: -360 }}
      transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
      className="absolute bottom-20 left-10 sm:left-20 w-24 sm:w-48 h-24 sm:h-48 border border-primary/5 rounded-full"
    />

    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-center gap-2 mb-6"
      >
        <div className="h-px w-8 sm:w-12 bg-primary/50" />
        <span className="text-xs sm:text-sm font-sans uppercase tracking-[0.3em] text-primary/80">Est. 2020 · Premium Grooming</span>
        <div className="h-px w-8 sm:w-12 bg-primary/50" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-bold leading-[0.9] mb-6"
      >
        <span className="text-gradient-gold">LUXE</span>
        <br />
        <span className="text-foreground">BARBER</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto mb-8 font-sans"
      >
        Where precision meets artistry. Experience grooming elevated to an art form.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.45 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Link to="/booking">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm uppercase tracking-wider px-8 group">
            Book Your Session
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
        <Link to="/work">
          <Button variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-primary/10 text-sm uppercase tracking-wider px-8">
            View Our Work
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="mt-12 flex items-center justify-center gap-1"
      >
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">500+ Five Star Reviews</span>
      </motion.div>
    </div>

    {/* Bottom gradient fade */}
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
  </section>
);

export default HeroSection;
