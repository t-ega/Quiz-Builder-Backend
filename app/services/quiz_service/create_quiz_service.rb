module QuizService
  class CreateQuizService < ApplicationService
    def initialize(quiz_params = {})
      @options = quiz_params
      puts "Options: #{@options}"
    end

    def call
      Quiz.create(@options)
    end
  end
end
