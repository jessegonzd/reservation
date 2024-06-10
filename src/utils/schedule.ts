import dayjs from "dayjs";
import { Booking, BookingStatus } from "src/model/booking";

export interface TimeSlot {
  label: string;
  value: string;
  disabled: boolean;
}

export function generateTimeSlots(
  date: string,
  startTime: string,
  endTime: string,
  bookings: Booking[]
): TimeSlot[] {
  // Helper function to format time as HH:MM
  function formatTime(time: dayjs.Dayjs): string {
    return time.format("HH:mm");
  }

  const startDateTime = dayjs(`${date}T${startTime}`);
  const endDateTime = dayjs(`${date}T${endTime}`);
  const currentTime = dayjs();
  const startAfter24Hours = currentTime.add(24, "hour");

  const slots: TimeSlot[] = [];

  let currentTimeSlot = startDateTime;

  while (currentTimeSlot.isBefore(endDateTime)) {
    const nextTimeSlot = currentTimeSlot.add(15, "minute");
    if (nextTimeSlot.isAfter(endDateTime)) break;

    const label = `${formatTime(currentTimeSlot)} to ${formatTime(
      nextTimeSlot
    )}`;
    const value = `${formatTime(currentTimeSlot)}-${formatTime(nextTimeSlot)}`;

    // Check if the slot is within 24 hours from now
    let disabled = currentTimeSlot.isBefore(startAfter24Hours);

    // Check if the slot overlaps with any confirmed booking
    const slotStart = currentTimeSlot;
    const slotEnd = nextTimeSlot;
    const isOverlappingBooking = bookings.some((booking) => {
      const bookingStart = dayjs(`${booking.date}T${booking.from}`);
      const bookingEnd = dayjs(`${booking.date}T${booking.to}`);
      return (
        booking.status === BookingStatus.Confirmed &&
        slotStart.isBefore(bookingEnd) &&
        slotEnd.isAfter(bookingStart)
      );
    });

    if (isOverlappingBooking) {
      disabled = true;
    }

    slots.push({ label, value, disabled });

    currentTimeSlot = nextTimeSlot;
  }

  return slots;
}
