import { AppDispatch } from "./store";

export enum QUESTION_TYPES {
  SELECT_MULTIPLE = "MULTI_SELECT",
  SINGLE_CHOICE = "BINARY_CHOICE",
  MULTIPLE_CHOICES = "MULTIPLE_CHOICE",
}

export interface Option {
  id: number;
  option: string;
  is_right: boolean;
  selected?: boolean;
}

export interface Question {
  question: string;
  type: QUESTION_TYPES;
  options: Option[];
}

export interface IComponentProps {
  displayErrors: (err: string[] | string) => void;
}

export interface QuestionsState {
  title: string;
  duration: string | number;
  questionsList: Question[];
  currentQuestionIndex: number;
}

export enum QuizStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export type KeyValuePair = {
  [key: string]: string | number;
};

export interface IQuiz {
  public_id: string;
  title: string;
  questions: Question[];
  status: QuizStatus;
  permalink: string;
  duration: string | number;
  created_at: String;
  updatedAt: Date;
}

export interface IOptionProps {
  optionIndex: number;
}

export interface QuizInfoProps {
  questionsList: any[];
  dispatch: AppDispatch;
}

export interface IAuthData {
  username: string;
}

export interface IAuthProps extends IComponentProps {
  setAuthData: React.Dispatch<React.SetStateAction<IAuthData | null>>;
}
