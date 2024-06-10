import { Button, Card, Col, Empty, Row } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Schedule } from "src/model/schedule";
import { User } from "src/model/user";
import axiosInstance from "src/utils/axiosInstance";

const fetchSchedules = async (): Promise<Schedule[]> => {
  try {
    const response = await axiosInstance.get<Schedule[]>(
      "/schedules"
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching schedules", error);
    return [];
  }
};

const fetchProvider = async (providerId: string): Promise<User> => {
  const response = await axiosInstance.get<User>(
    `/users/${providerId}`
  );
  return response?.data;
};

const ClientHome = () => {
  const navigate = useNavigate()
  const [schedules, setSchedules] = useState<(Schedule & { provider: User })[]>(
    []
  );

  useEffect(() => {
    getSchedulesData();
  }, []);

  const getSchedulesData = async () => {
    const scheduleData = await fetchSchedules();
    const schedulesWithProviders = await Promise.all(
      scheduleData.map(async (schedule) => {
        const provider = await fetchProvider(schedule.providerId);
        return { ...schedule, provider };
      })
    );
    setSchedules(schedulesWithProviders || []);
  };

  const handleBookAppointment = (id:string) => {
    navigate(`/client/schedule/${id}`)
  }

  return (
    <div>
      <span className="font-bold text-lg">Schedules</span>
      {!schedules?.length && (
        <Empty description="No Schedules" className="mt-8" />
      )}
      <Row
        gutter={[
          { xs: 8, sm: 16, md: 24, lg: 32 },
          { xs: 8, sm: 16, md: 24, lg: 32 },
        ]}
        className="mt-4"
      >
        {schedules?.map((schedule) => {
          return (
            <Col key={schedule?.id} span={12} sm={{ span: 8 }}>
              <Card actions={[<Button onClick={() => handleBookAppointment(schedule?.id)}>Book Appointment</Button>]} title={`Schedule: ${schedule?.id}`}>
                <div className="mb-3">
                  <p className="text-sm">Provider name</p>
                  <span className="text-xs text-blue-800">
                    {schedule?.provider?.name}
                  </span>
                </div>
                <div className="mb-3">
                  <p className="text-sm">Schedule Date</p>
                  <span className="text-xs text-blue-800">
                    {schedule?.date}
                  </span>
                </div>
                <div>
                  <p className="text-sm">Schedule Time</p>
                  <span className="text-xs text-blue-800">{`${schedule?.startTime} - ${schedule?.endTime}`}</span>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default ClientHome;
