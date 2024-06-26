export enum BookingStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Cancelled = "Cancelled",
  Rejected = "Rejected",
  Expired = "Expired"
}

export type Booking = {
  id: string;
  scheduleId: string;
  providerId: string;
  clientId: string;
  date: string;
  from: string;
  to: string;
  status: BookingStatus;
};
