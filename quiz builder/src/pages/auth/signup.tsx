import QuizSvg from "../../components/quiz-svg";
import SignUpForm from "../../components/signup-form";

export const SignUpComponent = () => {
  return (
    <div className="auth-container">
      <div className="picture-card">
        <QuizSvg />
      </div>
      <div className="content">
        <p className="title">
          Quiz Builder <span className="title-decoration">Hudb</span>
        </p>
        <SignUpForm />
      </div>
    </div>
  );
};
