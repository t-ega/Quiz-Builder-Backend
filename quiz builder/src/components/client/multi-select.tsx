import { IQuizTestOption } from "../../utils/validations/client";

interface IOptionChoice {
  options: IQuizTestOption;
  checkOption: (optionIndex: number, checked: boolean) => void;
}

const MultiSelect = (props: IOptionChoice) => {
  return (
    <div className="multi-select">
      <div>Select the right answer</div>

      {props.options.map((option, idx) => (
        <div key={idx} style={{ justifyContent: "start" }}>
          <input
            type="checkbox"
            className="radio-select"
            name="option"
            onChange={() => props.checkOption(idx, !option.selected)}
            checked={option.selected}
          />
          <p style={{ textTransform: "capitalize" }}>{option.option}</p>
        </div>
      ))}
    </div>
  );
};

export default MultiSelect;
