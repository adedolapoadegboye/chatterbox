import { useContext } from "react";
import { accountContext } from "../Context/Context";

const { Outlet, Navigate } = require("react-router");

const useAuth = () => {
  const { user } = useContext(accountContext);
  return user && user.loggedIn;
};

const ProtectedRoutes = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
