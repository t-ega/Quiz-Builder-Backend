class CreateQuizService < ApplicationService
  def initialize(quiz_params = {})
    @options = quiz_params
  end

  def call
    Quiz.create(@options)
  end
end
