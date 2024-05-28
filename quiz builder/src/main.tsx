import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Auth } from "./pages/auth/auth.tsx";
import { Login } from "./pages/auth/login.tsx";
import { SignUpComponent } from "./pages/auth/signup.tsx";
import SideBar from "./pages/admin/side-bar.tsx";
import QuizEntry from "./pages/client/quiz.tsx";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUpComponent />,
      },
    ],
  },
  {
    path: "/",
    element: <QuizEntry />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
