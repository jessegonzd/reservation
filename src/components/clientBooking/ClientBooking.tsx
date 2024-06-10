import { Button, Card, Col, Empty, Row, notification } from "antd";
import { useEffect, useState } from "react";
import { Booking, BookingStatus } from "src/model/booking";
import { User } from "src/model/user";
import axiosInstance from "src/utils/axiosInstance";
import { getCurrentUserData } from "src/utils/getUserData";

const fetchMyBookings = async (userId: string): Promise<Booking[]> => {
  try {
    const response = await axiosInstance.get<Booking[]>("/bookings", {
      params: { clientId: userId },
    });
    return response?.data;
  } catch (error) {
    console.log("Error fetching bookings", error);
    return [];
  }
};

const fetchUser = async (userId: string): Promise<User | null> => {
  try {
    const response = await axiosInstance.get<User>(`/users/${userId}`);
    return response?.data;
  } catch (error) {
    console.log("Error fetching user", error);
    return null;
  }
};

const ClientBooking = () => {
  const userData = getCurrentUserData();
  const [bookings, setBookings] = useState<
    (Booking & { provider: User; client: User })[]
  >([]);

  useEffect(() => {
    getMyBookings();
  }, []);

  const getMyBookings = async () => {
    const bookingsData = await fetchMyBookings(userData?.id);
    const bookingsWithProviderAndClient = await Promise.all(
      bookingsData.map(async (booking) => {
        const provider = await fetchUser(booking.providerId);
        const client = await fetchUser(booking.clientId);
        if(provider && client) {
          return { ...booking, provider, client };
        }
        return undefined;
      })
    );
    setBookings(bookingsWithProviderAndClient.filter(a => !!a) || []);
  };

  const handleCancelBooking = async (booking: Booking) => {
    await axiosInstance.patch(`/bookings/${booking?.id}`, {
      status: BookingStatus.Cancelled,
    });
    notification.success({ message: "Booking cancelled!!", placement: "top" });
    getMyBookings();
  };

  return (
    <div>
      <span className="font-bold text-lg">My Bookings</span>
      {!bookings?.length && (
        <Empty description="No Bookings" className="mt-8" />
      )}
      <Row
        gutter={[
          { xs: 8, sm: 16, md: 24, lg: 32 },
          { xs: 8, sm: 16, md: 24, lg: 32 },
        ]}
        className="mt-4"
      >
        {bookings?.map((booking) => {
          return (
            <Col key={booking?.id} span={12} sm={{ span: 8 }}>
              <Card
                actions={[
                  <Button
                    disabled={booking?.status !== BookingStatus.Pending}
                    onClick={() => handleCancelBooking(booking)}
                  >
                    Cancel booking
                  </Button>,
                ]}
                title={`Booking: ${booking?.id}`}
              >
                <div className="mb-3">
                  <p className="text-sm">Provider name</p>
                  <span className="text-xs text-blue-800">
                    {booking?.provider?.name}
                  </span>
                </div>
                <div className="mb-3">
                  <p className="text-sm">Booking Date</p>
                  <span className="text-xs text-blue-800">{booking?.date}</span>
                </div>
                <div className="mb-3">
                  <p className="text-sm">Booking Time</p>
                  <span className="text-xs text-blue-800">{`${booking?.from} - ${booking?.to}`}</span>
                </div>
                <div>
                  <p className="text-sm">Booking Status</p>
                  <span className="text-xs text-blue-800">
                    {booking?.status}
                  </span>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default ClientBooking;
