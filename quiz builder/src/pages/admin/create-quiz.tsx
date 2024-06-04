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
import { QuizOutputSchema } from "../../utils/validations/admin";
import { useNavigate } from "react-router-dom";
import { IComponentProps } from "../../utils/interfaces";
import { useMutation } from "@tanstack/react-query";
import { createQuiz } from "../../api-requests/quiz";

const CreateQuiz = (props: IComponentProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { displayErrors } = props;
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

    if (validQuestions.error) {
      const { formErrors, fieldErrors } = validQuestions.error.flatten();
      const allErrors = [...formErrors, ...Object.values(fieldErrors).flat()];
      displayErrors(allErrors);
      return;
    }
    saveQuizMutation.mutate(validQuestions.data);
  };

  const saveQuizMutation = useMutation({
    mutationFn: createQuiz,
    onSuccess: ({ data }) => {
      dispatch(resetStore());
      navigate(`/quizzes/${data.data.public_id}`);
    },
    onError: (err, _, __) => {
      const message = ApiRequest.extractApiErrors(err);
      displayErrors(message);
    },
  });

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
