import { supabase } from '@/lib/supabase';

const SERVICE_LABELS: Record<string, string> = {
  classic_cut: 'Classic Cut',
  royal_shave: 'Royal Shave',
  beard_sculpt: 'Beard Sculpting',
  luxe_package: 'LUXE Package',
};

const formatService = (s: string) => SERVICE_LABELS[s] || s.replace(/_/g, ' ');

interface NotifyParams {
  userId: string;
  title: string;
  message: string;
  type: 'confirmed' | 'cancelled' | 'completed' | 'new_booking' | 'pending';
  bookingId?: string;
}

export const createNotification = async ({ userId, title, message, type, bookingId }: NotifyParams) => {
  const { error } = await supabase.from('notifications').insert({
    user_id: userId,
    title,
    message,
    type,
    booking_id: bookingId,
    read: false,
  });
  if (error) console.error('Error creating notification:', error);
};

/** Notify the booking owner when admin changes status */
export const notifyUserStatusChange = async (booking: {
  id: string;
  user_id: string;
  service: string;
  booking_date: string;
  booking_time: string;
  full_name: string;
}, newStatus: string, cancelledByAdmin = false) => {
  const service = formatService(booking.service);

  if (newStatus === 'confirmed') {
    await createNotification({
      userId: booking.user_id,
      title: 'Booking Confirmed! ✅',
      message: `Your ${service} on ${booking.booking_date} at ${booking.booking_time} has been confirmed. See you there!`,
      type: 'confirmed',
      bookingId: booking.id,
    });
  } else if (newStatus === 'completed') {
    await createNotification({
      userId: booking.user_id,
      title: 'Session Complete 🎉',
      message: `Your ${service} session has been marked as completed. Thanks for visiting!`,
      type: 'completed',
      bookingId: booking.id,
    });
  } else if (newStatus === 'cancelled' && cancelledByAdmin) {
    await createNotification({
      userId: booking.user_id,
      title: 'Booking Cancelled by Admin',
      message: `Admin has cancelled your ${service} appointment on ${booking.booking_date} at ${booking.booking_time}.`,
      type: 'cancelled',
      bookingId: booking.id,
    });
  }
};

/** Notify all admins about a new booking or user cancellation */
export const notifyAdmins = async (booking: {
  id: string;
  service: string;
  booking_date: string;
  booking_time: string;
  full_name: string;
}, eventType: 'new_booking' | 'user_cancelled') => {
  // Get all admin user IDs
  const { data: adminRoles, error } = await supabase
    .from('user_roles')
    .select('user_id')
    .eq('role', 'admin');

  if (error || !adminRoles) {
    console.error('Error fetching admin roles:', error);
    return;
  }

  const service = formatService(booking.service);

  for (const { user_id } of adminRoles) {
    if (eventType === 'new_booking') {
      await createNotification({
        userId: user_id,
        title: `📋 New Booking from ${booking.full_name}`,
        message: `${booking.full_name} requested a ${service} on ${booking.booking_date} at ${booking.booking_time}. Awaiting your confirmation.`,
        type: 'new_booking',
        bookingId: booking.id,
      });
    } else if (eventType === 'user_cancelled') {
      await createNotification({
        userId: user_id,
        title: `❌ ${booking.full_name} Cancelled`,
        message: `${booking.full_name} cancelled their ${service} appointment on ${booking.booking_date} at ${booking.booking_time}.`,
        type: 'cancelled',
        bookingId: booking.id,
      });
    }
  }
};
