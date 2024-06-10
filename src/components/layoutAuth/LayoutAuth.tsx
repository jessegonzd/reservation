import { Button, Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const LayoutAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSigninPage = location?.pathname === "/auth/signin";
  const userData = localStorage.getItem("userData");
  const parsedUserData = userData ? JSON.parse(userData) : undefined;
  useEffect(() => {
    if (!!parsedUserData) {
      navigate("/");
    }
  }, [parsedUserData]);

  const handleAuthLinkClick = () => {
    if (isSigninPage) {
      navigate("/auth/signup");
    } else {
      navigate("/auth/signin");
    }
  };
  return (
    <Layout className="bg-transparent">
      <Header className="px-6 flex justify-between items-center">
        <span className="text-white text-lg">Reservation App</span>
        <Button type="link" onClick={handleAuthLinkClick}>
          {isSigninPage ? "Signup" : "Signin"}
        </Button>
      </Header>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default LayoutAuth;
