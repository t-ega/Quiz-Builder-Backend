import { AppDispatch } from "./store";

export enum QUESTION_TYPES {
  MULTI_SELECT = "MULTI_SELECT",
  SINGLE_CHOICE = "SINGLE_CHOICE",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICSE",
}

export interface Option {
  id: number;
  option: string;
  is_right: boolean;
}

export interface Question {
  question: string;
  type: QUESTION_TYPES;
  options: Option[];
}

export interface QuestionsState {
  questionsList: Question[];
  currentQuestionIndex: number;
}

export interface IOptionProps {
  optionIndex: number;
}

export interface QuizInfoProps {
  questionsList: any[];
  dispatch: AppDispatch;
}
