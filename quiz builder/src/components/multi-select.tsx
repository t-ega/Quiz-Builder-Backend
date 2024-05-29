import CheckBoxSelectGroup from "./checkbox-select-group";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../utils/store";
import { addOption } from "../utils/store/slices/question-slice";

const MultiSelect = () => {
  const dispatch = useDispatch<AppDispatch>();
  const questionsList = useSelector(
    (state: RootState) => state.questions.questionsList
  );
  const currentQuestion = useSelector(
    (state: RootState) => questionsList[state.questions.currentQuestionIndex]
  );
  const optionsList = currentQuestion.options;

  return (
    <div className="multi-select">
      <div>Select one or more right answer(s)</div>

      {optionsList.map((_, idx) => (
        <CheckBoxSelectGroup key={_.id} optionIndex={idx} />
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

export default MultiSelect;
