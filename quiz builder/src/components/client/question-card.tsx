import { useEffect, useState } from "react";
import { QUESTION_TYPES } from "../../utils/interfaces";
import MultiSelect from "./multi-select";
import MultipleChoice from "./multiple-choice";
import { IQuizTestQuestion } from "../../utils/validations/client";

interface IQuestionCardProps {
  currentQuestionIndex: number;
  currentQuestion: IQuizTestQuestion;
  totalQuestions: number;
  previousQuestion: () => void;
  updateQuestion: (updatedQuestions: IQuizTestQuestion) => void;
  nextQuestion: () => void;
  submit: (skip_confirmation: boolean) => void;
}

const QuestionCard = (props: IQuestionCardProps) => {
  const {
    currentQuestionIndex,
    updateQuestion,
    totalQuestions,
    previousQuestion,
    nextQuestion,
    submit,
  } = props;

  const [currentQuestion, setCurrentQuestion] = useState(props.currentQuestion);

  useEffect(() => {
    setCurrentQuestion(props.currentQuestion);
  }, [props.currentQuestion]);

  const checkOption = (optionIndex: number, checked: boolean) => {
    const newState = { ...currentQuestion };
    if (currentQuestion.type === QUESTION_TYPES.SELECT_MULTIPLE) {
      newState.options[optionIndex].selected = checked;
      updateQuestion(newState);
      return;
    }

    // Unselect all the other options if it's not a select multiple option
    newState.options.map((option) => (option.selected = false));
    newState.options[optionIndex].selected = checked;
    updateQuestion(newState);
  };

  return (
    <div className="question-card">
      <div className="question-header">
        {currentQuestionIndex > 0 && (
          <div className="navigate" onClick={() => previousQuestion()}>
            <i className="fa-solid fa-plus"></i>Previous Question
          </div>
        )}
        <p>Question {currentQuestionIndex + 1}</p>
        {currentQuestionIndex + 1 < totalQuestions && (
          <div className="navigate" onClick={() => nextQuestion()}>
            <i className="fa-solid fa-plus"></i>Next Question
          </div>
        )}
      </div>

      <p style={{ margin: "10px", textTransform: "capitalize" }}>
        {currentQuestion.question}
      </p>

      {(currentQuestion.type === QUESTION_TYPES.MULTIPLE_CHOICES ||
        currentQuestion.type === QUESTION_TYPES.SINGLE_CHOICE) && (
        <MultipleChoice
          checkOption={checkOption}
          options={currentQuestion.options}
        />
      )}

      {currentQuestion.type === QUESTION_TYPES.SELECT_MULTIPLE && (
        <MultiSelect
          checkOption={checkOption}
          options={currentQuestion.options}
        />
      )}

      <div className="question-footer">
        {currentQuestionIndex + 1 < totalQuestions && (
          <button onClick={() => nextQuestion()}>Next Question</button>
        )}
        <button onClick={() => submit(false)}>Submit Quiz</button>
      </div>
    </div>
  );
};

export default QuestionCard;
