module QuizService
  class UpdateQuizStatusService < ApplicationService
    def initialize(id, current_user, action)
      @id = id
      @current_user = current_user
      @action = action
    end

    def call
      quiz = Quiz.pub_id(@id).current_user(@current_user).first
      return if quiz.nil?

      quiz.aasm.fire!(@action) if quiz.aasm.may_fire_event?(@action)
    end
  end
end
