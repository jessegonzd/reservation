import { Navigate } from "react-router-dom";
import { getCurrentUserData } from "src/utils/getUserData";

const NavigateToUserHome: React.FC = () => {
  const currentUser = getCurrentUserData();
  const userType = currentUser?.userType;
  if (userType === "client") {
    return <Navigate to="/client" />;
  } else if (userType === "provider") {
    return <Navigate to="/provider" />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default NavigateToUserHome;
