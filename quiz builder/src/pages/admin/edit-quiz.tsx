import { ChangeEvent, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../utils/store";
import {
  resetStore,
  setQuestion,
  setQuizData,
} from "../../utils/store/slices/question-slice";
import QuestionCard from "../../components/question-card";
import QuizInfo from "../../components/quiz-info";
import ApiRequest from "../../utils/api-request";
import { ENDPOINTS } from "../../utils/endpoints";
import {
  QuizInputSchema,
  QuizOutputSchema,
} from "../../utils/validations/admin";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios, { CancelToken } from "axios";

const EditQuiz = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const questionsList = useSelector(
    (state: RootState) => state.questions.questionsList
  );
  const currentQuestionIndex = useSelector(
    (state: RootState) => state.questions.currentQuestionIndex
  );
  const currentQuestion = questionsList[currentQuestionIndex];
  const quiz = useSelector((state: RootState) => state.questions);
  const navigate = useNavigate();

  const handleQuestionInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setQuestion(e.target.value));
  };

  const { quizId } = useParams();
  const quizUrl = `${ENDPOINTS.ADMIN_QUIZ}/${quizId}`;

  const save = async () => {
    const validQuestions = QuizOutputSchema.safeParse(quiz);

    if (!validQuestions.success) {
      const { formErrors, fieldErrors } = validQuestions.error.flatten();
      const allErrors = [...formErrors, ...Object.values(fieldErrors).flat()];
      displayErrors(allErrors);
      return;
    }

    ApiRequest.put(quizUrl, validQuestions.data)
      .then(() => {
        navigate(`/quizzes/${quizId}`);
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

  const displayErrors = (errors: string[] | string) => {
    if (Array.isArray(errors)) {
      errors?.map((error) => toast.error(error));
      return;
    }
    toast.error(errors);
  };

  const fetchQuizQuestions = async (cancelToken?: CancelToken) => {
    setLoading(true);
    try {
      const response = await ApiRequest.get(quizUrl, cancelToken);

      if (response) {
        const { data } = response.data;
        const transformedData = QuizInputSchema.safeParse(data);
        console.log(transformedData.data, transformedData.error?.errors);
        if (transformedData.data) {
          const { title, duration, questionsList } = transformedData.data;
          dispatch(
            setQuizData({
              title,
              duration,
              questionsList,
              currentQuestionIndex: 0,
            })
          );
        } else {
          const { formErrors, fieldErrors } = transformedData.error.flatten();
          const allErrors = [
            ...formErrors,
            ...Object.values(fieldErrors).flat(),
          ];
          displayErrors(allErrors);
        }
        setLoading(false);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        displayErrors([
          error.response.data.message,
          error.response.data.errors,
        ]);
        // Navigate if any error
        navigate("/quizzes");
        return;
      }
      displayErrors(error.message);
      // Navigate if any error
      navigate("/quizzes");
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    fetchQuizQuestions(source.token);
    return () => {
      // resetStore
      dispatch(resetStore());
      source.cancel();
    };
  }, []);

  return (
    <div>
      <div className="quiz-dashboard">
        <div className="quiz-entry">
          <QuizInfo questionsList={questionsList} dispatch={dispatch} />
          <QuestionCard
            currentQuestion={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            questionsListLength={questionsList.length}
            questionsList={questionsList}
            save={save}
            handleQuestionInput={handleQuestionInput}
            dispatch={dispatch}
          />
        </div>
      </div>
    </div>
  );
};

export default EditQuiz;
