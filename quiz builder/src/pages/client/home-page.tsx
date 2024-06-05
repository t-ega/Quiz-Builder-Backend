import React, { useEffect, useRef, useState } from "react";
import { IComponentProps, KeyValuePair } from "../../utils/interfaces";
import { useNavigate, useParams } from "react-router-dom";
import ApiRequest from "../../utils/api-request";
import Header from "../../components/header";
import { z } from "zod";
import { IQuizTest, QuizTestSchema } from "../../utils/validations/client";
import Loader from "../../components/loader";
import { useQueries } from "@tanstack/react-query";
import { fetchTestDetails, fetchTestQuestions } from "../../api-requests/quiz";
import LoadingButton from "../../components/loading-button";
import { toast } from "react-toastify";
import { getQuizStartTime, setQuizStartTime } from "../../utils/cookies";
import NotFound from "../errors/404";
import ErrorPage from "../errors/error";

interface IHomePageProps {
  setQuizData: React.Dispatch<React.SetStateAction<IQuizTest | null>>;
}

const HomePage = (props: IHomePageProps) => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const { quizId } = useParams();

  const [{ data, error, isFetching }, testQuestionsQuery] = useQueries({
    queries: [
      {
        queryKey: ["client", "quiz", quizId],
        queryFn: () => fetchTestDetails(quizId!),
        staleTime: 1000 * 60 * 5,
        retry: false,
      },
      {
        queryKey: ["client", "quiz", "questions", quizId],
        queryFn: () => fetchTestQuestions({ quizId: quizId!, email }),
        enabled: false,
        retry: false,
        staleTime: 1000 * 60 * 5,
      },
    ],
  });

  const start = () => {
    const valid = z.string().email().safeParse(email);

    if (valid.error) {
      displayErrors("Please enter a valid email");
      return;
    }

    testQuestionsQuery.refetch().then((observer) => {
      if (observer.isSuccess) populateQuiz(observer.data);
    });
  };

  const populateQuiz = (queryResults: any) => {
    if (!queryResults) {
      return;
    }

    const { data } = queryResults;

    const transformedData = QuizTestSchema.safeParse({
      email,
      questions: data.quiz.quiz_questions,
      ...data.quiz,
    });

    if (transformedData.error) {
      displayErrors("Unable to load quiz data");
      return;
    }

    const { title, duration, questions } = transformedData.data;
    props.setQuizData({ email, title, duration, questions });

    // if the quiz has a duration then store it in a cookie incase
    // they close the page and open it again it still remains
    if (duration) {
      const existingCookie = getQuizStartTime(quizId!);
      if (!existingCookie) {
        setQuizStartTime(quizId!);
      }
    }

    navigate(`/${quizId}/start`);
  };

  const displayErrors = (errors: string[] | string, toastId?: number) => {
    if (Array.isArray(errors)) {
      errors?.map((error) => toast.error(error));
      return;
    }
    toast.error(`❌${errors}`, { toastId: toastId });
  };

  useEffect(() => {
    if (testQuestionsQuery.isError) {
      const message = ApiRequest.extractApiErrors(testQuestionsQuery.error);
      displayErrors(message);
    }
  }, [testQuestionsQuery.error]);

  if (error) {
    const message = ApiRequest.extractApiErrors(error);
    return <ErrorPage message={message} />;
  }

  if (isFetching) return <Loader />;

  return (
    <>
      <Header />

      <div
        className="card"
        style={{
          display: "flex",
          maxWidth: "1000px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="quiz-detail">
          <h2>{data.data?.quiz.title}</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
            quos voluptatem quaerat odit quas distinctio iste optio dolorem
            nobis ex. Non, quo! Quis expedita nisi quasi, dolores ad autem
            numquam.
          </p>
          <h4>
            Number of questions: <span>{data.data?.quiz.questions_count}</span>
          </h4>
          {data.data?.quiz.duration && (
            <h4>Duration: {data.data?.quiz.duration} mins</h4>
          )}
        </div>
        <div>
          <h3>
            To Begin please kindly enter your email address where the quiz was
            sent to
          </h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-control"
          />
          {testQuestionsQuery.isFetching ? (
            <LoadingButton className="action-btn loading" />
          ) : (
            <button className="action-btn" onClick={() => start()}>
              Start
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
