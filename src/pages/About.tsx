import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { Scissors, Award, Heart, Target, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import aboutInterior from '@/assets/about-interior.jpg';
import barber1 from '@/assets/barber-1.jpg';
import barber2 from '@/assets/barber-2.jpg';
import barber3 from '@/assets/barber-3.jpg';
import barber4 from '@/assets/barber-4.jpg';

const values = [
  { icon: Scissors, title: 'Craftsmanship', desc: 'Every cut is a work of art, executed with surgical precision and creative flair.' },
  { icon: Award, title: 'Excellence', desc: 'We hold ourselves to the highest standard — no shortcuts, no compromises.' },
  { icon: Heart, title: 'Hospitality', desc: 'From the moment you walk in, you\'re treated like royalty.' },
  { icon: Target, title: 'Consistency', desc: 'Your perfect cut, every single time. We remember exactly how you like it.' },
];

const team = [
  {
    name: 'Marcus Reed',
    role: 'Founder & Master Barber',
    bio: '15+ years of experience. Specializes in classic cuts and precision fades. Marcus founded LUXE with a vision to redefine men\'s grooming.',
    image: barber1,
  },
  {
    name: 'Carlos Rivera',
    role: 'Senior Stylist',
    bio: 'Known for his creative textures and modern styles. Carlos brings an artistic eye to every client who sits in his chair.',
    image: barber2,
  },
  {
    name: 'Tom Hadley',
    role: 'Shave Specialist',
    bio: 'A master of the straight razor. Tom\'s hot towel shaves are legendary — the smoothest finish in the city.',
    image: barber3,
  },
  {
    name: 'Amir Hassan',
    role: 'Junior Barber',
    bio: 'The newest addition to the LUXE family. Amir\'s fresh perspective and sharp skills make him a rising star.',
    image: barber4,
  },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="pt-24 sm:pt-32">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <AnimatedSection className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-primary/70 font-sans">Our Story</span>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold mt-3 mb-6">About <span className="text-gradient-gold">LUXE</span></h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Founded in 2020, LUXE was born from a simple belief: every man deserves to look and feel extraordinary. 
            We blend timeless barbering traditions with modern techniques to create an experience that's truly unmatched.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <AnimatedSection>
            <div className="glass rounded-2xl p-8 sm:p-12 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold">The <span className="text-gradient-gold">LUXE</span> Philosophy</h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                We don't just cut hair — we sculpt confidence. Our master barbers bring decades of combined experience, 
                each trained in classical and contemporary techniques. The result? A grooming experience that's part 
                art gallery, part gentleman's club.
              </p>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Every detail matters: the hand-selected premium products, the curated atmosphere, the personalized 
                consultation. At LUXE, you're not just a client — you're a patron of the craft.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="glass rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src={aboutInterior}
                alt="LUXE barbershop interior"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </AnimatedSection>
        </div>

        {/* Team Section */}
        <AnimatedSection className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-primary/70 font-sans">The Team</span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold mt-3">Meet Our <span className="text-gradient-gold">Barbers</span></h2>
          <p className="text-muted-foreground max-w-lg mx-auto mt-3 text-sm sm:text-base">The artists behind every perfect cut.</p>
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-20">
          {team.map((member, i) => (
            <AnimatedSection key={member.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="group glass rounded-xl overflow-hidden h-full"
              >
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-xs uppercase tracking-wider text-primary mb-1">{member.role}</p>
                    <h3 className="font-serif text-lg font-bold text-foreground">{member.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* Values */}
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold">Our <span className="text-gradient-gold">Values</span></h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {values.map((v, i) => (
            <AnimatedSection key={v.title} delay={i * 0.1}>
              <div className="glass rounded-xl p-6 text-center hover:border-primary/30 transition-all duration-500 h-full">
                <v.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-serif text-lg font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default About;
