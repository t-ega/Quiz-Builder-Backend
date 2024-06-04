import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { QuizTestContext } from "../../utils/quiz-test.context";

const QuizEntry = (props: IComponentProps) => {
  const { displayErrors } = props;
  const [totalTime, setTotalTime] = useState("");
  const [limitedTimeLeft, setLimitedTimeLeft] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const quizData = useContext(QuizTestContext);

  const [quiz, setQuiz] = useState<IQuizTest>();
  const quizRef = useRef<IQuizTest | undefined>();
  const timerRef = useRef<number | null>(null);
  const submittedRef = useRef<boolean>(false);
  quizRef.current = quiz; // Update the ref on every render

  const [remainingTime, setRemainingTime] = useState(0);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { quizId } = useParams();
  let submitted = false;

  const submission = () => {
    const entry = quizRef.current?.questions.map((data) => {
      const options = data.options.filter((option) => option.selected === true);
      const opts = options.map((option) => option.option);
      return { question: data.question, answers: opts };
    });
    return { email: quizData?.email, entry };
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

  const submitQuiz = (skip_confirmation: boolean) => {
    // TODO: Fix issue with set interval
    if (submittedRef.current) return;

    if (!skip_confirmation) {
      if (!confirm("Are you sure? This cannot be reversible!")) {
        return;
      }
    }

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
        navigate(`/${quizId}`);
      })
      .catch((error) => {
        const message = ApiRequest.extractApiErrors(error);
        displayErrors(message);
      });
    submittedRef.current = true;
  };

  const startTimer = (duration: number | null) => {
    if (!duration) return;

    setRemainingTime(duration * 60);
    setTotalTime(duration.toString());

    const timer = setInterval(() => {
      setRemainingTime((time) => {
        if (time <= 600) {
          setLimitedTimeLeft(true);
        }

        if (time === 0) {
          console.log(timer);
          if (timerRef.current) clearInterval(timerRef.current);
          submitQuiz(true);
          return 0;
        } else return time - 1;
      });
    }, 1000);

    timerRef.current = timer;
    return timer;
  };

  useEffect(() => {
    if (!quizData) {
      navigate(`/${quizId}`);
      return;
    }

    setQuiz(quizData);
    setIsLoading(false);

    let timer = startTimer(quizData.duration);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
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
                      {`${Math.floor(remainingTime / 60)}`.padStart(2, "0")}:
                      {`${remainingTime % 60}`.padStart(2, "0")} /{" "}
                      {totalTime.padStart(2, "0")}
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
      )}
    </>
  );
};

export default QuizEntry;
