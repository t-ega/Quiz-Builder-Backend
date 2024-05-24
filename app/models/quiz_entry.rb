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

  validate :prevent_update_if_quiz_taken, on: :update

  belongs_to :quiz
  has_many :quiz_entry_answers
  accepts_nested_attributes_for :quiz_entry_answers

  private

  def prevent_update_if_quiz_taken
    # Check if the previous value of the taken_at column was not nil
    # ActiveModel::Dirty method used.
    errors.add(:base, "cannot modify this entry!") if taken_at_was.present?
  end
end
