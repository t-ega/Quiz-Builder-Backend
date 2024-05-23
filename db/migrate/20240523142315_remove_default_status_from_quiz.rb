class RemoveDefaultStatusFromQuiz < ActiveRecord::Migration[7.1]
  def change
    change_column_default :quizzes, :status, nil
  end
end
