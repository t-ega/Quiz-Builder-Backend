import { KeyValuePair } from "../utils/interfaces";

interface IButtonProps {
  styles?: KeyValuePair;
  className?: string;
}

const LoadingButton = (props?: IButtonProps) => {
  return (
    <button
      className={`${props?.className ? props.className : "buttonload"}`}
      style={props?.styles}
    >
      <i className="fa fa-circle-o-notch fa-spin"></i>Loading
    </button>
  );
};

export default LoadingButton;
