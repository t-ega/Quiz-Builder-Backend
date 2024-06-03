import { DataGrid, GridColDef } from "@mui/x-data-grid";
import apiRequest from "../../utils/api-request";
import { ENDPOINTS } from "../../utils/endpoints";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";

const columns: GridColDef[] = [
  { field: "title", headerName: "Title", width: 140 },
  { field: "duration", headerName: "Duration", width: 130 },
  { field: "opens at", headerName: "Opens At", width: 130 },
  {
    field: "closes_at",
    headerName: "Closes At",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
  },
  {
    field: "public_id",
    headerName: "Public ID",
    type: "number",
    width: 150,
  },
  {
    field: "permalink",
    headerName: "Url",
    sortable: false,
    width: 160,
  },
  {
    field: "created_at",
    headerName: "Created At",
    sortable: false,
    width: 160,
  },
  {
    field: "updated_at",
    headerName: "Updated At",
    sortable: false,
    width: 160,
  },
];

const QuizResults = () => {
  const [rows, setRows] = useState<{}[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const fetchQuizResults = async () => {
    try {
      const response = await apiRequest.get(ENDPOINTS.ADMIN_QUIZ);
      setRows(response.data.data);
      setLoading(false);
    } catch (error: any) {
      if (error.response && error.response.data) {
        setErrorMessages([
          error.response.data.message,
          error.response.data.errors,
        ]);
        return;
      }
      setErrorMessages(error.message);

      displayError();
    }
  };

  const displayError = () => {
    setError(true);

    setTimeout(() => {
      setError(false);
      setErrorMessages([]);
    }, 10000);
  };

  useEffect(() => {
    fetchQuizResults();
  }, []);

  return (
    <div className="quiz-dashboard">
      <h2>Results</h2>
      <div style={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          sx={{ minHeight: "200px" }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
        />
      </div>
    </div>
  );
};

export default QuizResults;
