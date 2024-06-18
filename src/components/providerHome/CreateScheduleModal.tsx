import { FC, useEffect } from "react";
import type { FormProps } from "antd";
import dayjs from "dayjs";
import { DatePicker, Form, Modal, TimePicker, notification } from "antd";
import axiosInstance from "src/utils/axiosInstance";
import { getCurrentUserData } from "src/utils/getUserData";
import { Schedule } from "src/model/schedule";

type FieldType = {
  date?: dayjs.Dayjs;
  timeRange?: [dayjs.Dayjs, dayjs.Dayjs];
};

interface CreateScheduleModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onCreateSuccess: () => void;
  editScheduledata: Schedule | undefined;
  setEditScheduleData: (value: Schedule | undefined) => void;
  schedules: Schedule[];
}

const CreateScheduleModal: FC<CreateScheduleModalProps> = ({
  open,
  setOpen,
  onCreateSuccess,
  editScheduledata,
  setEditScheduleData,
  schedules,
}) => {
  const [form] = Form.useForm();
  const userData = getCurrentUserData();

  useEffect(() => {
    if (editScheduledata) {
      form.setFieldValue("date", dayjs(editScheduledata?.date));
      form.setFieldValue("timeRange", [
        dayjs(`${editScheduledata?.date} ${editScheduledata?.startTime}`),
        dayjs(`${editScheduledata?.date} ${editScheduledata?.endTime}`),
      ]);
    } else {
      form.resetFields();
    }
  }, [editScheduledata]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const isScheduleAlreadyCreated = schedules?.find(
      (item) =>
        item?.date === values?.date?.format("YYYY-MM-DD") &&
        item?.id !== editScheduledata?.id
    );
    if (isScheduleAlreadyCreated) {
      notification.error({
        message: "Schedule already created for this date",
        placement: "top",
      });
      return;
    }
    console.log({ values })
    if (!editScheduledata) {
      const schedule = {
        providerId: userData?.id,
        date: values?.date?.format("YYYY-MM-DD"),
        startTime: `${values?.timeRange?.[0]
          .get("hours")
          ?.toString()
          .padStart(2, "0")}:${values?.timeRange?.[0]
          .get("minutes")
          ?.toString()
          .padStart(2, "0")}`,
        endTime: `${values?.timeRange?.[1]
          .get("hours")
          ?.toString()
          .padStart(2, "0")}:${values?.timeRange?.[1]
          .get("minutes")
          ?.toString()
          .padStart(2, "0")}`,
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
      };
      await axiosInstance.post("/schedules", schedule);
    } else {
      const schedule = {
        date: values?.date?.format("YYYY-MM-DD"),
        startTime: `${values?.timeRange?.[0]
          .get("hours")
          ?.toString()
          .padStart(2, "0")}:${values?.timeRange?.[0]
          .get("minutes")
          ?.toString()
          .padStart(2, "0")}`,
        endTime: `${values?.timeRange?.[1]
          .get("hours")
          ?.toString()
          .padStart(2, "0")}:${values?.timeRange?.[1]
          .get("minutes")
          ?.toString()
          .padStart(2, "0")}`,
        updatedAt: dayjs().toISOString(),
      };
      await axiosInstance.patch(`/schedules/${editScheduledata?.id}`, schedule);
    }
    notification.success({
      message: !!editScheduledata
        ? "Schedule edited successfully!!"
        : "Schedule created successfully!!",
      placement: "top",
    });
    onCreateSuccess();
    handleCloseModal();
  };

  const disabledDate = (current: dayjs.Dayjs): boolean => {
    return current && current < dayjs().endOf("day");
  };

  const handleCloseModal = () => {
    form.resetFields();
    setOpen(false);
    setEditScheduleData(undefined);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleCloseModal}
        onCancel={handleCloseModal}
        okText="Submit"
        okButtonProps={{ htmlType: "submit" }}
        title={editScheduledata ? "edit schedule" : "create new schedule"}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item<FieldType>
            label="Schedule Date"
            name="date"
            rules={[
              { required: true, message: "Please input your schedule date!" },
            ]}
          >
            <DatePicker disabledDate={disabledDate} />
          </Form.Item>

          <Form.Item<FieldType>
            label="Time Range"
            name="timeRange"
            rules={[
              { required: true, message: "Please input your time range!" },
            ]}
          >
            <TimePicker.RangePicker format="HH:mm" minuteStep={30} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateScheduleModal;
