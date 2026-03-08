import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Clock, Loader2, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const BARBER_WHATSAPP = '27747862736';

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
];

const serviceOptions = [
  { value: 'classic_cut', label: 'Classic Cut — $45' },
  { value: 'royal_shave', label: 'Royal Shave — $35' },
  { value: 'beard_sculpt', label: 'Beard Sculpting — $30' },
  { value: 'luxe_package', label: 'LUXE Package — $95' },
];

interface BookingFormProps {
  suggestedTime?: string | null;
}

const BookingForm = ({ suggestedTime }: BookingFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [phone, setPhone] = useState(user?.user_metadata?.phone || '');
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState(suggestedTime || '');
  const [service, setService] = useState('');
  const [notes, setNotes] = useState('');
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch booked (confirmed) slots when date changes
  useEffect(() => {
    if (!date) {
      setBookedSlots([]);
      return;
    }
    const fetchBookedSlots = async () => {
      setLoadingSlots(true);
      const dateStr = format(date, 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('bookings')
        .select('booking_time')
        .eq('booking_date', dateStr)
        .eq('status', 'confirmed');

      if (!error && data) {
        setBookedSlots(data.map((b: any) => b.booking_time));
      }
      setLoadingSlots(false);
    };
    fetchBookedSlots();
  }, [date]);

  // Reset time if selected slot becomes booked
  useEffect(() => {
    if (time && bookedSlots.includes(time)) {
      setTime('');
    }
  }, [bookedSlots]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in to book');
      navigate('/auth');
      return;
    }

    if (!fullName.trim() || !phone.trim() || !date || !time || !service) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (fullName.length > 100 || phone.length > 20 || notes.length > 500) {
      toast.error('Input too long');
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('bookings').insert({
      user_id: user.id,
      full_name: fullName.trim(),
      phone: phone.trim(),
      booking_date: format(date, 'yyyy-MM-dd'),
      booking_time: time,
      service,
      notes: notes.trim() || null,
      status: 'pending',
    });

    setLoading(false);

    if (error) {
      toast.error('Booking failed. Please try again.');
      console.error(error);
    } else {
      toast.success('Booking confirmed! See you soon.');
      navigate('/dashboard');
    }
  };

  const handleWhatsApp = () => {
    if (!fullName.trim() || !phone.trim() || !date || !time || !service) {
      toast.error('Please fill in all required fields before sending via WhatsApp');
      return;
    }
    const selectedService = serviceOptions.find(s => s.value === service)?.label || service;
    const message = `Hi, I'd like to book an appointment:\n\n` +
      `*Name:* ${fullName.trim()}\n` +
      `*Phone:* ${phone.trim()}\n` +
      `*Service:* ${selectedService}\n` +
      `*Date:* ${format(date, 'PPP')}\n` +
      `*Time:* ${time}\n` +
      (notes.trim() ? `*Notes:* ${notes.trim()}\n` : '');

    const url = `https://wa.me/${BARBER_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm text-muted-foreground">Full Name *</Label>
          <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" maxLength={100} required className="bg-secondary/50 border-border/50 focus:border-primary" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm text-muted-foreground">Contact Number *</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" maxLength={20} required className="bg-secondary/50 border-border/50 focus:border-primary" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Service *</Label>
        <Select value={service} onValueChange={setService} required>
          <SelectTrigger className="bg-secondary/50 border-border/50 focus:border-primary">
            <SelectValue placeholder="Choose a service" />
          </SelectTrigger>
          <SelectContent>
            {serviceOptions.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn('w-full justify-start text-left bg-secondary/50 border-border/50', !date && 'text-muted-foreground')}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => d < new Date() || d.getDay() === 0} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Time *</Label>
          <Select value={time} onValueChange={setTime} required>
            <SelectTrigger className="bg-secondary/50 border-border/50 focus:border-primary">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((t) => {
                const isBooked = bookedSlots.includes(t);
                return (
                  <SelectItem key={t} value={t} disabled={isBooked} className={cn(isBooked && 'opacity-40 line-through')}>
                    {t}{isBooked ? ' — Booked' : ''}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm text-muted-foreground">Additional Notes (optional)</Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any preferences or requests..." maxLength={500} className="bg-secondary/50 border-border/50 focus:border-primary min-h-[80px]" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button type="submit" disabled={loading} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-sm uppercase tracking-wider py-6">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Booking...</> : 'Confirm Booking'}
        </Button>
        <Button type="button" onClick={handleWhatsApp} className="flex-1 bg-[#25D366] hover:bg-[#1da851] text-white text-sm uppercase tracking-wider py-6">
          <MessageCircle className="mr-2 h-4 w-4" /> Send via WhatsApp
        </Button>
      </div>
    </form>
  );
};

export default BookingForm;
