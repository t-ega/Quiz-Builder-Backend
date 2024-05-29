import React from "react";
import { setCurrentQuestionIndex } from "../utils/store/slices/question-slice";
import { QuizInfoProps } from "../utils/interfaces";

const QuizInfo: React.FC<QuizInfoProps> = ({ questionsList, dispatch }) => {
  return (
    <div>
      <div className="quiz-info">
        <h2>Quiz Title</h2>
        <input type="text" className="quiz-title" />
      </div>
      <div className="quiz-info">
        <h2>Test Duration</h2>
        <select className="quiz-duration">
          <option>10 min</option>
          <option>30 min</option>
          <option>40 min</option>
          <option>1 hr</option>
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
