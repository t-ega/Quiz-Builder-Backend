import ApiRequest from "../utils/api-request";
import { ENDPOINTS } from "../utils/endpoints";

interface ILogin {
  email: string;
  password: string;
}

export const login = async (data: ILogin) => {
  return await ApiRequest.post(ENDPOINTS.LOGIN, data);
};

interface ISignup {
  username: string;
  email: string;
  password: string;
}

export const signup = async (data: ISignup) => {
  return await ApiRequest.post(ENDPOINTS.SIGNUP, data);
};
