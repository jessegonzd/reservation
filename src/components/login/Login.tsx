import type { FormProps } from "antd";
import { Button, Form, Input, notification } from "antd";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/utils/axiosInstance";

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

const Login = () => {
  const navigate = useNavigate();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const { email, password } = values;
      const users = await axiosInstance.get("/users", {
        params: {
          email: email,
        },
      });

      const matchUser = users?.data?.find(
        (u: { email: string; password: string }) =>
          u.email === email && u.password === password
      );

      if (matchUser) {
        localStorage.setItem("userData", JSON.stringify(matchUser));
        notification.success({
          message: "Login successful!",
          placement: "top",
        });
        navigate("/");
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error: any) {
      notification.error({
        message: error.message || "Failed to login",
        placement: "top",
      });
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center mt-5">Login</h2>
      <Form
        name="login-form"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        className="p-4"
      >
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

        <Form.Item className="mt-8">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Login;
