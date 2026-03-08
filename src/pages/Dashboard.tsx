import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ViewBookingDialog, EditBookingDialog, CancelBookingDialog } from '@/components/BookingManageDialogs';
import { CalendarPlus, Clock, CalendarCheck, Loader2, User, Eye, Pencil, XCircle } from 'lucide-react';
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

  const fetchBookings = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('booking_date', { ascending: false });
    setBookings(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchBookings();

    if (!user) return;

    const channel = supabase
      .channel('user-bookings-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookings(prev => [payload.new as Booking, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setBookings(prev =>
              prev.map(b => b.id === payload.new.id ? payload.new as Booking : b)
            );
          } else if (payload.eventType === 'DELETE') {
            setBookings(prev => prev.filter(b => b.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const upcomingBookings = bookings.filter((b) => b.status !== 'cancelled' && new Date(`${b.booking_date}T${b.booking_time}`) >= new Date());
  const pastBookings = bookings.filter((b) => b.status === 'cancelled' || new Date(`${b.booking_date}T${b.booking_time}`) < new Date());

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
                  <BookingCard key={b.id} booking={b} onRefresh={fetchBookings} />
                ))}
              </div>
            )}
          </AnimatedSection>

          {/* Past */}
          <AnimatedSection delay={0.2}>
            <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" /> Past & Cancelled
            </h2>
            {pastBookings.length === 0 ? (
              <div className="glass rounded-xl p-8 text-center text-muted-foreground text-sm">No past bookings yet.</div>
            ) : (
              <div className="space-y-3">
                {pastBookings.map((b) => (
                  <BookingCard key={b.id} booking={b} isPast onRefresh={fetchBookings} />
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

const BookingCard = ({ booking, isPast, onRefresh }: { booking: Booking; isPast?: boolean; onRefresh: () => void }) => {
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const isCancelled = booking.status === 'cancelled';
  const isUpcoming = !isPast && !isCancelled;

  return (
    <>
      <div className={`glass rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${isPast ? 'opacity-60' : ''}`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-serif font-semibold">{serviceLabels[booking.service] || booking.service}</span>
            <Badge
              variant="outline"
              className={cn(
                'text-xs',
                booking.status === 'cancelled' && 'border-destructive/30 text-destructive',
                booking.status === 'pending' && 'border-amber-500/30 text-amber-500',
                booking.status === 'confirmed' && 'border-emerald-500/30 text-emerald-500',
                booking.status === 'completed' && 'border-primary/30 text-primary'
              )}
            >
              {booking.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {format(new Date(booking.booking_date), 'EEEE, MMM d, yyyy')} at {booking.booking_time}
          </p>
          {booking.notes && <p className="text-xs text-muted-foreground italic">"{booking.notes}"</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setViewOpen(true)} title="View details">
            <Eye className="h-4 w-4" />
          </Button>
          {isUpcoming && (
            <>
              <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)} title="Edit booking">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setCancelOpen(true)} title="Cancel booking" className="text-destructive hover:text-destructive">
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      <ViewBookingDialog booking={booking} open={viewOpen} onOpenChange={setViewOpen} />
      {isUpcoming && (
        <>
          <EditBookingDialog booking={booking} open={editOpen} onOpenChange={setEditOpen} onSaved={onRefresh} />
          <CancelBookingDialog booking={booking} open={cancelOpen} onOpenChange={setCancelOpen} onCancelled={onRefresh} />
        </>
      )}
    </>
  );
};

// Need cn import for conditional classes
import { cn } from '@/lib/utils';

export default Dashboard;
