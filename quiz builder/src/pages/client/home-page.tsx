import React, { useEffect, useState } from "react";
import { IComponentProps } from "../../utils/interfaces";
import { ENDPOINTS } from "../../utils/endpoints";
import { useNavigate, useParams } from "react-router-dom";
import ApiRequest from "../../utils/api-request";
import axios, { CancelToken } from "axios";
import Header from "../../components/header";
import { z } from "zod";

import { useDispatch } from "react-redux";
import { AppDispatch } from "../../utils/store";
import { IQuizTest, QuizTestSchema } from "../../utils/validations/client";
import Loader from "../../components/loader";

interface IHomePageProps extends IComponentProps {
  setQuizData: React.Dispatch<React.SetStateAction<IQuizTest | null>>;
}

type HomePageQuiz = {
  title: string;
  duration: number | null;
  questions_count: number;
};

const HomePage = (props: IHomePageProps) => {
  const { displayErrors } = props;

  const [quiz, setQuiz] = useState<HomePageQuiz>();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { quizId } = useParams();
  const quizUrl = `${ENDPOINTS.SUBMIT_QUIZ}/${quizId}`;

  const fetchQuizQuestions = () => {
    setIsLoading(true);
    const url = `${quizUrl}/questions?email=${email}`;
    ApiRequest.get(url)
      .then((res) => {
        if (!res) {
          return;
        }

        const { data } = res.data;

        const transformedData = QuizTestSchema.safeParse({
          email,
          questions: data.quiz.quiz_questions,
          ...data.quiz,
        });

        console.log(
          "Trans",
          data.quiz,
          transformedData.data,
          transformedData.error?.errors
        );

        if (transformedData.data) {
          const { title, duration, questions } = transformedData.data;
          props.setQuizData({ email, title, duration, questions });

          navigate(`/${quizId}/start`);
          return;
        } else {
          const { formErrors, fieldErrors } = transformedData.error.flatten();
          const allErrors = [
            ...formErrors,
            ...Object.values(fieldErrors).flat(),
          ];

          displayErrors(allErrors);
        }
      })
      .catch((error) => {
        const message = ApiRequest.extractApiErrors(error);
        displayErrors(message);
      });

    setIsLoading(false);
  };

  const start = () => {
    const valid = z.string().email().safeParse(email);

    if (valid.error) {
      displayErrors("Please enter a valid email");
      return;
    }

    fetchQuizQuestions();
  };

  const fetchQuizData = (cancelToken: CancelToken) => {
    setLoading(true);
    ApiRequest.get(quizUrl, cancelToken)
      .then((res) => {
        if (!res) {
          return;
        }
        const { data } = res.data;
        const quizData = data.quiz;
        setQuiz(quizData);
        setLoading(false);
      })
      .catch((error) => {
        const message = ApiRequest.extractApiErrors(error);
        displayErrors(message);
        setLoading(false);
      });
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    fetchQuizData(source.token);
    return () => source.cancel();
  }, []);

  return (
    <>
      <Header />
      {loading ? (
        <Loader />
      ) : (
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
            <h2>{quiz?.title}</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
              quos voluptatem quaerat odit quas distinctio iste optio dolorem
              nobis ex. Non, quo! Quis expedita nisi quasi, dolores ad autem
              numquam.
            </p>
            <h4>
              Number of questions: <span>{quiz?.questions_count}</span>
            </h4>
            {quiz?.duration && <h4>Duration: {quiz?.duration} mins</h4>}
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
            <button className="action-btn" onClick={() => start()}>
              Start
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
