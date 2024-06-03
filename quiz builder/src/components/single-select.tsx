import { useEffect, useState } from "react";
import {
  checkOption,
  clearCheckedOptions,
  setOption,
} from "../utils/store/slices/question-slice";
import { AppDispatch, RootState } from "../utils/store";
import { useDispatch, useSelector } from "react-redux";

const SingleSelect = () => {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);

  const [value2, setValue2] = useState("");
  const [checked2, setChecked2] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const questionIndex = useSelector(
    (state: RootState) => state.questions.currentQuestionIndex
  );
  const questionList = useSelector(
    (state: RootState) => state.questions.questionsList
  );
  const options = questionList[questionIndex].options;

  const handleChange = (checked: boolean, optionIndex: number) => {
    dispatch(clearCheckedOptions());
    dispatch(
      checkOption({
        optionIndex: optionIndex,
        is_right: !checked,
      })
    );
  };

  useEffect(() => {
    setValue(options[0].option);
    setChecked(options[0].is_right);
    setValue2(options[1].option);
    setChecked2(options[1].is_right);
  });

  return (
    <div className="multi-select">
      <div>Select the right answer</div>
      <div>
        <input
          type="radio"
          checked={checked}
          onChange={() => handleChange(checked, 0)}
          className="radio-select"
          name="option"
        />
        <input
          type="text"
          onChange={(e) =>
            dispatch(
              setOption({
                optionIndex: 0,
                option: e.target.value,
              })
            )
          }
          value={value}
          placeholder="True"
          className="input-select"
        />
      </div>
      <div>
        <input
          type="radio"
          onChange={() => handleChange(checked2, 1)}
          className="radio-select"
          name="option"
          checked={checked2}
        />
        <input
          type="text"
          placeholder="False"
          onChange={(e) =>
            dispatch(
              setOption({
                optionIndex: 1,
                option: e.target.value,
              })
            )
          }
          value={value2}
          className="input-select"
        />
      </div>
    </div>
  );
};

export default SingleSelect;
