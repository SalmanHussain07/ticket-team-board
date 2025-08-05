import { ReactNode } from "react";
import { Navigate } from "react-router-dom";


const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  console.log("Token in PrivateRoute:", token);
  console.log("User in PrivateRoute:", user);

  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
