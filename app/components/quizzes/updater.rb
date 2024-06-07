module Quizzes
  class Updater
    def initialize(quiz_id:, update_options: {})
      @quiz_id = quiz_id
      @data = options_with_values(update_options)
    end

    def call
      quiz = Quiz.find_by_public_id(@quiz_id)
      return :error, "The quiz entry requested was not found" if quiz.blank?

      # Prevent the status(if included) from updating through active record update
      # Trigger it through aasm instead.
      quiz.update(@data.except(:status))
      return :error, quiz.errors.full_messages if !quiz.valid?

      status = @data[:status]

      if status
        if quiz.aasm.may_fire_event?(status)
          quiz.aasm.fire!(status)
        else
          return :error, "Cannot update quiz status to: #{status}"
        end
      end

      [:ok, quiz]
    end

    private

    def options_with_values(options)
      extracted =
        options.each_with_object({}) do |(key, value), extracted|
          extracted[key] = value if options[key].present?
        end
      extracted.with_indifferent_access
    end
  end
end
