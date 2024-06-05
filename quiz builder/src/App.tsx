import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./pages/admin/layout";
import CreateQuiz from "./pages/admin/create-quiz";
import QuizResults from "./pages/admin/results";
import LoginForm from "./components/login-form";
import { Auth } from "./pages/auth/auth";
import SignUpForm from "./components/signup-form";
import Quizzes from "./pages/admin/quizzes";
import QuizOverview from "./pages/admin/quiz-overview";
import { ToastContainer, toast } from "react-toastify";
import EditQuiz from "./pages/admin/edit-quiz";
import PrivateRoute from "./components/private-route";
import QuizEntry from "./pages/client/take-quiz";
import HomePage from "./pages/client/home-page";
import { QuizTestContext } from "./utils/quiz-test.context";
import { IQuizTest } from "./utils/validations/client";
import { useState } from "react";
import NotFound from "./pages/errors/404";

function App() {
  const displayErrors = (errors: string[] | string) => {
    if (Array.isArray(errors)) {
      errors?.map((error) => toast.error(error));
      return;
    }
    toast.error(`❌${errors}`);
  };

  const [quizData, setQuizData] = useState<IQuizTest | null>(null);

  return (
    <div className="main">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <BrowserRouter>
        <QuizTestContext.Provider value={quizData}>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Layout />}>
                <Route
                  index
                  element={<Quizzes displayErrors={displayErrors} />}
                />
                <Route
                  path="results"
                  element={<QuizResults displayErrors={displayErrors} />}
                />
                <Route path="quizzes">
                  <Route
                    index
                    element={<Quizzes displayErrors={displayErrors} />}
                  />

                  <Route
                    path="new"
                    element={<CreateQuiz displayErrors={displayErrors} />}
                  />
                  <Route
                    path=":quizId"
                    element={<QuizOverview displayErrors={displayErrors} />}
                  />
                  <Route
                    path=":quizId/edit"
                    element={<EditQuiz displayErrors={displayErrors} />}
                  />
                </Route>
              </Route>
            </Route>

            <Route
              path=":quizId/start"
              element={<QuizEntry displayErrors={displayErrors} />}
            ></Route>
            <Route
              path=":quizId"
              element={<HomePage setQuizData={setQuizData} />}
            ></Route>
            <Route path="auth" element={<Auth />}>
              <Route
                path="login"
                element={<LoginForm displayErrors={displayErrors} />}
              />
              <Route
                path="signup"
                element={<SignUpForm displayErrors={displayErrors} />}
              />
            </Route>
            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </QuizTestContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
