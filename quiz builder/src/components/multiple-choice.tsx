import { useDispatch, useSelector } from "react-redux";
import SelectGroup from "./radio-select-group";
import { AppDispatch, RootState } from "../utils/store";
import { addOption } from "../utils/store/slices/question-slice";

const MultipleChoice = () => {
  const dispatch = useDispatch<AppDispatch>();

  const questionsList = useSelector(
    (state: RootState) => state.questions.questionsList
  );
  const currentQuestionIndex = useSelector(
    (state: RootState) => state.questions.currentQuestionIndex
  );
  const currentQuestion = questionsList[currentQuestionIndex];
  const optionsList = currentQuestion.options;

  return (
    <div className="multi-select">
      <div>Select the right answer</div>

      {optionsList.map((_, idx) => (
        <SelectGroup optionIndex={idx} key={_.id} />
      ))}

      {optionsList.length < 5 && (
        <div>
          <button className="add-select" onClick={() => dispatch(addOption())}>
            Add an option
          </button>
        </div>
      )}
    </div>
  );
};

export default MultipleChoice;
