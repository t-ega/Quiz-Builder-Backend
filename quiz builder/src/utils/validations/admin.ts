import { z } from "zod";
import { QUESTION_TYPES } from "../interfaces";

export const QuizInviteSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
  })
  .transform((o) => ({
    first_name: o.firstName,
    email: o.email,
    last_name: o.lastName,
  }));

export const QuizInviteesSchema = z.array(QuizInviteSchema);
export type QuizFlattenedErrors = z.inferFlattenedErrors<
  typeof QuizInviteSchema
>;

const optionSchema = z.object({
  id: z.number(),
  option: z.string().min(2, "Option content too short at least 2 characters"),
  is_right: z.boolean(),
});

export const QuestionSchema = z
  .object({
    question: z.string().min(5, "Question content cannot be less than 5"),
    type: z.nativeEnum(QUESTION_TYPES),
    options: z.array(optionSchema).refine(
      (val) => {
        const checkedOptions = val.filter((el) => el.is_right === true);
        return checkedOptions.length > 0;
      },
      { message: "You must selct at least one right option for each question!" }
    ),
  })
  .transform((o) => ({
    ...o,
    question_type: o.type, // So that our backend receives the proper key
  }));

export const QuestionsSchema = z.array(QuestionSchema);
export const QuizOutputSchema = z
  .object({
    title: z.string().min(3, "Title too short"),
    duration: z.enum(["", "10", "20", "30", "40", "60"], {
      message: "Please pass in a valid duration",
    }),
    questionsList: QuestionsSchema,
  })
  .transform((o) => ({
    ...o,
    questions: o.questionsList, // So that our backend receives the proper key
  }));

// Input Validation

const QuestionInputSchema = z
  .object({
    question: z.string(),
    question_type: z.nativeEnum(QUESTION_TYPES),
    options: z
      .object({
        id: z.number().default(Math.random),
        option: z.string(),
        is_right: z.boolean(),
      })
      .array(),
  })
  .transform((o) => ({
    ...o,
    type: o.question_type, // So that our frontend receives the proper key
  }));

export const QuizInputSchema = z
  .object({
    title: z.string(),
    duration: z.union([z.literal(""), z.number()]).catch(""),
    questions: z.array(QuestionInputSchema),
  })
  .transform((o) => ({
    ...o,
    questionsList: o.questions,
  }));

export type QuestionFormattedErrors = z.inferFormattedError<
  typeof QuestionSchema
>;
