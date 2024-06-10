import type { FormProps } from "antd";
import { Button, Form, Input, Select, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { UserType } from "src/model/user";
import axiosInstance from "src/utils/axiosInstance";

const { Option } = Select;

type FieldType = {
  name?: string;
  email?: string;
  password?: string;
  userType?: UserType;
};

const Register = () => {
  const navigate = useNavigate();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { name, email, password, userType } = values;
    const user = { name, email, password, userType };
    try {
      const users = await axiosInstance.get("/users", {
        params: {
          email,
        },
      });

      if (users?.data?.length > 0) {
        throw new Error("Email already exists");
      }
      await axiosInstance.post("/users", user);
      notification.success({
        message: "User created successfully!!",
        placement: "top",
      });
      navigate("/auth/signin");
    } catch (error: any) {
      notification.error({
        message: error?.message || "Failed to register user",
        placement: "top",
      });
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center mt-5">Register</h2>
      <Form
        name="register-form"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        className="p-4"
      >
        <Form.Item<FieldType>
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please input valid email!!" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>
        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>
        <Form.Item<FieldType>
          name="userType"
          label="User Type"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select User Type">
            <Option value={UserType.provider}>Provider</Option>
            <Option value={UserType.client}>Client</Option>
          </Select>
        </Form.Item>

        <Form.Item className="mt-8">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Register;
