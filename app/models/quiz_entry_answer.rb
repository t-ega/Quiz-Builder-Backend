class QuizEntryAnswer < ApplicationRecord
  belongs_to :option
  accepts_nested_attributes_for :option
end
