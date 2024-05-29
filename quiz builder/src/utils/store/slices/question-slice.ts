import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QUESTION_TYPES, QuestionsState } from "../../interfaces";

const initialState: QuestionsState = {
  questionsList: [
    {
      question: "",
      type: QUESTION_TYPES.MULTIPLE_CHOICE,
      options: [
        { id: Math.random(), option: "", is_right: false },
        { id: Math.random(), option: "", is_right: false },
      ],
    },
  ],
  currentQuestionIndex: 0, // Starting of the array
};

const questionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setQuestion: (state, action: PayloadAction<string>) => {
      state.questionsList[state.currentQuestionIndex].question = action.payload;
    },

    removeQuestion: (state, action: PayloadAction<number>) => {
      state.questionsList.splice(action.payload, 1);
    },

    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
    },

    setQuestionType: (state, action: PayloadAction<QUESTION_TYPES>) => {
      const currentQuestion = state.questionsList[state.currentQuestionIndex];
      currentQuestion.type = action.payload;
      //   If a question type changes delete the previous options
      //   Or in this case reset the previous options to a default state
      // The id here is so that react can maintain the options state when they are
      // dynamically created or removed
      currentQuestion.options = [
        { id: Math.random(), option: "", is_right: false },
        { id: Math.random(), option: "", is_right: false },
      ];
    },

    // This would enable us to modify the contents(option) of any question's option
    setOption: (
      state,
      action: PayloadAction<{ optionIndex: number; option: string }>
    ) => {
      const { optionIndex, option } = action.payload;
      state.questionsList[state.currentQuestionIndex].options[
        optionIndex
      ].option = option;
    },

    checkOption: (
      state,
      action: PayloadAction<{ optionIndex: number; is_right: boolean }>
    ) => {
      const { optionIndex, is_right } = action.payload;
      state.questionsList[state.currentQuestionIndex].options[
        optionIndex
      ].is_right = is_right;
    },

    removeOption: (state, action: PayloadAction<number>) => {
      const currentQuestion = state.questionsList[state.currentQuestionIndex];
      if (currentQuestion.options.length > 2) {
        currentQuestion.options.splice(action.payload, 1);
      }
    },

    // Add a blank option
    addOption: (state) => {
      const currentQuestion = state.questionsList[state.currentQuestionIndex];
      if (currentQuestion.options.length < 5) {
        currentQuestion.options.push({
          id: Math.random(),
          option: "",
          is_right: false,
        });
      }
    },

    addQuestion: (state) => {
      state.questionsList.push({
        question: "",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        options: [
          { id: Math.random(), option: "", is_right: false },
          { id: Math.random(), option: "", is_right: false },
        ],
      });
    },
  },
});

export const {
  setQuestion,
  setQuestionType,
  setOption,
  removeOption,
  addOption,
  addQuestion,
  checkOption,
  setCurrentQuestionIndex,
  removeQuestion,
} = questionSlice.actions;
export default questionSlice.reducer;
