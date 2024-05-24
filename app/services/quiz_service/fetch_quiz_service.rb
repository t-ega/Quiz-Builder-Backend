module QuizService
  class FetchQuizService < ApplicationService
    def initialize(permalink, email)
      @email = email
      @permalink = permalink
    end

    def call
      quiz = Quiz.find_by(permalink: @permalink)
      return if quiz.nil?

      quiz.quiz_entries.where(email: @email)
    end
  end
end
