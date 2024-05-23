class Question < ApplicationRecord
  TYPES = %w[MULTIPLE-CHOICE SELECT SINGLE-CHOICE]
  validates :question_type,
            inclusion: {
              in: TYPES,
              message: "%{value} is not a valid question type"
            }
  belongs_to :quiz
  has_many :options

  accepts_nested_attributes_for :options
end
