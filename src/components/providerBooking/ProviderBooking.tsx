import { Button, Card, Col, Empty, Row, notification } from "antd";
import { useEffect, useState } from "react";
import { Booking, BookingStatus } from "src/model/booking";
import { User } from "src/model/user";
import axiosInstance from "src/utils/axiosInstance";
import { getCurrentUserData } from "src/utils/getUserData";

const fetchBookings = async (userId: string): Promise<Booking[]> => {
  const response = await axiosInstance.get<Booking[]>("/bookings", {
    params: { providerId: userId },
  });
  return response?.data;
};

const fetchUser = async (userId: string): Promise<User> => {
  const response = await axiosInstance.get<User>(`/users/${userId}`);
  return response?.data;
};

const ProviderBooking = () => {
  const userData = getCurrentUserData();
  const [bookings, setBookings] = useState<
    (Booking & { provider: User; client: User })[]
  >([]);

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = async () => {
    const bookingsData = await fetchBookings(userData?.id);
    const bookingsWithProviderAndClient = await Promise.all(
      bookingsData.map(async (booking) => {
        const provider = await fetchUser(booking.providerId);
        const client = await fetchUser(booking.clientId);
        return { ...booking, provider, client };
      })
    );
    setBookings(bookingsWithProviderAndClient || []);
  };

  const handleUpdateBooking = async (
    booking: Booking,
    newStatus: BookingStatus
  ) => {
    try {
      await axiosInstance.patch(`/bookings/${booking?.id}`, {
        status: newStatus,
      });
      notification.success({
        message: `Booking ${newStatus}!!`,
        placement: "top",
      });
      getBookings();
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div>
      <span className="font-bold text-lg">Bookings</span>
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
                actions={booking?.status === BookingStatus.Pending ? [
                  <Button
                    onClick={() =>
                      handleUpdateBooking(booking, BookingStatus.Rejected)
                    }
                  >
                    Reject
                  </Button>,
                  <Button
                    type="primary"
                    onClick={() =>
                      handleUpdateBooking(booking, BookingStatus.Confirmed)
                    }
                  >
                    Confirm
                  </Button>,
                ] : []}
                title={`Booking: ${booking?.id}`}
              >
                <div className="mb-3">
                  <p className="text-sm">Client name</p>
                  <span className="text-xs text-blue-800">
                    {booking?.client?.name}
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

export default ProviderBooking;
