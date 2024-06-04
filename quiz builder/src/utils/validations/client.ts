import { z } from "zod";
import { QUESTION_TYPES } from "../interfaces";

const QuizTestOptionSchema = z
  .object({
    option: z.string(),
  })
  .transform((o) => ({
    option: o.option,
    selected: false,
  }))
  .array();

const QuizTestQuestionSchema = z
  .object({
    question: z.string(),
    question_type: z.nativeEnum(QUESTION_TYPES),
    options: QuizTestOptionSchema,
  })
  .transform((o) => ({
    question: o.question,
    type: o.question_type,
    options: o.options,
  }));

const QuizTestQuestionsSchema = z.array(QuizTestQuestionSchema);

export const QuizTestSchema = z.object({
  email: z.string().email(),
  title: z.string(),
  duration: z.number().nullable(),
  questions: QuizTestQuestionsSchema,
});

// Submission

export const QuizSubmissionSchema = z.object({
  email: z.string().email(),
  entry: z
    .object({
      question: z.string(),
      answers: z.array(z.string()),
    })
    .array(),
});

export type IQuizTest = z.infer<typeof QuizTestSchema>;
export type IQuizTestOption = z.infer<typeof QuizTestOptionSchema>;
export type IQuizTestQuestions = z.infer<typeof QuizTestQuestionsSchema>;
export type IQuizTestQuestion = z.infer<typeof QuizTestQuestionSchema>;
