import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AnimatedSection from '@/components/AnimatedSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  Calendar, 
  Clock, 
  Users, 
  Scissors, 
  TrendingUp, 
  Search,
  RefreshCw,
  Phone,
  FileText,
  ChevronLeft,
  ChevronRight,
  Zap,
  Eye
} from 'lucide-react';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationBell from '@/components/NotificationBell';

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
  user_id: string;
}

interface Stats {
  totalBookings: number;
  todayBookings: number;
  upcomingBookings: number;
  completedBookings: number;
}

const Admin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    todayBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setCheckingAdmin(false);
        return;
      }
      
      const { data, error } = await supabase.rpc('is_admin', { _user_id: user.id });
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(data === true);
      }
      setCheckingAdmin(false);
    };

    if (!loading) {
      checkAdminStatus();
    }
  }, [user, loading]);
  const itemsPerPage = 10;

  // Fetch all bookings
  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('booking_date', { ascending: true })
      .order('booking_time', { ascending: true });

    if (error) {
      console.error('Error fetching bookings:', error);
      return;
    }

    if (data) {
      setBookings(data);
      calculateStats(data);
      setLastUpdate(new Date());
    }
  };

  // Calculate statistics
  const calculateStats = (data: Booking[]) => {
    const today = new Date().toISOString().split('T')[0];
    
    setStats({
      totalBookings: data.length,
      todayBookings: data.filter(b => b.booking_date === today).length,
      upcomingBookings: data.filter(b => b.booking_date >= today && (b.status === 'confirmed' || b.status === 'pending')).length,
      completedBookings: data.filter(b => b.status === 'completed').length
    });
  };

  // Update booking status
  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
    }
  };

  // Real-time subscription
  useEffect(() => {
    fetchBookings();

    const channel = supabase
      .channel('bookings-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          console.log('Real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setBookings(prev => [...prev, payload.new as Booking]);
          } else if (payload.eventType === 'UPDATE') {
            setBookings(prev => 
              prev.map(b => b.id === payload.new.id ? payload.new as Booking : b)
            );
          } else if (payload.eventType === 'DELETE') {
            setBookings(prev => prev.filter(b => b.id !== payload.old.id));
          }
          
          setLastUpdate(new Date());
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Recalculate stats when bookings change
  useEffect(() => {
    calculateStats(bookings);
  }, [bookings]);

  // Redirect if not admin
  useEffect(() => {
    if (!loading && !checkingAdmin) {
      if (!user) {
        navigate('/auth');
      } else if (isAdmin === false) {
        navigate('/');
      }
    }
  }, [user, loading, checkingAdmin, isAdmin, navigate]);

  // Show access denied for non-admins
  if (!loading && !checkingAdmin && isAdmin === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="glass max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Scissors className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="font-serif text-2xl">Access Denied</CardTitle>
            <CardDescription>You don't have admin privileges to access this panel.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate('/')}>Return to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter bookings based on search
  const filteredBookings = bookings.filter(booking => 
    booking.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.phone.includes(searchQuery) ||
    booking.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getDateBadge = (date: string) => {
    const parsedDate = parseISO(date);
    if (isToday(parsedDate)) {
      return <Badge className="bg-primary/20 text-primary border-primary/30">Today</Badge>;
    }
    if (isTomorrow(parsedDate)) {
      return <Badge variant="secondary">Tomorrow</Badge>;
    }
    return null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'confirmed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                <Scissors className="h-5 w-5 text-background" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">LUXE Barbershop</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Live indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs text-emerald-400 font-medium">Live</span>
              </div>
              
              <NotificationBell isAdmin />
              
              <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                Back to Site
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <AnimatedSection className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="glass border-primary/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Total Bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-serif font-bold text-gradient-gold">{stats.totalBookings}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="glass border-emerald-500/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-emerald-400" />
                  Today's Bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-serif font-bold text-emerald-400">{stats.todayBookings}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="glass border-blue-500/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  Upcoming
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-serif font-bold text-blue-400">{stats.upcomingBookings}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="glass border-purple-500/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-400" />
                  Completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-serif font-bold text-purple-400">{stats.completedBookings}</p>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatedSection>

        {/* Bookings Table */}
        <AnimatedSection delay={0.1}>
          <Card className="glass border-border/50">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="font-serif text-xl flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    All Bookings
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Last updated: {format(lastUpdate, 'HH:mm:ss')}
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search bookings..." 
                      className="pl-9 w-64 bg-background/50"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                  <Button variant="outline" size="icon" onClick={fetchBookings}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Client</th>
                      <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Date & Time</th>
                      <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {paginatedBookings.map((booking) => (
                        <motion.tr 
                          key={booking.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          layout
                          className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                                <span className="text-sm font-semibold text-primary">
                                  {booking.full_name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <p className="font-medium text-sm">{booking.full_name}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium">
                                    {format(parseISO(booking.booking_date), 'MMM dd, yyyy')}
                                  </p>
                                  {getDateBadge(booking.booking_date)}
                                </div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <Clock className="h-3 w-3" />
                                  {booking.booking_time}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-7 text-xs gap-1"
                                onClick={() => setSelectedBooking(booking)}
                              >
                                <Eye className="h-3 w-3" />
                                View
                              </Button>
                              {booking.status === 'pending' && (
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="h-7 text-xs text-emerald-400 hover:text-emerald-400"
                                  onClick={() => updateStatus(booking.id, 'confirmed')}
                                >
                                  Confirm
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 text-xs"
                                onClick={() => updateStatus(booking.id, 'completed')}
                                disabled={booking.status === 'completed' || booking.status === 'cancelled'}
                              >
                                Complete
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 text-xs text-destructive hover:text-destructive"
                                onClick={() => updateStatus(booking.id, 'cancelled')}
                                disabled={booking.status === 'cancelled'}
                              >
                                Cancel
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>

                {filteredBookings.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No bookings found</p>
                  </div>
                )}
              </div>

              {/* Booking Detail Dialog */}
              <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-serif text-xl flex items-center gap-2">
                      Booking Details
                    </DialogTitle>
                    <DialogDescription>Full information for this appointment.</DialogDescription>
                  </DialogHeader>
                  {selectedBooking && (
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                          <span className="text-lg font-semibold text-primary">
                            {selectedBooking.full_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{selectedBooking.full_name}</p>
                          <Badge className={getStatusColor(selectedBooking.status)}>
                            {selectedBooking.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">Contact</p>
                          <p className="text-sm font-medium flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                            {selectedBooking.phone}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">Service</p>
                          <p className="text-sm font-medium flex items-center gap-1.5">
                            <Scissors className="h-3.5 w-3.5 text-muted-foreground" />
                            {selectedBooking.service}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">Date</p>
                          <p className="text-sm font-medium flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {format(parseISO(selectedBooking.booking_date), 'MMMM dd, yyyy')}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">Time</p>
                          <p className="text-sm font-medium flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            {selectedBooking.booking_time}
                          </p>
                        </div>
                      </div>

                      {selectedBooking.notes && (
                        <div className="space-y-1 pt-2 border-t border-border/50">
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">Notes</p>
                          <p className="text-sm text-muted-foreground flex items-start gap-1.5">
                            <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                            {selectedBooking.notes}
                          </p>
                        </div>
                      )}

                      <div className="space-y-1 pt-2 border-t border-border/50">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">Booked on</p>
                        <p className="text-sm text-muted-foreground">
                          {format(parseISO(selectedBooking.created_at), 'MMMM dd, yyyy \'at\' HH:mm')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t border-border/50">
                        {selectedBooking.status === 'pending' && (
                          <Button 
                            size="sm" 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => { updateStatus(selectedBooking.id, 'confirmed'); setSelectedBooking(null); }}
                          >
                            Confirm
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => { updateStatus(selectedBooking.id, 'completed'); setSelectedBooking(null); }}
                          disabled={selectedBooking.status === 'completed' || selectedBooking.status === 'cancelled'}
                        >
                          Mark Complete
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => { updateStatus(selectedBooking.id, 'cancelled'); setSelectedBooking(null); }}
                          disabled={selectedBooking.status === 'cancelled'}
                        >
                          Cancel Booking
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm px-3">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedSection>
      </main>
    </div>
  );
};

export default Admin;
