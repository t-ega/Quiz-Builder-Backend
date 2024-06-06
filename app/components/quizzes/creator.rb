module Quizzes
  class Creator
    def initialize(params = {})
      @params = params
    end

    def call
      quiz = Quiz.create(@params)
      return :error, quiz.errors.full_messages if !quiz.valid?

      [:ok, quiz]
    end
  end
end
