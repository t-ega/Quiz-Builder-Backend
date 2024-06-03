import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QUESTION_TYPES, QuestionsState } from "../../interfaces";

const initialState: QuestionsState = {
  title: "",
  duration: "",
  questionsList: [
    {
      question: "",
      type: QUESTION_TYPES.MULTIPLE_CHOICES,
      options: [],
    },
  ],
  currentQuestionIndex: 0, // Starting of the array
};

const questionSlice = createSlice({
  name: "clientQuestions",
  initialState,
  reducers: {
    setQuizData: (state, action: PayloadAction<QuestionsState>) => {
      console.log("Called");
      state.title = action.payload.title;
      state.duration = action.payload.duration;
      state.questionsList = action.payload.questionsList;
    },

    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
    },

    checkOption: (
      state,
      action: PayloadAction<{ optionIndex: number; selected: boolean }>
    ) => {
      const { optionIndex, selected } = action.payload;
      state.questionsList[state.currentQuestionIndex].options[
        optionIndex
      ].selected = selected;
    },

    clearCheckedOptions: (state) => {
      state.questionsList[state.currentQuestionIndex].options.forEach(
        (option) => {
          option.selected = false;
        }
      );
    },
  },
});

export const {
  checkOption,
  setCurrentQuestionIndex,
  clearCheckedOptions,
  setQuizData,
} = questionSlice.actions;
export default questionSlice.reducer;
