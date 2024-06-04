import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { IComponentProps } from "../../utils/interfaces";
import { useQuery } from "@tanstack/react-query";
import { getQuizzess } from "../../api-requests/quiz";
import Loader from "../../components/loader";
import NotFound from "../errors/404";
import { formatDate } from "../../utils/format-date";

const columns: GridColDef[] = [
  { field: "public_id", headerName: "Id", width: 150 },
  { field: "title", headerName: "Title", width: 150 },
  { field: "quiz_entries_count", headerName: "Invitees" },
  { field: "status", headerName: "Status" },
  {
    field: "opens_at",
    headerName: "Opens At",
    valueFormatter: (value: string) => (value ? formatDate(value) : "Not set"),
  },
  {
    field: "closes_at",
    headerName: "Closes At",
    valueFormatter: (value: string) => (value ? formatDate(value) : "Not set"),
  },
  { field: "questions_count", headerName: "Questions" },
  { field: "permalink", headerName: "Permalink" },
  { field: "created_at", headerName: "Date created" },
];

const Quizzes = (props: IComponentProps) => {
  const { displayErrors } = props;
  const navigate = useNavigate();

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    navigate(`/quizzes/${params.row.public_id}`);
  };

  const quizzes = useQuery({
    queryKey: ["quizzes"],
    queryFn: getQuizzess,
  });

  if (quizzes.isLoading) return <Loader />;
  if (quizzes.isError) {
    displayErrors(quizzes.error.message);
    return <NotFound />;
  }

  return (
    <div className="quizzes-overview">
      <div className="new-quiz">
        <Link to={"/quizzes/new"}>
          <button className="action-btn">Create New Quiz</button>
        </Link>
      </div>

      <DataGrid
        rows={quizzes.data?.data}
        sx={{ borderRadius: "20px", minHeight: "200px" }}
        columns={columns}
        onRowClick={handleRowClick}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
};

export default Quizzes;
