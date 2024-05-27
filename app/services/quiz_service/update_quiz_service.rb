module QuizService
  class UpdateQuizService
    attr_reader :options, :quiz, :errors, :result

    def initialize(id, update_options = {})
      # The duration column is always overwritten to nil on update if it was not passed in.
      # The best way to avoid it is by removing values that were not passed from Grape params
      @data = params_with_values(update_options)
      @id = id
      @errors = []
    end

    def update_quiz
      find_quiz
      return if quiz_not_found?

      # Prevent the status if included from updating through active record update
      # Trigger it through aasm instead.
      quiz.update(@data.except(:status))
      return if update_not_successful?

      # Check if the update data also includes the quiz status
      status = @data[:status]

      if status
        if quiz.aasm.may_fire_event?(status)
          quiz.aasm.fire!(status)
        else
          @errors << "Cannot update quiz status to: #{status}"
          return
        end
      end

      quiz
    end

    private

    def find_quiz
      @quiz = Quiz.pub_id(@id).first
    end

    def quiz_not_found?
      if quiz.nil?
        @errors << "The quiz entry requested was not found"
        return true
      end
      false
    end

    def update_not_successful?
      unless quiz.valid?
        @errors << quiz.errors.full_messages
        return true
      end

      return false
    end

    def params_with_values(params)
      params.each_with_object({}) do |(key, value), extracted|
        extracted[key] = value if params[key].present?
      end
      params = params.with_indifferent_access
    end
  end
end
