import { Button, Card, Select, notification } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookingStatus } from "src/model/booking";
import { Schedule } from "src/model/schedule";
import { User } from "src/model/user";
import axiosInstance from "src/utils/axiosInstance";
import { getCurrentUserData } from "src/utils/getUserData";
import { TimeSlot, generateTimeSlots } from "src/utils/schedule";

const ClientScheduleDetails = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const userData = getCurrentUserData();
  const [schedule, setSchedule] = useState<
    (Schedule & { provider: User }) | undefined
  >();
  const [selectedSlot, setSelectedSlot] = useState<string | undefined>();
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    getScheduleData();
    getAvailableSlots();
  }, [scheduleId]);

  const getScheduleData = async () => {
    const scheduleData = await axiosInstance.get(`/schedules/${scheduleId}`);
    const providerData = await axiosInstance.get(
      `/users/${scheduleData?.data?.providerId}`
    );
    setSchedule({ ...scheduleData?.data, provider: providerData?.data });
  };

  const handleSlotChange = (value: string) => {
    setSelectedSlot(value);
  };

  const handleConfirmBooking = async () => {
    const booking = {
      scheduleId,
      providerId: schedule?.providerId,
      clientId: userData?.id,
      date: schedule?.date,
      from: selectedSlot?.split("-")?.[0],
      to: selectedSlot?.split("-")?.[1],
      status: BookingStatus.Pending,
    };
    await axiosInstance.post("/bookings", booking);
    notification.success({ message: "Booking Confirmed!!", placement: "top" });
    navigate("/client/bookings");
  };

  const getAvailableSlots = async () => {
    const bookings = await axiosInstance.get("/bookings", {
      params: { scheduleId },
    });
    const slots = generateTimeSlots(
      schedule?.date ?? "",
      schedule?.startTime ?? "",
      schedule?.endTime ?? "",
      bookings?.data ?? []
    );
    setSlots(slots);
  };

  return (
    <div>
      <span className="font-bold text-lg">Schedule Details</span>
      <Card title={`Schedule: ${scheduleId}`} className="mt-4">
        <div className="mb-3">
          <p className="text-sm">Provider name</p>
          <span className="text-xs text-blue-800">
            {schedule?.provider?.name}
          </span>
        </div>
        <div className="mb-3">
          <p className="text-sm">Schedule Date</p>
          <span className="text-xs text-blue-800">{schedule?.date}</span>
        </div>
        <div className="mb-3">
          <p className="text-sm">Schedule Time</p>
          <span className="text-xs text-blue-800">{`${schedule?.startTime} - ${schedule?.endTime}`}</span>
        </div>
        <div>
          <p className="text-sm">Select slot</p>
          <Select
            placeholder="Select slot"
            className="w-9/12 mt-1"
            onChange={handleSlotChange}
            value={selectedSlot}
            options={slots}
          />
        </div>
        <Button
          className="mt-4"
          type="primary"
          disabled={!selectedSlot}
          onClick={handleConfirmBooking}
        >
          Confirm booking
        </Button>
      </Card>
    </div>
  );
};

export default ClientScheduleDetails;
