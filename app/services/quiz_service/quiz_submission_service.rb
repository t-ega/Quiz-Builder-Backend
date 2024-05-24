module QuizService
  class QuizSubmissionService
    attr_reader :params, :quiz, :quiz_entry, :errors

    def initialize(params)
      @params = params.with_indifferent_access
      @errors = []
    end

    def call
      find_quiz
      return false if quiz_not_found?

      find_quiz_entry
      return false if quiz_entry_not_found?

      return false if quiz_already_taken?

      submit_quiz_entry
    end

    private

    def find_quiz
      @quiz = Quiz.permalink(params[:permalink]).first
    end

    def find_quiz_entry
      @quiz_entry =
        quiz&.quiz_entries&.find_by(participant_email: params[:email])
    end

    def quiz_not_found?
      if quiz.nil?
        @errors << "The quiz requested was not found"
        return true
      end
      false
    end

    def quiz_entry_not_found?
      if quiz_entry.nil?
        @errors << "The quiz entry requested was not found"
        return true
      end
      false
    end

    def quiz_already_taken?
      if quiz_entry.taken_at.present?
        @errors << "The quiz has already been taken!"
        return true
      end
      false
    end

    def submit_quiz_entry
      if quiz_entry.update(
           quiz_entry_answers_attributes: params[:options_attributes],
           taken_at: Time.current
         )
        return true
      end
      @errors << "The quiz could not be recorded!"
      false
    end
  end
end
