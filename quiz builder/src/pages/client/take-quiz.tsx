import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import QuestionCard from "../../components/client/question-card";
import ApiRequest from "../../utils/api-request";
import { ENDPOINTS } from "../../utils/endpoints";

import Loader from "../../components/loader";
import { IComponentProps } from "../../utils/interfaces";
import {
  IQuizTest,
  IQuizTestQuestion,
  QuizSubmissionSchema,
} from "../../utils/validations/client";
import { toast } from "react-toastify";

const QuizEntry = (props: IComponentProps) => {
  const { displayErrors } = props;
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [totalTime, setTotalTime] = useState("");
  const [limitedTimeLeft, setLimitedTimeLeft] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<IQuizTest>();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { quizId } = useParams();
  const { state } = useLocation();

  const submission = () => {
    const entry = quiz?.questions.map((data) => {
      const options = data.options.filter((option) => option.selected === true);
      const opts = options.map((option) => option.option);
      return { question: data.question, answers: opts };
    });
    return { email: state.email, entry };
  };

  const updateQuestion = (updatedQuestion: IQuizTestQuestion) => {
    setQuiz((prevQuiz) => {
      if (!prevQuiz) return;
      const updatedQuestions = prevQuiz.questions.map((question) =>
        question.question === updatedQuestion.question
          ? updatedQuestion
          : question
      );
      return { ...prevQuiz, questions: updatedQuestions };
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quiz!.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitQuiz = () => {
    const quizEntry = submission();
    const transformedQuiz = QuizSubmissionSchema.safeParse(quizEntry);

    if (transformedQuiz.error) {
      const { formErrors, fieldErrors } = transformedQuiz.error.flatten();
      const allErrors = [...formErrors, ...Object.values(fieldErrors).flat()];
      displayErrors(allErrors);
    }

    const quizUrl = `${ENDPOINTS.SUBMIT_QUIZ}/${quizId}/submit`;

    ApiRequest.post(quizUrl, transformedQuiz.data)
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          displayErrors(error.response.data.message);
          displayErrors(error.response.data.errors);
          return;
        }

        displayErrors(error.message);
      });

    console.log(transformedQuiz.data, transformedQuiz.error?.errors, quizEntry);
  };

  const deadline = "May, 29, 2024 03:59:15";

  useEffect(() => {
    if (!state) {
      navigate(`/${quizId}`);
      return;
    }

    if (!state.email || !state.quiz) {
      navigate(`/${quizId}`);
      return;
    }

    setQuiz(state.quiz);

    const interval = setInterval(() => {
      const time = Date.parse(deadline) - Date.now();
      setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((time / 1000 / 60) % 60));
      setSeconds(Math.floor((time / 1000) % 60));

      if (time < 60000 && !limitedTimeLeft) {
        setLimitedTimeLeft(true);
      }

      if (time <= 3) {
        clearInterval(interval);
      }
    }, 1000);

    const total = new Date(deadline);
    const totalHours = total.getHours().toString().padStart(2, "0");
    const totalMinutes = total.getMinutes().toString().padStart(2, "0");
    const totalSeconds = total.getSeconds().toString().padStart(2, "0");

    const formattedTime = totalHours + ":" + totalMinutes + ":" + totalSeconds;
    setTotalTime(formattedTime);
    setLimitedTimeLeft(false);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div>
        <div className="header">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="50"
            height="50"
            viewBox="0 0 50 50"
          >
            <path d="M 18 5 C 15.239 5 13 7.239 13 10 L 13 11 L 32.5 11 C 36.09 11 39 13.91 39 17.5 L 39 27.5 C 39 29.433 37.433 31 35.5 31 L 22.5 31 C 20.567 31 19 29.433 19 27.5 L 19 21 L 15 21 C 13.895 21 13 21.895 13 23 L 13 32 C 13 34.761 15.239 37 18 37 L 40 37 C 42.761 37 45 34.761 45 32 L 45 10 C 45 7.239 42.761 5 40 5 L 18 5 z M 10 13 C 7.239 13 5 15.239 5 18 L 5 40 C 5 42.761 7.239 45 10 45 L 32 45 C 34.761 45 37 42.761 37 40 L 37 39 L 17.5 39 C 13.91 39 11 36.09 11 32.5 L 11 22.5 C 11 20.567 12.567 19 14.5 19 L 27.5 19 C 29.433 19 31 20.567 31 22.5 L 31 29 L 35 29 C 36.105 29 37 28.105 37 27 L 37 18 C 37 15.239 34.761 13 32 13 L 10 13 z"></path>
          </svg>
          <div>
            <h3>General Knoweldge Test</h3>
            <p>Novagenuiis technologies</p>
          </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="quiz-entry">
            <div>
              <div className="quiz-info">
                <h2>Quiz Title</h2>
                <p>Introduction to data science</p>
              </div>
              {quiz?.duration && (
                <div className="quiz-info">
                  <h2>Time left</h2>
                  <p className={limitedTimeLeft ? "limited-time" : ""}>
                    {hours}:{minutes}:{seconds} / {totalTime}
                  </p>
                </div>
              )}
              <div className="quiz-info">
                <h2>All Questions</h2>
                <div className="questions">
                  {quiz?.questions.map((_, idx) => (
                    <p
                      key={idx}
                      className="question-number"
                      onClick={() => setCurrentQuestionIndex(idx)}
                    >
                      {idx + 1}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            {quiz && (
              <QuestionCard
                nextQuestion={nextQuestion}
                currentQuestion={quiz.questions[currentQuestionIndex]}
                previousQuestion={previousQuestion}
                updateQuestion={updateQuestion}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={quiz.questions.length}
                submit={submitQuiz}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default QuizEntry;
