class QuizEntryAnswer < ApplicationRecord
  belongs_to :question
  belongs_to :option
  belongs_to :quiz_entry
end
