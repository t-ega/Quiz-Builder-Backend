import { createContext } from "react";
import { IQuizTest } from "./validations/client";

export const QuizTestContext = createContext<IQuizTest | null>(null);
export const AuthContext = createContext<{ username: string }>({
  username: "",
});
