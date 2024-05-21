class QuizAnswer < ApplicationRecord
  belongs_to :question
  belongs_to :option
  belongs_to :participant
end
