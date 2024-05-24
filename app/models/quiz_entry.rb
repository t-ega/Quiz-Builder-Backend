class QuizEntry < ApplicationRecord
  normalizes :participant_email, with: ->(email) { email.downcase.strip }

  validates_uniqueness_of :participant_email,
                          message: "%{value} is already enrolled for the quiz"
  validates :participant_email, presence: true
  validates :participant_email,
            format: {
              with: Devise.email_regexp,
              message: "'%{value}' is an invalid email format"
            }
  validates :duration,
            numericality: {
              only_integer: true,
              greater_than: 0
            },
            allow_nil: true
  belongs_to :quiz
end
