import { Routes, Route } from "react-router-dom";
import LayoutProvider from "src/components/layoutProvider/LayoutProvider";
import ProviderHome from "src/components/providerHome/ProviderHome";
import ClientHome from "src/components/clientHome/ClientHome";
import LayoutClient from "src/components/layoutClient/LayoutClient";
import AuthenticatedRoute from "./AuthenticatedRoute";
import NavigateToUserHome from "./NavigateToUserHome";
import ClientScheduleDetails from "src/components/clientScheduleDetails/ClientScheduleDetails";
import ClientBooking from "src/components/clientBooking/ClientBooking";
import ProviderBooking from "src/components/providerBooking/ProviderBooking";
import Register from "src/components/register/Register";
import LayoutAuth from "src/components/layoutAuth/LayoutAuth";
import Login from "src/components/login/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="auth" element={<LayoutAuth />}>
        <Route index path="signup" element={<Register />} />
        <Route path="signin" element={<Login />} />
      </Route>
      <Route path="/" element={<AuthenticatedRoute />}>
        <Route path="client" element={<LayoutClient />}>
          <Route path="" element={<ClientHome />} />
          <Route
            path="schedule/:scheduleId"
            element={<ClientScheduleDetails />}
          />
          <Route path="bookings" element={<ClientBooking />} />
        </Route>
        <Route path="provider" element={<LayoutProvider />}>
          <Route index element={<ProviderHome />} />
          <Route path="bookings" element={<ProviderBooking />} />
        </Route>
        <Route path="*" element={<NavigateToUserHome />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
