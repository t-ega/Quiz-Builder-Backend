module Quizzes
  class Grader
    attr_reader :entry_id, :entry

    def initialize(quiz_entry_id)
      @entry_id = quiz_entry_id
    end

    def call
      @entry = QuizEntry.includes(:quiz).find(entry_id)
      return false if entry.blank?

      score = calculate_score
      entry.update(score: score)
    end

    private

    def extract_right_options(options)
      options.each_with_object([]) do |option, result|
        result << option["option"] if option["is_right"]
      end
    end

    def extract_quiz_questions_with_answers
      questions = @entry.quiz.questions
      questions.map do |question|
        {
          question: question["question"],
          answers: extract_right_options(question["options"])
        }
      end
    end

    def calculate_score
      quiz_answers = extract_quiz_questions_with_answers
      score = 0

      entry.answers.map do |entry_answer|
        entry_answer = entry_answer.symbolize_keys
        score += 1 if quiz_answers.include?(entry_answer)
      end
      score
    end
  end
end
