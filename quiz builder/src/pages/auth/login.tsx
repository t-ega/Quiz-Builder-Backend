import LoginForm from "../../components/login-form";
import QuizSvg from "../../components/quiz-svg";

export const Login = () => {
  return (
    <div className="auth-container">
      <div className="picture-card">
        <QuizSvg />
      </div>
      <div className="content">
        <p className="title">
          Quiz Builder <span className="title-decoration">Hub</span>
        </p>
        <LoginForm />
      </div>
    </div>
  );
};
