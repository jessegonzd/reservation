import { CalendarOutlined, LogoutOutlined, ScheduleOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { User, UserType } from "src/model/user";

const LayoutProvider = () => {
  const navigate = useNavigate();
  const userData = localStorage.getItem("userData");
  const parsedUserData: User = userData ? JSON.parse(userData) : undefined;
  useEffect(() => {
    if (!parsedUserData) {
      navigate("/auth/signin");
      return;
    }
    if (!!parsedUserData && parsedUserData?.userType === UserType.client) {
      navigate("/client");
      return;
    }
  }, [parsedUserData]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/");
  };

  const items = [
    {
        label: "My Schedules",
        key: "schedules",
        icon: <ScheduleOutlined />,
        onClick: () => navigate('/provider'),
      },
      {
        label: "Bookings",
        key: "bookings",
        icon: <CalendarOutlined />,
        onClick: () => navigate('/provider/bookings'),
      },
    {
      label: "Logout",
      key: "logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="bg-transparent">
      <Header
        className="px-6 flex justify-between items-center sticky top-0 z-10"
      >
        <div className="flex flex-col my-2">
          <span className="text-white text-lg">Reservation App</span>
          <span className="text-gray-400 text-xs">(Provider)</span>
        </div>
        <Dropdown placement="bottomRight" menu={{ items }} trigger={["click"]}>
          <Avatar size={36} className="bg-slate-200 text-current text-2xl">
            {parsedUserData?.name?.[0]?.toUpperCase()}
          </Avatar>
        </Dropdown>
      </Header>
      <Content className="p-4 pb-8">
        <Outlet />
      </Content>
    </Layout>
  );
};

export default LayoutProvider;
