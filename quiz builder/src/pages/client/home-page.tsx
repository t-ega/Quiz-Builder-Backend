import { useEffect, useState } from "react";
import { IComponentProps, IQuiz } from "../../utils/interfaces";
import { ENDPOINTS } from "../../utils/endpoints";
import { useNavigate, useParams } from "react-router-dom";
import apiRequest from "../../utils/api-request";
import axios, { CancelToken } from "axios";
import { Card } from "../../components/card";
import Header from "../../components/header";
import { z } from "zod";
import {
  QuizTestSchema,
  QuizInputSchema,
  IQuizTest,
} from "../../utils/validations/admin";
import { setQuizData } from "../../utils/store/slices/client";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../utils/store";

const HomePage = (props: IComponentProps) => {
  const { displayErrors } = props;

  const [quiz, setQuiz] = useState<IQuizTest>();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { quizId } = useParams();
  const quizUrl = `${ENDPOINTS.SUBMIT_QUIZ}/${quizId}`;

  const fetchQuizQuestions = () => {
    setIsLoading(true);

    apiRequest
      .get(quizUrl)
      .then((res) => {
        if (!res) {
          return;
        }

        const { data } = res.data;

        const transformedData = QuizTestSchema.safeParse(data.quiz);
        console.log(
          "Trans",
          data.quiz,
          transformedData.data,
          transformedData.error?.errors
        );

        if (transformedData.data) {
          const { title, duration, questions } = transformedData.data;

          navigate(`/${quizId}/start`, {
            state: { email, quiz: { title, duration, questions } },
          });
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
        if (error.response && error.response.data) {
          displayErrors(error.response.data.errors);
          return;
        }

        displayErrors(error.message);
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
    apiRequest
      .get(quizUrl, cancelToken)
      .then((res) => {
        if (!res) {
          return;
        }
        const { data } = res.data;
        const quizData = data.quiz;

        setQuiz({
          title: quizData.title,
          duration: quizData.duration,
          questions: quizData.questions,
          ...quizData,
        });
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          displayErrors(error.response.data.message);
          displayErrors(error.response.data.errors);
          return;
        }

        displayErrors(error.message);
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
            Number of questions: <span>{quiz?.questions.length}</span>
          </h4>
          <h4>Duration: {quiz?.duration}</h4>
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
    </>
  );
};

export default HomePage;
