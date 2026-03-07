import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarPlus, Clock, CalendarCheck, Loader2, User } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  id: string;
  full_name: string;
  phone: string;
  booking_date: string;
  booking_time: string;
  service: string;
  notes: string | null;
  status: string;
  created_at: string;
}

const serviceLabels: Record<string, string> = {
  classic_cut: 'Classic Cut',
  royal_shave: 'Royal Shave',
  beard_sculpt: 'Beard Sculpting',
  luxe_package: 'LUXE Package',
};

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false });
      setBookings(data || []);
      setLoading(false);
    };
    fetchBookings();
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const upcomingBookings = bookings.filter((b) => new Date(`${b.booking_date}T${b.booking_time}`) >= new Date());
  const pastBookings = bookings.filter((b) => new Date(`${b.booking_date}T${b.booking_time}`) < new Date());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 sm:pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold">
                  Welcome, <span className="text-gradient-gold">{user?.user_metadata?.full_name?.split(' ')[0] || 'King'}</span>
                </h1>
                <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
                  <User className="h-4 w-4" /> {user?.email}
                </p>
              </div>
              <Link to="/booking">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm uppercase tracking-wider gap-2">
                  <CalendarPlus className="h-4 w-4" /> New Booking
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          {/* Upcoming */}
          <AnimatedSection delay={0.1} className="mb-10">
            <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" /> Upcoming Appointments
            </h2>
            {loading ? (
              <div className="glass rounded-xl p-8 text-center"><Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" /></div>
            ) : upcomingBookings.length === 0 ? (
              <div className="glass rounded-xl p-8 text-center text-muted-foreground text-sm">
                No upcoming bookings. <Link to="/booking" className="text-primary hover:underline">Book a session!</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map((b) => (
                  <BookingCard key={b.id} booking={b} />
                ))}
              </div>
            )}
          </AnimatedSection>

          {/* Past */}
          <AnimatedSection delay={0.2}>
            <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" /> Past Appointments
            </h2>
            {pastBookings.length === 0 ? (
              <div className="glass rounded-xl p-8 text-center text-muted-foreground text-sm">No past bookings yet.</div>
            ) : (
              <div className="space-y-3">
                {pastBookings.map((b) => (
                  <BookingCard key={b.id} booking={b} isPast />
                ))}
              </div>
            )}
          </AnimatedSection>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const BookingCard = ({ booking, isPast }: { booking: Booking; isPast?: boolean }) => (
  <div className={`glass rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${isPast ? 'opacity-60' : ''}`}>
    <div className="space-y-1">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-serif font-semibold">{serviceLabels[booking.service] || booking.service}</span>
        <Badge variant="outline" className="border-primary/30 text-primary text-xs">{booking.status}</Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        {format(new Date(booking.booking_date), 'EEEE, MMM d, yyyy')} at {booking.booking_time}
      </p>
      {booking.notes && <p className="text-xs text-muted-foreground italic">"{booking.notes}"</p>}
    </div>
  </div>
);

export default Dashboard;
