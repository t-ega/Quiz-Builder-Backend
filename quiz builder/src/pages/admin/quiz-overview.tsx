import React, { useEffect, useState } from "react";
import { Card } from "../../components/card";
import { ENDPOINTS } from "../../utils/endpoints";
import ApiRequest from "../../utils/api-request";
import {
  QuizFlattenedErrors,
  QuizInviteSchema,
} from "../../utils/validations/admin";
import { toast } from "react-toastify";
import Loader from "../../components/loader";
import { DataGrid } from "@mui/x-data-grid";
import CardHeader from "../../components/card-header";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios, { CancelToken } from "axios";
import { IQuiz, QuizStatus } from "../../utils/interfaces";

const columns = [
  { field: "title", headerName: "Name" },
  { field: "candidates", headerName: "Invited On" },
  { field: "last_activity", headerName: "Score" },
  { field: "created_at", headerName: "Status" },
];

const QuizOverview = () => {
  const [validationErrors, setValidationErrors] =
    useState<QuizFlattenedErrors>();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<IQuiz>();
  const navigate = useNavigate();
  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const { quizId } = useParams();
  const quizUrl = `${ENDPOINTS.ADMIN_QUIZ}/${quizId}`;
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const displayErrors = (errors: string[] | string) => {
    if (Array.isArray(errors)) {
      errors?.map((error) => toast.error(error));
      return;
    }
    toast.error(errors);
  };

  const sendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(quiz);

    if (!quiz?.permalink) {
      toast.error("You need to publish quiz first before sending invite!");
      return;
    }

    const data = QuizInviteSchema.safeParse(input);

    if (data.error) {
      setValidationErrors(data.error?.flatten());
      return;
    }

    const url = `${quizUrl}/invite`;

    // backend expects an array of invites
    ApiRequest.post(url, { invites: [data.data] })
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          displayErrors([
            error.response.data.message,
            error.response.data.errors,
          ]);
          return;
        }

        displayErrors(error.message);
      });
  };

  const deleteQuiz = () => {
    ApiRequest.delete(quizUrl)
      .then((res) => {
        toast.success(res.data.message);
        navigate("/quizzes");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          displayErrors([
            error.response.data.message,
            error.response.data.errors,
          ]);
          return;
        }

        displayErrors(error.message);
      });
  };

  const fetchQuizDetails = async (cancelToken?: CancelToken) => {
    try {
      const response = await ApiRequest.get(quizUrl, cancelToken);

      if (response) {
        setQuiz(response.data.data);
        setLoading(false);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        displayErrors([
          error.response.data.message,
          error.response.data.errors,
        ]);
        // Navigate if any error
        navigate("/quizzes");
        return;
      }
      displayErrors(error.message);
      // Navigate if any error
      navigate("/quizzes");
    }
  };

  const copyPublicLink = () => {
    if (quiz?.permalink) {
      navigator.clipboard.writeText(quiz?.permalink);
      toast.success("Link copied");
    }
  };

  const updateQuizStatus = () => {
    ApiRequest.put(quizUrl, { status: "publish" })
      .then((res) => {
        toast.success(res.data.message);
        setQuiz(res.data.quiz);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          displayErrors(error.response.data.message);
          displayErrors(error.response.data.errors);
          return;
        }

        displayErrors(error.message);
      });
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    fetchQuizDetails(source.token);
    return () => {
      source.cancel();
    };
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                marginRight: "10px",
              }}
            >
              <div>
                <button
                  className="action-btn filled"
                  onClick={() => updateQuizStatus()}
                >
                  Publish
                </button>
              </div>
              <div>
                {quiz?.status === QuizStatus.DRAFT && (
                  <Link to={`edit`}>
                    <button className="action-btn">Edit</button>
                  </Link>
                )}
                <button
                  className="action-btn"
                  style={{
                    border: "2px solid red",
                    backgroundColor: "red",
                    color: "white",
                  }}
                  onClick={() => deleteQuiz()}
                >
                  Delete
                </button>
              </div>
            </div>
            <Card>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h2 style={{ textTransform: "capitalize" }}>{quiz?.title}</h2>
                  <div>
                    {quiz?.duration && `${quiz.duration} mins`} |{" "}
                    {quiz?.created_at}
                  </div>
                </div>
                <div className="quiz-status">{quiz?.status}</div>
              </div>
            </Card>
            <Card>
              <CardHeader>
                <h2>Invite Candidates</h2>
                <span>
                  (Only available for <em>published</em> quiz)
                </span>
              </CardHeader>
              <div className="invite">
                <div className="left">
                  <h4>By public link</h4>
                  <div className="invite-details">
                    <p>General Public link</p>

                    <button
                      onClick={() => copyPublicLink()}
                      className={`action-btn ${
                        quiz?.status === QuizStatus.DRAFT ? "disabled" : ""
                      }`}
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
                <div className="right">
                  <h4>By email</h4>
                  <form onSubmit={sendInvite}>
                    <div
                      style={{
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        name="firstName"
                        value={input.firstName}
                        onChange={handleInput}
                        className={`input-control ${
                          validationErrors?.fieldErrors?.first_name
                            ? "error"
                            : ""
                        }`}
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={input.lastName}
                        onChange={handleInput}
                        className={`input-control ${
                          validationErrors?.fieldErrors?.last_name
                            ? "error"
                            : ""
                        }`}
                        placeholder="Last Name"
                      />
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <input
                          type="email"
                          name="email"
                          value={input.email}
                          onChange={handleInput}
                          className={`input-control ${
                            validationErrors?.fieldErrors?.email ? "error" : ""
                          }`}
                          placeholder="Email *"
                          required
                        />
                        <button
                          className={`action-btn input-control ${
                            quiz?.status === QuizStatus.DRAFT ? "disabled" : ""
                          }`}
                          style={{ flex: 0 }}
                        >
                          Invite
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <h2>Candidates</h2>
              </CardHeader>

              <DataGrid
                rows={[]}
                sx={{ minHeight: "200px" }}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
              />
            </Card>
          </div>
        </>
      )}
    </>
  );
};

export default QuizOverview;
