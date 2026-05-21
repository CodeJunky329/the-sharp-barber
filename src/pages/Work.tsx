import { useState, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { cn } from '@/lib/utils';

import gallery1 from '@/assets/gallery-1.jpg';
import gallery2 from '@/assets/gallery-2.jpg';
import gallery3 from '@/assets/gallery-3.jpg';
import gallery4 from '@/assets/gallery-4.jpg';
import gallery5 from '@/assets/gallery-5.jpg';
import gallery6 from '@/assets/gallery-6.jpg';
import gallery7 from '@/assets/gallery-7.jpg';
import gallery8 from '@/assets/gallery-8.jpg';
import gallery9 from '@/assets/gallery-9.jpg';
import gallery10 from '@/assets/gallery-10.jpg';
import gallery11 from '@/assets/gallery-11.jpg';
import gallery12 from '@/assets/gallery-12.jpg';

type Category = 'Haircut' | 'Beard' | 'Shave' | 'Package' | 'Interior';

interface Item {
  title: string;
  category: Category;
  image: string;
  span: 'sm' | 'md' | 'lg' | 'tall' | 'wide';
}

const items: Item[] = [
  { title: 'Classic Fade', category: 'Haircut', image: gallery1, span: 'lg' },
  { title: 'Beard Sculpt', category: 'Beard', image: gallery2, span: 'tall' },
  { title: 'Skin Fade', category: 'Haircut', image: gallery3, span: 'sm' },
  { title: 'Hot Towel Shave', category: 'Shave', image: gallery4, span: 'wide' },
  { title: 'Sharp Pompadour', category: 'Haircut', image: gallery9, span: 'tall' },
  { title: 'Razor Ritual', category: 'Shave', image: gallery10, span: 'wide' },
  { title: 'Textured Crop', category: 'Haircut', image: gallery5, span: 'md' },
  { title: 'Full Grooming', category: 'Package', image: gallery6, span: 'lg' },
  { title: 'Sculpted Beard', category: 'Beard', image: gallery11, span: 'tall' },
  { title: 'The Throne', category: 'Interior', image: gallery12, span: 'wide' },
  { title: 'Line Up', category: 'Haircut', image: gallery7, span: 'sm' },
  { title: 'Beard Trim', category: 'Beard', image: gallery8, span: 'md' },
];

const categories: ('All' | Category)[] = ['All', 'Haircut', 'Beard', 'Shave', 'Package', 'Interior'];

const spanClasses: Record<Item['span'], string> = {
  sm: 'md:col-span-3 md:row-span-3',
  md: 'md:col-span-4 md:row-span-4',
  lg: 'md:col-span-5 md:row-span-5',
  tall: 'md:col-span-3 md:row-span-6',
  wide: 'md:col-span-6 md:row-span-3',
};

const ParallaxImage = ({ src, alt }: { src: string; alt: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], ['-12%', '12%']), {
    stiffness: 80,
    damping: 20,
  });

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale: 1.25 }}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover will-change-transform transition-[filter] duration-700 group-hover:brightness-110"
      />
    </div>
  );
};

const Work = () => {
  const [filter, setFilter] = useState<'All' | Category>('All');
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroProgress, [0, 1], ['0%', '40%']);
  const heroOpacity = useTransform(heroProgress, [0, 1], [1, 0]);
  const titleScale = useTransform(heroProgress, [0, 1], [1, 1.15]);

  const filtered = useMemo(
    () => (filter === 'All' ? items : items.filter((i) => i.category === filter)),
    [filter]
  );

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      <main>
        {/* HERO */}
        <section
          ref={heroRef}
          className="relative h-[90vh] flex items-center justify-center overflow-hidden"
        >
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="absolute inset-0"
          >
            <img
              src={gallery12}
              alt=""
              className="w-full h-full object-cover scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_hsl(var(--background))_85%)]" />
          </motion.div>

          <motion.div
            style={{ scale: titleScale, opacity: heroOpacity }}
            className="relative z-10 text-center px-4"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xs sm:text-sm uppercase tracking-[0.5em] text-primary/80 font-sans"
            >
              The Archive
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="text-[18vw] md:text-[12vw] leading-[0.85] font-serif font-bold mt-4 tracking-tighter"
            >
              <span className="text-gradient-gold italic">Gallery</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-muted-foreground max-w-md mx-auto mt-6 text-sm sm:text-base"
            >
              A curated archive of precision, craft and quiet obsession.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+3rem)] text-[10px] tracking-[0.4em] text-primary/60 uppercase"
            >
              Scroll
            </motion.div>
          </motion.div>
        </section>

        {/* FILTERS */}
        <section className="sticky top-16 z-30 backdrop-blur-xl bg-background/70 border-y border-border/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <div className="flex items-baseline gap-3">
                <span className="text-[10px] uppercase tracking-[0.4em] text-primary/70">
                  Filter
                </span>
                <span className="font-serif text-2xl text-foreground/90">
                  {filtered.length.toString().padStart(2, '0')}
                </span>
                <span className="text-xs text-muted-foreground">/ {items.length.toString().padStart(2, '0')} pieces</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const active = filter === cat;
                  return (
                    <motion.button
                      key={cat}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilter(cat)}
                      className={cn(
                        'relative px-4 py-2 text-xs uppercase tracking-[0.25em] font-sans rounded-full border transition-all duration-300',
                        active
                          ? 'border-primary text-primary-foreground'
                          : 'border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40'
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="active-filter"
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent"
                          transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{cat}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* MASONRY GRID */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-12 auto-rows-[60px] md:auto-rows-[50px] gap-3 sm:gap-5"
          >
            {filtered.map((item, i) => (
              <motion.article
                key={item.title}
                layout
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{
                  duration: 0.7,
                  delay: (i % 6) * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -8 }}
                className={cn(
                  'group relative overflow-hidden rounded-2xl glass cursor-pointer',
                  'col-span-1 row-span-4',
                  spanClasses[item.span]
                )}
              >
                <ParallaxImage src={item.image} alt={item.title} />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                {/* Gold shimmer border on hover */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent group-hover:ring-primary/40 transition-all duration-500" />

                {/* Number tag */}
                <div className="absolute top-4 left-4 flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-sans">
                    №{(i + 1).toString().padStart(2, '0')}
                  </span>
                  <span className="h-px w-8 bg-primary/50" />
                </div>

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <div className="overflow-hidden">
                    <motion.span
                      className="block text-[10px] uppercase tracking-[0.4em] text-primary/90 mb-2 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                    >
                      {item.category}
                    </motion.span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-2xl font-semibold leading-tight">
                    {item.title}
                  </h3>
                  <div className="h-px w-0 group-hover:w-full bg-gradient-to-r from-primary to-transparent mt-3 transition-all duration-700" />
                </div>
              </motion.article>
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-32 text-muted-foreground text-sm">
              No pieces in this collection — yet.
            </div>
          )}
        </section>

        {/* CLOSING STATEMENT */}
        <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 pb-32 text-center">
          <span className="text-[10px] tracking-[0.5em] uppercase text-primary/70">
            — End of Archive —
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl mt-6 max-w-3xl mx-auto leading-tight">
            Your <span className="text-gradient-gold italic">chapter</span> is next.
          </h2>
          <a
            href="/booking"
            className="inline-block mt-10 px-10 py-4 border border-primary text-primary uppercase tracking-[0.3em] text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-500 rounded-full"
          >
            Book the Chair
          </a>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
};

export default Work;
