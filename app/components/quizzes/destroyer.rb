module Quizzes
  class Destroyer
    def initialize(public_id:, user:)
      @public_id = public_id
      @user = user
    end

    def call
      quiz = Quiz.find_by(public_id: public_id, user: user)
      if quiz.blank?
        return :error, "Quiz with id: #{public_id} was not found", 404
      end

      destroyed = quiz.destroy
      return :error, "Unable to delete quiz", 422 if !destroyed

      [:ok, "Successfully deleted quiz"]
    end

    private

    attr_reader :public_id, :user
  end
end
