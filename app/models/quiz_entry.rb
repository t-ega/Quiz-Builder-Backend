class QuizEntry < ApplicationRecord
  validates :participant_email, presence: true
  validates :duration,
            numericality: {
              only_integer: true,
              greater_than: 0
            },
            allow_nil: true
  belongs_to :quiz
end
