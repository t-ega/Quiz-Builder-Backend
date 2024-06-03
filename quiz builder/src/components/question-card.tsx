import { ChangeEvent } from "react";
import { AppDispatch } from "../utils/store";
import { QUESTION_TYPES, Question } from "../utils/interfaces";
import {
  addQuestion,
  removeQuestion,
  setCurrentQuestionIndex,
  setQuestionType,
} from "../utils/store/slices/question-slice";
import MultiSelect from "./multi-select";
import MultipleChoice from "./multiple-choice";
import SingleSelect from "./single-select";

interface IQuestionCardProps {
  currentQuestion: any;
  currentQuestionIndex: number;
  questionsList: Question[];
  questionsListLength: number;
  save: () => void;
  handleQuestionInput: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  dispatch: AppDispatch;
}

const QuestionCard = (props: IQuestionCardProps) => {
  const {
    currentQuestion,
    currentQuestionIndex,
    questionsListLength,
    handleQuestionInput,
    dispatch,
    save,
  } = props;

  return (
    <div className="question-card">
      <div className="question-header">
        {currentQuestionIndex > 0 && (
          <div
            className="navigate"
            onClick={() =>
              dispatch(setCurrentQuestionIndex(currentQuestionIndex - 1))
            }
          >
            <i className="fa-solid fa-plus"></i>Previous Question
          </div>
        )}
        <p>Question {currentQuestionIndex + 1}</p>
        {questionsListLength <= 9 && (
          <div
            className="navigate"
            onClick={() => {
              dispatch(addQuestion());
              dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1));
            }}
          >
            <i className="fa-solid fa-plus"></i>Add Question
          </div>
        )}
      </div>

      <textarea
        className="question-content"
        value={currentQuestion.question}
        onChange={handleQuestionInput}
        placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus"
      ></textarea>

      <div className="question-choice">
        <div
          className={`question-type ${
            currentQuestion.type === QUESTION_TYPES.SELECT_MULTIPLE
              ? "active"
              : ""
          }`}
          onClick={() =>
            dispatch(setQuestionType(QUESTION_TYPES.SELECT_MULTIPLE))
          }
          data-question-type="SELECT"
        >
          Select Multiple Options
        </div>

        <div
          className={`question-type ${
            currentQuestion.type === QUESTION_TYPES.MULTIPLE_CHOICES
              ? "active"
              : ""
          }`}
          onClick={() =>
            dispatch(setQuestionType(QUESTION_TYPES.MULTIPLE_CHOICES))
          }
          data-question-type="MULTI_CHOICE"
        >
          Multi Choice
        </div>

        <div
          className={`question-type ${
            currentQuestion.type === QUESTION_TYPES.SINGLE_CHOICE
              ? "active"
              : ""
          }`}
          onClick={() =>
            dispatch(setQuestionType(QUESTION_TYPES.SINGLE_CHOICE))
          }
          data-question-type="SINGLE"
        >
          Single
        </div>
      </div>

      {currentQuestion.type === QUESTION_TYPES.SINGLE_CHOICE && (
        <SingleSelect />
      )}
      {currentQuestion.type === QUESTION_TYPES.MULTIPLE_CHOICES && (
        <MultipleChoice />
      )}
      {currentQuestion.type === QUESTION_TYPES.SELECT_MULTIPLE && (
        <MultiSelect />
      )}

      <div className="question-footer">
        {currentQuestionIndex > 0 && (
          <button
            onClick={() => {
              dispatch(removeQuestion(currentQuestionIndex));
              dispatch(setCurrentQuestionIndex(currentQuestionIndex - 1));
            }}
          >
            Delete Question
          </button>
        )}
        <button onClick={save}>Save Quiz</button>
      </div>
    </div>
  );
};

export default QuestionCard;
