class QuizEntry < ApplicationRecord
  normalizes :participant_email, with: ->(email) { email.downcase.strip }

  validates :participant_email, presence: true
  validates :duration,
            numericality: {
              only_integer: true,
              greater_than: 0
            },
            allow_nil: true
  belongs_to :quiz
end
