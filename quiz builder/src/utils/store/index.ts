import { configureStore } from "@reduxjs/toolkit";
import questionReducer from "./slices/question-slice";
import clientQuestionsReducer from "./slices/client";

const store = configureStore({
  reducer: {
    questions: questionReducer,
    client: clientQuestionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
