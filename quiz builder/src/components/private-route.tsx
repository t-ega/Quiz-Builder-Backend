import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/quiz-test.context";

const cache = { token: "", username: "" };

const PrivateRoute = () => {
  if (!cache.token) {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (token) cache.token = token;
  }

  if (!cache.username) {
    const username = document.cookie
      .split("; ")
      .find((row) => row.startsWith("username="))
      ?.split("=")[1];
    if (username) {
      cache.username = username;
    }
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (!cache.token) {
      navigate("/auth/login");
    }
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ username: cache.username }}>
        <Outlet />
      </AuthContext.Provider>
    </>
  );
};

export default PrivateRoute;
