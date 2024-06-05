import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionCard from "../../components/client/question-card";
import ApiRequest from "../../utils/api-request";
import Loader from "../../components/loader";
import { IComponentProps } from "../../utils/interfaces";
import {
  IQuizTest,
  IQuizTestQuestion,
  QuizSubmissionSchema,
} from "../../utils/validations/client";
import { toast } from "react-toastify";
import { QuizTestContext } from "../../utils/quiz-test.context";
import { useMutation } from "@tanstack/react-query";
import { submitQuiz } from "../../api-requests/quiz";
import { getQuizStartTime, getRemainingTime } from "../../utils/cookies";
import { formatTime } from "../../utils/format-date";
import Header from "../../components/header";

const QuizEntry = (props: IComponentProps) => {
  const { displayErrors } = props;
  const [totalTime, setTotalTime] = useState("");
  const [limitedTimeLeft, setLimitedTimeLeft] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const quizData = useContext(QuizTestContext);

  const [quiz, setQuiz] = useState<IQuizTest>();
  const quizRef = useRef<IQuizTest | undefined>();
  quizRef.current = quiz; // Update the ref on every render

  const [remainingTime, setRemainingTime] = useState(1000);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { quizId } = useParams();

  const compileSubmission = () => {
    const entry = quizRef.current?.questions.map((data) => {
      const options = data.options.filter((option) => option.selected === true);
      const opts = options.map((option) => option.option);
      return { question: data.question, answers: opts };
    });
    return { email: quizData?.email, entry };
  };

  const submitQuizMutation = useMutation({
    mutationFn: submitQuiz,
  });

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

  const handleQuizSubmission = (skip_confirmation: boolean) => {
    if (!skip_confirmation) {
      // Skipped in the case where the timer is up!
      if (!confirm("Are you sure? This cannot be reversible!")) {
        return;
      }
    }

    const quizEntry = compileSubmission();
    const transformedQuiz = QuizSubmissionSchema.safeParse(quizEntry);

    if (transformedQuiz.error) {
      const { formErrors, fieldErrors } = transformedQuiz.error.flatten();
      const allErrors = [...formErrors, ...Object.values(fieldErrors).flat()];
      displayErrors(allErrors);
      return;
    }

    submitQuizMutation.mutate(
      { quizId: quizId!, ...transformedQuiz.data },
      {
        onSuccess: () => {
          toast.success("🎉 Yay! Quiz has been recorded! 🎯");
          navigate(`/${quizId}`);
        },
        onError: (error, _, __) => {
          const message = ApiRequest.extractApiErrors(error);
          displayErrors(message);
        },
      }
    );
  };

  // The duration must be in seconds
  const startTimer = (duration: number | null) => {
    if (duration === null) return; // duration of 0 should be allowed

    setRemainingTime(duration);

    const timer = setInterval(() => {
      setRemainingTime((time) => {
        if (time <= 600) {
          setLimitedTimeLeft(true);
        }

        if (time <= 0) {
          clearInterval(timer);
          handleQuizSubmission(true);
          return 0;
        } else return time - 1;
      });
    }, 1000);

    return timer;
  };

  useEffect(() => {
    if (!quizData) {
      navigate(`/${quizId}`);
      return;
    }

    setQuiz(quizData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let timer: number | undefined;
    // Extract the previous timer from a cookie
    if (quiz?.duration) {
      const startedAt = getQuizStartTime(quizId!);
      if (startedAt) {
        const remainingTime = getRemainingTime(quiz?.duration, startedAt);
        timer = startTimer(remainingTime);
      } else {
        timer = startTimer(quiz.duration);
      }

      setTotalTime(quiz?.duration.toString());
    }
    return () => clearInterval(timer);
  }, [quiz]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header heading="The Quiz Builder" text="Quiz Assessment" />

          {isLoading ? (
            <Loader />
          ) : (
            <div className="quiz-entry">
              <div className="quiz-meta">
                <div className="quiz-info">
                  <h2>Quiz Title</h2>
                  <p>{quiz?.title}</p>
                </div>
                {quiz?.duration && (
                  <div className="quiz-info">
                    <h2>Time left</h2>
                    <p className={limitedTimeLeft ? "limited-time" : ""}>
                      {formatTime(remainingTime)}/ {totalTime.padStart(2, "0")}{" "}
                      mins
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
                  submit={handleQuizSubmission}
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
