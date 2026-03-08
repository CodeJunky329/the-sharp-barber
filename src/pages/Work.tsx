import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { motion } from 'framer-motion';

import gallery1 from '@/assets/gallery-1.jpg';
import gallery2 from '@/assets/gallery-2.jpg';
import gallery3 from '@/assets/gallery-3.jpg';
import gallery4 from '@/assets/gallery-4.jpg';
import gallery5 from '@/assets/gallery-5.jpg';
import gallery6 from '@/assets/gallery-6.jpg';
import gallery7 from '@/assets/gallery-7.jpg';
import gallery8 from '@/assets/gallery-8.jpg';

const galleryItems = [
  { title: 'Classic Fade', category: 'Haircut', image: gallery1 },
  { title: 'Beard Sculpt', category: 'Beard', image: gallery2 },
  { title: 'Skin Fade', category: 'Haircut', image: gallery3 },
  { title: 'Hot Towel Shave', category: 'Shave', image: gallery4 },
  { title: 'Textured Crop', category: 'Haircut', image: gallery5 },
  { title: 'Full Grooming', category: 'Package', image: gallery6 },
  { title: 'Line Up', category: 'Haircut', image: gallery7 },
  { title: 'Beard Trim', category: 'Beard', image: gallery8 },
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

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {galleryItems.map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="group glass rounded-xl overflow-hidden"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
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
