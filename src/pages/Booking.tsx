import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import BookingForm from '@/components/BookingForm';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { CalendarCheck, Sparkles } from 'lucide-react';

const Booking = () => {
  const { user, loading } = useAuth();
  const [suggestedTime, setSuggestedTime] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchLastBooking = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('booking_time')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (data) setSuggestedTime(data.booking_time);
    };
    fetchLastBooking();
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 sm:pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <AnimatedSection className="text-center mb-10">
            <span className="text-xs uppercase tracking-[0.3em] text-primary/70 font-sans">Reserve Your Spot</span>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mt-3 mb-4">Book a <span className="text-gradient-gold">Session</span></h1>
            <p className="text-muted-foreground text-sm sm:text-base">Fill in your details below and we'll have everything ready for you.</p>
          </AnimatedSection>

          {suggestedTime && (
            <AnimatedSection delay={0.1} className="mb-6">
              <div className="glass rounded-xl p-4 flex items-center gap-3 border-primary/20">
                <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Based on your last visit, we suggest booking at <span className="text-primary font-semibold">{suggestedTime}</span> again!
                </p>
              </div>
            </AnimatedSection>
          )}

          <AnimatedSection delay={0.15}>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <CalendarCheck className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-lg font-semibold">Booking Details</h2>
              </div>
              <BookingForm suggestedTime={suggestedTime} />
            </div>
          </AnimatedSection>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Booking;
