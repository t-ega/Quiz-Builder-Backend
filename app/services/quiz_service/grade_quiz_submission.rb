module QuizService
  class GradeQuizSubmission < ApplicationService
    attr_reader :entry_id, :entry, :score

    def initialize(quiz_entry_id)
      @entry_id = quiz_entry_id
    end

    def call
      find_entry
      return unless entry_exists?

      calculate_score
      entry.update!(score: score)
    end

    private

    def find_entry
      @entry = QuizEntry.includes(quiz_entry_answers: :option).find(entry_id)
    end

    def entry_exists?
      entry.present? ? true : false
    end

    def calculate_score
      @score =
        entry
          .quiz_entry_answers
          .joins(:option)
          .where(options: { is_right: true })
          .count
    end
  end
end
