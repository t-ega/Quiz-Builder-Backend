interface IErrorProps {
  message?: string;
  errors?: string[];
}

const ErrorCard = (props: IErrorProps) => {
  return (
    <div className="error-card">
      <h3>Error</h3>
      {props.errors && props.errors.length > 0 && (
        <ul>
          {props.errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ErrorCard;
