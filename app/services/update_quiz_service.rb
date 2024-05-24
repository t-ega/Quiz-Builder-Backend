class UpdateQuizService < ApplicationService
  def initialize(update_options = {})
    @options = update_options.except(:id)
    @id = update_options[:id]
  end

  def call
    quiz = Quiz.pub_id(@id).first
    return if quiz.nil?

    quiz.update(@options)
    quiz
  end
end
