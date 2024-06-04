interface IErrorProps {
  message?: string;
}

const ErrorPage = (props: IErrorProps) => {
  const { message } = props;
  return (
    <section className="centered">
      <h1>{message}</h1>
      <div className="container">
        <div>
          <span className="hidden">Oh No! An error occurred!</span>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
