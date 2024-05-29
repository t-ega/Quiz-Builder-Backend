import { useEffect, useState } from "react";

const QuizEntry = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [totalTime, setTotalTime] = useState("");
  const [limitedTimeLeft, setLimitedTimeLeft] = useState(false);

  const deadline = "May, 29, 2024 03:59:15";

  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.parse(deadline) - Date.now();
      setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((time / 1000 / 60) % 60));
      setSeconds(Math.floor((time / 1000) % 60));

      if (time < 60000 && !limitedTimeLeft) {
        setLimitedTimeLeft(true);
      }

      if (time <= 3) {
        clearInterval(interval);
      }
    }, 1000);

    const total = new Date(deadline);
    const totalHours = total.getHours().toString().padStart(2, "0");
    const totalMinutes = total.getMinutes().toString().padStart(2, "0");
    const totalSeconds = total.getSeconds().toString().padStart(2, "0");

    const formattedTime = totalHours + ":" + totalMinutes + ":" + totalSeconds;
    setTotalTime(formattedTime);
    setLimitedTimeLeft(false);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div>
        <div className="header">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="50"
            height="50"
            viewBox="0 0 50 50"
          >
            <path d="M 18 5 C 15.239 5 13 7.239 13 10 L 13 11 L 32.5 11 C 36.09 11 39 13.91 39 17.5 L 39 27.5 C 39 29.433 37.433 31 35.5 31 L 22.5 31 C 20.567 31 19 29.433 19 27.5 L 19 21 L 15 21 C 13.895 21 13 21.895 13 23 L 13 32 C 13 34.761 15.239 37 18 37 L 40 37 C 42.761 37 45 34.761 45 32 L 45 10 C 45 7.239 42.761 5 40 5 L 18 5 z M 10 13 C 7.239 13 5 15.239 5 18 L 5 40 C 5 42.761 7.239 45 10 45 L 32 45 C 34.761 45 37 42.761 37 40 L 37 39 L 17.5 39 C 13.91 39 11 36.09 11 32.5 L 11 22.5 C 11 20.567 12.567 19 14.5 19 L 27.5 19 C 29.433 19 31 20.567 31 22.5 L 31 29 L 35 29 C 36.105 29 37 28.105 37 27 L 37 18 C 37 15.239 34.761 13 32 13 L 10 13 z"></path>
          </svg>
          <div>
            <h3>General Knoweldge Test</h3>
            <p>Novagenuiis technologies</p>
          </div>
        </div>
        <div className="quiz-entry">
          <div>
            <div className="quiz-info">
              <h2>Quiz Title</h2>
              <p>Introduction to data science</p>
            </div>
            <div className="quiz-info">
              <h2>Time left</h2>
              <p className={limitedTimeLeft ? "limited-time" : ""}>
                {hours}:{minutes}:{seconds} / {totalTime}
              </p>
            </div>
            <div className="quiz-info">
              <h2>All Questions</h2>
              <div className="questions">
                <p className="question-number">1</p>
                <p className="question-number">2</p>
                <p className="question-number">3</p>
                <p className="question-number">4</p>
                <p className="question-number">5</p>
                <p className="question-number">6</p>
                <p className="question-number">7</p>
                <p className="question-number">8</p>
                <p className="question-number">9</p>
                <p className="question-number">10</p>
              </div>
            </div>
          </div>
          <div className="question-card">
            <div className="question-header">
              <div className="navigate">
                <i className="fa-solid fa-arrow-left"></i>Previous
              </div>
              <p>Question 1</p>
              <div className="navigate">
                Next <i className="fa-solid fa-arrow-right"></i>
              </div>
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
              adipisci, aliquam quo amet id dolore alias! Sunt impedit numquam
              eos laudantium in tempore aliquid iure, ex autem earum dolores
              laborum!
            </p>
            <div className="options">
              <div>
                <input type="radio" name="option" value={"0"} />
                <label htmlFor="radio">Select 1</label>
              </div>
              <div>
                <input type="radio" id="option1" name="option" value={"0"} />
                <label htmlFor="option1">Select 1</label>
              </div>
              <div>
                <input type="radio" id="option2" name="option" value={"0"} />
                <label htmlFor="option2">Select 1</label>
              </div>
              <div>
                <input type="radio" id="option3" name="option" value={"0"} />
                <label htmlFor="option3">Select 1</label>
              </div>
            </div>
            <div className="question-footer">
              <button>Submit Quiz</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizEntry;
