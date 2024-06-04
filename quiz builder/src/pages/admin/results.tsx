import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ApiRequest from "../../utils/api-request";
import { ENDPOINTS } from "../../utils/endpoints";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import { IComponentProps } from "../../utils/interfaces";
import axios, { CancelToken } from "axios";

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

const QuizResults = (props: IComponentProps) => {
  const { displayErrors } = props;
  const [rows, setRows] = useState<{}[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuizResults = async (cancelToken: CancelToken) => {
    try {
      const response = await ApiRequest.get(ENDPOINTS.ADMIN_QUIZ, cancelToken);
      if (!response) return;
      setRows(response.data.data);
      setLoading(false);
    } catch (error: any) {
      const message = ApiRequest.extractApiErrors(error);
      displayErrors(message);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    fetchQuizResults(source.token);
    return () => source.cancel();
  }, []);

  return (
    <div className="quiz-dashboard">
      <h2>Results</h2>
      <div style={{ width: "100%" }}>
        {loading ? (
          <Loader />
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default QuizResults;
