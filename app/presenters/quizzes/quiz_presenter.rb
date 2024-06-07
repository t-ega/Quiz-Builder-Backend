module Quizzes
  class QuizPresenter
    attr_reader :quiz
    def initialize(quiz)
      @quiz = quiz
    end

    def quiz_details
      quiz.as_json(
        only: %i[public_id title duration],
        methods: :questions_count,
        include: {
          user: {
            only: %i[username]
          }
        }
      )
    end

    def quiz_test_questions
      quiz.as_json(only: %i[public_id title duration], methods: :quiz_questions)
    end
  end
end
