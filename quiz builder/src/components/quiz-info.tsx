import React, { ChangeEvent } from "react";
import {
  setCurrentQuestionIndex,
  setDuration,
  setTitle,
} from "../utils/store/slices/question-slice";
import { QuizInfoProps } from "../utils/interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../utils/store";

const QuizInfo: React.FC<QuizInfoProps> = ({ questionsList, dispatch }) => {
  const handleTitleInput = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitle(e.target.value));
  };

  const quiz = useSelector((state: RootState) => state.questions);

  const handleDurationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(setDuration(e.target.value));
  };

  return (
    <div>
      <div className="quiz-info">
        <h2>Quiz Title</h2>
        <input
          type="text"
          className="quiz-title"
          onChange={handleTitleInput}
          required
          value={quiz.title}
        />
      </div>
      <div className="quiz-info">
        <h2>Test Duration</h2>
        <select
          className="quiz-duration"
          value={quiz.duration}
          defaultValue={""}
          onChange={handleDurationChange}
        >
          <option value={""}>None</option>
          <option value={"10"}>10 mintues</option>
          <option value={"20"}>20 minutes</option>
          <option value={"30"}>30 minutes</option>
          <option value={"40"}>40 minutes</option>
          <option value={"60"}>1 hour</option>
        </select>
      </div>
      <div className="quiz-info">
        <h2>All Questions</h2>
        <div className="questions">
          {questionsList.map((_, idx) => (
            <p
              key={idx}
              className="question-number"
              onClick={() => dispatch(setCurrentQuestionIndex(idx))}
            >
              {idx + 1}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizInfo;
