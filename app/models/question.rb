class Question < ApplicationRecord
  TYPES = %w[MULTI_CHOICE SELECT SINGLE]
  validates :question_type,
            inclusion: {
              in: TYPES,
              message: "%{value} is not a valid question type"
            }
  belongs_to :quiz
  has_many :options, dependent: :destroy

  accepts_nested_attributes_for :options
end
