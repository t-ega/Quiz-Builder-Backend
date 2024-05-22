class UpdateQuizService < ApplicationService
  def initialize(id:, update_options: {})
    @options = update_options
    @id = id
  end

  def call
    quiz = Quiz.find(@id)
    return if quiz.nil?

    if quiz.status == "PUBLISHED"
      quiz.errors.add(:base, "Cannot update a published quiz!")
      return
    end

    quiz.update(update_options)
  end
end
