class UpdateQuizService < ApplicationService
  def initialize(update_options = {})
    @options = update_options.except(:id)
    @id = update_options[:id]
  end

  def call
    quiz = Quiz.find_by_id(@id)
    return if quiz.nil?

    if quiz.status == "PUBLISHED"
      quiz.errors.add(:base, "Cannot modify a quiz once it's published!")
      return quiz
    end

    quiz.update(@options)
    quiz
  end
end
