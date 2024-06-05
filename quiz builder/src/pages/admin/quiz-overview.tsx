import React, { useEffect, useState } from "react";
import { Card } from "../../components/card";
import ApiRequest from "../../utils/api-request";
import {
  QuizFlattenedErrors,
  QuizInviteSchema,
} from "../../utils/validations/admin";
import { toast } from "react-toastify";
import Loader from "../../components/loader";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CardHeader from "../../components/card-header";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  IComponentProps,
  IQuiz,
  KeyValuePair,
  QuizStatus,
} from "../../utils/interfaces";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import {
  deleteQuiz,
  fetchQuizDetails,
  fetchQuizEntries,
  sendInvites,
  updateQuiz,
} from "../../api-requests/quiz";
import ErrorPage from "../errors/error";
import LoadingButton from "../../components/loading-button";
import { formatDate } from "../../utils/format-date";

const columns: GridColDef[] = [
  { field: "participant_email", headerName: "Email", width: 150 },
  {
    field: "created_at",
    headerName: "Invited On",
    width: 200,
    valueFormatter: (params: string) => formatDate(params),
  },
  {
    field: "score",
    headerName: "Score",
    valueFormatter: (params: string) => (params !== null ? params : "Nil"),
  },
  {
    field: "taken_at",
    headerName: "Taken at",
    width: 200,
    valueFormatter: (params: string) =>
      params ? formatDate(params) : "No attempt yet",
  },
];

const QuizOverview = (props: IComponentProps) => {
  const { displayErrors } = props;
  const [validationErrors, setValidationErrors] =
    useState<QuizFlattenedErrors>();
  const [quiz, setQuiz] = useState<IQuiz>();
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();
  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const { quizId } = useParams();
  const [formattedDate, setFormattedDate] = useState("");
  const queryClient = useQueryClient();

  const inviteMutation = useMutation({
    mutationKey: ["quiz", "invites", quizId],
    mutationFn: sendInvites,
    onSuccess: () => {
      toast.success("📩 Invite sent!");
      setInput({ email: "", firstName: "", lastName: "" });
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
    },
    onError: (err, _, ctx) => {
      const message = ApiRequest.extractApiErrors(err);
      displayErrors(message);
    },
  });

  const deleteMutation = useMutation({
    mutationKey: ["quiz", "delete", quizId],
    mutationFn: deleteQuiz,
    onSuccess: () => {
      navigate("/quizzes");
      toast.success("🎉 Quiz Deleted Successfuly!");
      // queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
    onError: (err, _, ctx) => {
      const message = ApiRequest.extractApiErrors(err);
      displayErrors(message);
    },
  });

  const updateQuizStatusMutation = useMutation({
    mutationKey: ["quiz", "update", "status", quizId],
    mutationFn: updateQuiz,
    onSuccess: ({ data }) => {
      toast.success("🎉 Quiz Status Updated Successfuly!");
      setQuiz(data.data);
    },
    onError: (err, _, ctx) => {
      const message = ApiRequest.extractApiErrors(err);
      displayErrors(message);
    },
  });

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const processInvites = async () => {
    if (
      quiz?.status === QuizStatus.ARCHIVED ||
      quiz?.status === QuizStatus.DRAFT
    ) {
      displayErrors("🤡 You need to publish quiz first before sending invite.");
      return;
    }

    const data = QuizInviteSchema.safeParse(input);

    if (data.error) {
      setValidationErrors(data.error?.flatten());
      const { formErrors, fieldErrors } = data.error.flatten();
      const allErrors = [...formErrors, ...Object.values(fieldErrors).flat()];
      displayErrors(allErrors);
      return;
    }

    setValidationErrors(undefined);

    inviteMutation.mutate({
      email: input.email,
      first_name: input.firstName,
      last_name: input.lastName,
      quizId: quizId!,
    });
  };

  const handleDeleteQuiz = () => {
    if (
      !confirm(
        "Are you sure you want to delete? This action cannot be reversed!"
      )
    )
      return;

    deleteMutation.mutate(quizId!);
  };

  const copyPublicLink = () => {
    if (quiz?.permalink) {
      const permalink = `${window.location.protocol}/${window.location.host}/${quiz.permalink}`;
      navigator.clipboard.writeText(permalink);
      toast.success("Link copied");
    }
  };

  const renderActionButton = (
    buttonText: string,
    handleClick: () => void,
    styles?: KeyValuePair
  ) => {
    if (updateQuizStatusMutation.isPending) {
      return <LoadingButton styles={styles} />;
    }

    return (
      <button
        className="action-btn filled"
        style={styles}
        onClick={handleClick}
      >
        {buttonText}
      </button>
    );
  };

  const handleStatusUpdate = (status: "publish" | "archive") => {
    const message =
      status === "publish"
        ? "Are you sure. Once a quiz is published it cannot be edited!"
        : "Are you sure. Once a quiz is archived the public link would become inactive!";

    if (!confirm(message)) return;

    updateQuizStatusMutation.mutate({ status, quizId: quizId! });
  };

  const [quizEntriesQuery, quizQuery] = useQueries({
    queries: [
      {
        queryKey: ["quiz", quizId],
        queryFn: () => fetchQuizEntries(quizId!),
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ["quiz", "details", quizId],
        queryFn: () => fetchQuizDetails(quizId!),
        staleTime: 1000 * 60 * 5,
      },
    ],
  });

  useEffect(() => {
    const response = quizQuery.data;
    if (response) {
      setQuiz(response.data);
      const date = formatDate(response.data.created_at);
      setFormattedDate(date);
    }
  }, [quizQuery.data]);

  useEffect(() => {
    const response = quizEntriesQuery.data;
    if (response) {
      setEntries(response.data);
    }
  }, [quizEntriesQuery.data]);

  if (quizEntriesQuery.isLoading) return <Loader />;
  if (quizEntriesQuery.isError)
    return <ErrorPage message={quizEntriesQuery.error.message} />;

  return (
    <>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            marginRight: "10px",
          }}
        >
          {quiz?.status === QuizStatus.PUBLISHED && (
            <div>
              {renderActionButton("Archive", () =>
                handleStatusUpdate("archive")
              )}
            </div>
          )}

          {(quiz?.status === QuizStatus.DRAFT ||
            quiz?.status === QuizStatus.ARCHIVED) && (
            <div>
              {renderActionButton("Publish", () =>
                handleStatusUpdate("publish")
              )}
            </div>
          )}

          <div>
            {quiz?.status === QuizStatus.DRAFT && (
              <Link to={`edit`}>
                <button className="action-btn">Edit</button>
              </Link>
            )}
            {deleteMutation.isPending ? (
              <LoadingButton styles={{ backgroundColor: "red" }} />
            ) : (
              <button
                className="action-btn filled"
                style={{
                  border: "2px solid red",
                  backgroundColor: "red",
                  color: "white",
                }}
                onClick={() => handleDeleteQuiz()}
              >
                Delete
              </button>
            )}
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
                {quiz?.duration && `${quiz.duration} mins | `}{" "}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <h4 style={{ margin: "0px" }}>Created:</h4>
                  {formattedDate}
                </div>
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
                    validationErrors?.fieldErrors?.first_name ? "error" : ""
                  }`}
                  placeholder="First Name"
                />
                <input
                  type="text"
                  name="lastName"
                  value={input.lastName}
                  onChange={handleInput}
                  className={`input-control ${
                    validationErrors?.fieldErrors?.last_name ? "error" : ""
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
                  {inviteMutation.isPending ? (
                    <LoadingButton
                      className="action-btn input-control loading"
                      styles={{ flex: 0 }}
                    />
                  ) : (
                    <button
                      onClick={() => processInvites()}
                      className={`action-btn input-control ${
                        quiz?.status === QuizStatus.DRAFT ? "disabled" : ""
                      }`}
                      style={{ flex: 0 }}
                    >
                      Invite
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <h2>Candidates</h2>
          </CardHeader>

          <DataGrid
            rows={entries}
            sx={{ minHeight: "200px" }}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        </Card>
      </div>
    </>
  );
};

export default QuizOverview;
