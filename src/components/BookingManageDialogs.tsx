import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, Loader2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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

const serviceOptions = [
  { value: 'classic_cut', label: 'Classic Cut — $45' },
  { value: 'royal_shave', label: 'Royal Shave — $35' },
  { value: 'beard_sculpt', label: 'Beard Sculpting — $30' },
  { value: 'luxe_package', label: 'LUXE Package — $95' },
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
];

// ─── View Dialog ───
export const ViewBookingDialog = ({ booking, open, onOpenChange }: { booking: Booking; open: boolean; onOpenChange: (v: boolean) => void }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-[92vw] max-h-[85vh] overflow-y-auto sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="font-serif">Booking Details</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-2">
        <Row label="Service" value={serviceLabels[booking.service] || booking.service} />
        <Row label="Date" value={format(new Date(booking.booking_date), 'EEEE, MMM d, yyyy')} />
        <Row label="Time" value={booking.booking_time} />
        <Row label="Name" value={booking.full_name} />
        <Row label="Phone" value={booking.phone} />
        <Row label="Status">
          <Badge variant="outline" className="border-primary/30 text-primary text-xs">{booking.status}</Badge>
        </Row>
        {booking.notes && <Row label="Notes" value={booking.notes} />}
        <Row label="Booked on" value={format(new Date(booking.created_at), 'MMM d, yyyy · h:mm a')} />
      </div>
    </DialogContent>
  </Dialog>
);

const Row = ({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) => (
  <div className="flex justify-between items-start gap-4">
    <span className="text-sm text-muted-foreground shrink-0">{label}</span>
    {children || <span className="text-sm font-medium text-right">{value}</span>}
  </div>
);

// ─── Edit Dialog ───
export const EditBookingDialog = ({ booking, open, onOpenChange, onSaved }: { booking: Booking; open: boolean; onOpenChange: (v: boolean) => void; onSaved: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>(new Date(booking.booking_date + 'T00:00:00'));
  const [time, setTime] = useState(booking.booking_time);
  const [service, setService] = useState(booking.service);
  const [notes, setNotes] = useState(booking.notes || '');
  const [fullName, setFullName] = useState(booking.full_name);
  const [phone, setPhone] = useState(booking.phone);

  const handleSave = async () => {
    if (!fullName.trim() || !phone.trim() || !date || !time || !service) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from('bookings')
      .update({
        full_name: fullName.trim(),
        phone: phone.trim(),
        booking_date: format(date, 'yyyy-MM-dd'),
        booking_time: time,
        service,
        notes: notes.trim() || null,
      })
      .eq('id', booking.id);
    setLoading(false);
    if (error) {
      toast.error('Failed to update booking.');
    } else {
      toast.success('Booking updated!');
      onSaved();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[92vw] max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif">Edit Booking</DialogTitle>
          <DialogDescription>Update your appointment details below.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Full Name *</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} className="bg-secondary/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Phone *</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} className="bg-secondary/50 border-border/50" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Service *</Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger className="bg-secondary/50 border-border/50">
                <SelectValue />
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
                  <Button variant="outline" className={cn('w-full justify-start text-left bg-secondary/50 border-border/50')}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} disabled={(d) => d < new Date() || d.getDay() === 0} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Time *</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} className="bg-secondary/50 border-border/50 min-h-[80px]" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading} className="gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Cancel Dialog ───
export const CancelBookingDialog = ({ booking, open, onOpenChange, onCancelled }: { booking: Booking; open: boolean; onOpenChange: (v: boolean) => void; onCancelled: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');

  const handleCancel = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }
    if (reason.length > 500) {
      toast.error('Reason is too long');
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        notes: booking.notes ? `${booking.notes}\n\n[Cancellation reason]: ${reason.trim()}` : `[Cancellation reason]: ${reason.trim()}`,
      })
      .eq('id', booking.id);
    setLoading(false);
    if (error) {
      toast.error('Failed to cancel booking.');
    } else {
      toast.success('Booking cancelled.');
      setReason('');
      onCancelled();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[92vw] max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" /> Cancel Booking
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel your <span className="font-semibold text-foreground">{serviceLabels[booking.service] || booking.service}</span> on{' '}
            <span className="font-semibold text-foreground">{format(new Date(booking.booking_date), 'MMM d, yyyy')}</span>?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Reason for cancellation *</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please tell us why you're cancelling..."
              maxLength={500}
              className="bg-secondary/50 border-border/50 min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Go Back</Button>
          <Button variant="destructive" onClick={handleCancel} disabled={loading || !reason.trim()} className="gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Confirm Cancellation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
