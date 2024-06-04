class QuizEntry < ApplicationRecord
  normalizes :participant_email, with: ->(email) { email.downcase.strip }

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

  belongs_to :quiz, counter_cache: true

  private

  def prevent_update_if_quiz_taken
    # Check if the previous value of the taken_at and score column was not nil
    # ActiveModel::Dirty method used.
    if taken_at_was.present? && score_was.present?
      errors.add(:base, "cannot modify this entry!")
    end
  end
end
