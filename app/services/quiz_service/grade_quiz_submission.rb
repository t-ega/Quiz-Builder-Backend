module QuizService
  class GradeQuizSubmission < ApplicationService
    attr_reader :entry_id, :entry

    def initialize(quiz_entry_id)
      @entry_id = quiz_entry_id
    end

    def call
      find_entry
      return unless entry_exists?

      score = calculate_score
      entry.update!(score: score)
    end

    private

    def find_entry
      @entry = QuizEntry.includes(:quiz).find(entry_id)
    end

    def entry_exists?
      entry.present? ? true : false
    end

    def extract_right_options(options)
      options.each_with_object([]) do |option, result|
        result << option["option"] if option["is_right"]
      end
    end

    def extract_quiz_questions_with_answers
      questions = @entry.quiz.questions
      questions.map { |question|
        { "question": question["question"], "answers": extract_right_options(question["options"]) }
      }
    end
    

    def calculate_score
      quiz_answers = extract_quiz_questions_with_answers
      score = 0
      
      @entry.answers.map { |entry_answer| 
        entry_answer = entry_answer.symbolize_keys
        score += 1 if quiz_answers.include?(entry_answer)
    }
    score
    end
  end
end
