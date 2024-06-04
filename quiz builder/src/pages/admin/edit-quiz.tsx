import { ChangeEvent, useEffect } from "react";
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
import {
  QuizInputSchema,
  QuizOutputSchema,
} from "../../utils/validations/admin";
import { useNavigate, useParams } from "react-router-dom";
import { IComponentProps } from "../../utils/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchQuizDetails, updateQuiz } from "../../api-requests/quiz";
import Loader from "../../components/loader";
import ErrorPage from "../errors/error";

const EditQuiz = (props: IComponentProps) => {
  const { displayErrors } = props;
  const dispatch = useDispatch<AppDispatch>();
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

  const save = async () => {
    const validQuestions = QuizOutputSchema.safeParse(quiz);

    if (!validQuestions.success) {
      const { formErrors, fieldErrors } = validQuestions.error.flatten();
      const allErrors = [...formErrors, ...Object.values(fieldErrors).flat()];
      displayErrors(allErrors);
      return;
    }

    saveQuizMutation.mutate({
      quizId: quizId!,
      ...validQuestions.data,
    });
  };

  const queryClient = useQueryClient();

  const saveQuizMutation = useMutation({
    mutationFn: updateQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz", "details", quizId] });
      dispatch(resetStore());
      navigate(`/quizzes/${quizId}`);
    },
    onError: (err, _, __) => {
      const message = ApiRequest.extractApiErrors(err);
      displayErrors(message);
    },
  });

  const quizQuery = useQuery({
    queryKey: ["quiz", "edit", quizId],
    queryFn: () => fetchQuizDetails(quizId!),
  });

  useEffect(() => {
    const response = quizQuery.data;
    if (response) {
      const { data } = response;
      const transformedData = QuizInputSchema.safeParse(data);

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
        displayErrors("😓 Unable to load quiz");
      }
    }
  }, [quizQuery.data]);

  if (quizQuery.isFetching) return <Loader />;
  if (quizQuery.error) return <ErrorPage message={quizQuery.error.message} />;

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
