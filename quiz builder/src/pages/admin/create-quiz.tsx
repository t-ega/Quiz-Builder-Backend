import { ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../utils/store";
import {
  resetStore,
  setQuestion,
} from "../../utils/store/slices/question-slice";
import QuestionCard from "../../components/question-card";
import QuizInfo from "../../components/quiz-info";
import ApiRequest from "../../utils/api-request";
import { ENDPOINTS } from "../../utils/endpoints";
import { QuizOutputSchema } from "../../utils/validations/admin";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateQuiz = () => {
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

  const save = async () => {
    const validQuestions = QuizOutputSchema.safeParse(quiz);

    if (!validQuestions.success) {
      const { formErrors, fieldErrors } = validQuestions.error.flatten();
      const allErrors = [...formErrors, ...Object.values(fieldErrors).flat()];
      console.log(validQuestions.error.errors);
      displayErrors(allErrors);
      return;
    }

    console.log("Validation data: ", validQuestions.data);

    try {
      const response = await ApiRequest.post(
        ENDPOINTS.ADMIN_QUIZ,
        validQuestions.data
      );
      const { data } = response.data;
      // Clear the redux store
      dispatch(resetStore());
      navigate(`/quizzes/${data.public_id}`);
    } catch (error: any) {
      if (error.response && error.response.data) {
        displayErrors(error.response.data.message);
        displayErrors(error.response.data.errors);
        return;
      }

      displayErrors(error.message);
    }
  };

  const displayErrors = (errors: string[] | string) => {
    if (Array.isArray(errors)) {
      errors?.map((error) => toast.error(error));
      return;
    }
    toast.error(errors);
  };

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

export default CreateQuiz;
