import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { motion } from 'framer-motion';
import { Scissors } from 'lucide-react';

const galleryItems = [
  { title: 'Classic Fade', category: 'Haircut' },
  { title: 'Beard Sculpt', category: 'Beard' },
  { title: 'Skin Fade', category: 'Haircut' },
  { title: 'Hot Towel Shave', category: 'Shave' },
  { title: 'Textured Crop', category: 'Haircut' },
  { title: 'Full Grooming', category: 'Package' },
  { title: 'Line Up', category: 'Haircut' },
  { title: 'Beard Trim', category: 'Beard' },
];

const Work = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="pt-24 sm:pt-32">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <AnimatedSection className="text-center mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-primary/70 font-sans">Portfolio</span>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold mt-3 mb-4">Our <span className="text-gradient-gold">Work</span></h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">A showcase of precision, creativity and craftsmanship.</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {galleryItems.map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="group glass rounded-xl overflow-hidden"
              >
                <div className="aspect-[3/4] bg-secondary/20 flex items-center justify-center relative">
                  <Scissors className="h-12 w-12 text-primary/15 group-hover:text-primary/30 transition-colors duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-xs uppercase tracking-wider text-primary">{item.category}</span>
                    <h3 className="font-serif text-lg font-semibold">{item.title}</h3>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Work;
