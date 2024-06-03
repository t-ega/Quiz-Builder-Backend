import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const cache = { token: "" };

const PrivateRoute = () => {
  if (!cache.token) {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (token) cache.token = token;
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (!cache.token) {
      navigate("/auth/login");
    }
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};

export default PrivateRoute;
