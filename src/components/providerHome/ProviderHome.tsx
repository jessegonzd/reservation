import { Button, Card, Col, Empty, Popconfirm, Row, notification } from "antd";
import { useEffect, useState } from "react";
import { Schedule } from "src/model/schedule";
import axiosInstance from "src/utils/axiosInstance";
import { getCurrentUserData } from "src/utils/getUserData";
import CreateScheduleModal from "./CreateScheduleModal";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const ProviderHome = () => {
  const userData = getCurrentUserData();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [openCreateSchedule, setOpenCreateSchedule] = useState(false);
  const [editScheduledata, setEditScheduleData] = useState<
    Schedule | undefined
  >();

  useEffect(() => {
    getSchedulesData();
  }, []);

  const getSchedulesData = async () => {
    const scehdulesData = await axiosInstance.get("/schedules", {
      params: {
        providerId: userData?.id,
      },
    });
    setSchedules(scehdulesData?.data || []);
  };

  const onCreateScheduleSuccess = () => {
    getSchedulesData();
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      await axiosInstance.delete(`/schedules/${id}`);
      notification.success({
        message: "schedule deleted successfully!!",
        placement: "top",
      });
      getSchedulesData();
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <span className="font-bold text-lg">My Schedules</span>
        <Button
          onClick={() => {
            setEditScheduleData(undefined);
            setOpenCreateSchedule(true);
          }}
        >
          Create schedule
        </Button>
      </div>
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
              <Card
                actions={[
                  <Popconfirm
                    title="Delete the schedule"
                    description="Are you sure to delete this schedule?"
                    onConfirm={() => handleDeleteSchedule(schedule?.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <DeleteOutlined />
                  </Popconfirm>,
                  <EditOutlined
                    onClick={() => {
                      setOpenCreateSchedule(true);
                      setEditScheduleData(schedule);
                    }}
                  />,
                ]}
                title={`Schedule: ${schedule?.id}`}
              >
                <div>
                  <p className="text-sm">Schedule Date</p>
                  <span className="text-xs text-blue-800">
                    {schedule?.date}
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-sm">Schedule Time</p>
                  <span className="text-xs text-blue-800">{`${schedule?.startTime} - ${schedule?.endTime}`}</span>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
      <CreateScheduleModal
        open={openCreateSchedule}
        setOpen={setOpenCreateSchedule}
        onCreateSuccess={onCreateScheduleSuccess}
        editScheduledata={editScheduledata}
        setEditScheduleData={setEditScheduleData}
        schedules={schedules}
      />
    </div>
  );
};

export default ProviderHome;
