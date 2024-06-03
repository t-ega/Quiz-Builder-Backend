import { DataGrid, GridEventListener } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import apiRequest from "../../utils/api-request";
import { ENDPOINTS } from "../../utils/endpoints";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios, { CancelToken } from "axios";

const columns = [
  { field: "title", headerName: "Title", width: 150 },
  { field: "candidates", headerName: "Invitees" },
  { field: "public_id", headerName: "Id", width: 150 },
  { field: "status", headerName: "Status" },
  { field: "last_activity", headerName: "Last Activity" },
  { field: "permalink", headerName: "Permalink" },
  { field: "created_at", headerName: "Date created" },
];

const cache = {
  quizzes: null,
};

const Quizzes = () => {
  const [rows, setRows] = useState<{}[]>([]);
  const navigate = useNavigate();

  const fetchQuizzes = (cancelToken: CancelToken) => {
    const cached = cache.quizzes;
    if (cached) {
      setRows(cached);
      return;
    }

    apiRequest
      .get(ENDPOINTS.ADMIN_QUIZ, cancelToken)
      .then((res) => {
        if (res) {
          cache.quizzes = res.data.data;
          setRows(res.data.data);
        }
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          displayError(error.response.data.message);
          displayError(error.response.data.errors);
          return;
        }

        displayError(error.message);
      });
  };

  const displayError = (errors: string[] | string) => {
    if (Array.isArray(errors)) {
      errors.map((e) => toast.error(e));
      return;
    }
    toast.error(errors);
  };

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    navigate(`quizzes/${params.row.public_id}`);
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    fetchQuizzes(source.token);
    return () => source.cancel();
  }, []);

  return (
    <div className="quizzes-overview">
      <div className="new-quiz">
        <Link to={"/quizzes/new"}>
          <button>Create New Quiz</button>
        </Link>
      </div>

      <DataGrid
        rows={rows}
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
