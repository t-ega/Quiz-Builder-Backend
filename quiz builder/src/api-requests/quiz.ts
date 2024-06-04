import ApiRequest from "../utils/api-request";
import { ENDPOINTS } from "../utils/endpoints";

export const getQuizzess = async () => {
  return await ApiRequest.get(ENDPOINTS.ADMIN_QUIZ).then((resp) => {
    if (!resp) return;
    return resp.data;
  });
};

export const fetchQuizEntries = async (quizId: string) => {
  const url = `${ENDPOINTS.ADMIN_QUIZ}/${quizId}/entries`;
  return await ApiRequest.get(url).then((resp) => {
    if (!resp) return;
    return resp.data;
  });
};

export const fetchQuizDetails = async (quizId: string) => {
  const url = `${ENDPOINTS.ADMIN_QUIZ}/${quizId}`;
  return await ApiRequest.get(url).then((resp) => {
    if (!resp) return;
    return resp.data;
  });
};

interface IInvite {
  first_name?: string;
  last_name?: string;
  email: string;
  quizId: String;
}
export const sendInvites = async (data: IInvite) => {
  const { quizId, ...rest } = data;
  const url = `${ENDPOINTS.ADMIN_QUIZ}/${quizId}/invite`;
  return await ApiRequest.post(url, { invites: [rest] });
};

export const deleteQuiz = async (quizId: string) => {
  const url = `${ENDPOINTS.ADMIN_QUIZ}/${quizId}/`;
  return await ApiRequest.delete(url);
};

interface IQuiz {
  status?: "publish" | "archive";
  quizId: String;
}

export const updateQuiz = async (data: IQuiz) => {
  const { quizId, ...rest } = data;
  const url = `${ENDPOINTS.ADMIN_QUIZ}/${quizId}/`;
  return await ApiRequest.put(url, rest);
};

export const createQuiz = async (data: any) => {
  return await ApiRequest.post(ENDPOINTS.ADMIN_QUIZ, data);
};
