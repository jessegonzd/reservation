import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getCurrentUserData } from "src/utils/getUserData";

const AuthenticatedRoute: React.FC = () => {
  const currentUser = getCurrentUserData();
  const userType = currentUser?.userType;
  const pathName =
    useLocation()?.pathname === "/" ? userType : useLocation()?.pathname;
  if (!userType) {
    return <Navigate to="/auth/signin" />;
  }

  if (userType === "client") {
    return (
      <>
        <Outlet />
        <Navigate to={pathName} replace />
      </>
    );
  }

  if (userType === "provider") {
    return (
      <>
        <Outlet />
        <Navigate to={pathName} replace />
      </>
    );
  }

  return null;
};

export default AuthenticatedRoute;
