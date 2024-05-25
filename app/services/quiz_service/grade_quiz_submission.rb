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
      @entry = QuizEntry.find(entry_id)
    end

    def entry_exists?
      return true if entry
      false
    end

    def grade_quiz
    end

    def calculate_score
      @score = 0
      entry&.quiz_entry_answers&.each do |answer|
        puts "option: #{answer.option.inspect}"
        @score += 1 if answer.option.is_right
      end
      @score
    end
  end
end
