import QuizSvg from "../../components/quiz-svg";
import { Outlet } from "react-router-dom";

export const Auth = () => {
  return (
    <div className="auth-container">
      <div className="picture-card">
        <QuizSvg />
      </div>
      <div className="content">
        <p className="title">
          Quiz Builder <span className="title-decoration">Hub</span>
        </p>

        <Outlet />
      </div>
    </div>
  );
};
