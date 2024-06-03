import { useEffect, useState } from "react";
import {
  checkOption,
  clearCheckedOptions,
  removeOption,
  setOption,
} from "../utils/store/slices/question-slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../utils/store";
import { IOptionProps } from "../utils/interfaces";

const SelectGroup = (props: IOptionProps) => {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = () => {
    dispatch(clearCheckedOptions());
    dispatch(
      checkOption({
        optionIndex: props.optionIndex,
        is_right: !checked,
      })
    );
  };

  const questionIndex = useSelector(
    (state: RootState) => state.questions.currentQuestionIndex
  );
  const questionList = useSelector(
    (state: RootState) => state.questions.questionsList
  );
  const optionValue = questionList[questionIndex].options[props.optionIndex];

  useEffect(() => {
    setValue(optionValue.option);
    setChecked(optionValue.is_right);
  });

  return (
    <div>
      <input
        type="radio"
        className="radio-select"
        name="option"
        onChange={handleChange}
        checked={checked}
      />
      <input
        type="text"
        onChange={(e) =>
          dispatch(
            setOption({
              optionIndex: props.optionIndex,
              option: e.target.value,
            })
          )
        }
        value={value}
        className="input-select"
      />
      <p
        className="delete-select"
        onClick={() => dispatch(removeOption(props.optionIndex))}
      >
        X
      </p>
    </div>
  );
};

export default SelectGroup;
