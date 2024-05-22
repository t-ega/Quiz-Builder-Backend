class QuizEntryAnswer < ApplicationRecord
  belongs_to :question
  belongs_to :option
end
