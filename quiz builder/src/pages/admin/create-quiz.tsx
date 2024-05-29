import { ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../utils/store";
import { setQuestion } from "../../utils/store/slices/question-slice";
import Header from "../../components/header";
import QuestionCard from "../../components/question-card";
import QuizInfo from "../../components/quiz-info";

const CreateQuiz = () => {
  const dispatch = useDispatch<AppDispatch>();
  const questionsList = useSelector(
    (state: RootState) => state.questions.questionsList
  );
  const currentQuestionIndex = useSelector(
    (state: RootState) => state.questions.currentQuestionIndex
  );
  const currentQuestion = questionsList[currentQuestionIndex];

  const handleQuestionInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setQuestion(e.target.value));
  };

  return (
    <div>
      <Header />
      <div className="quiz-dashboard">
        <div className="quiz-entry">
          <QuizInfo questionsList={questionsList} dispatch={dispatch} />
          <QuestionCard
            currentQuestion={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            questionsListLength={questionsList.length}
            handleQuestionInput={handleQuestionInput}
            dispatch={dispatch}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
