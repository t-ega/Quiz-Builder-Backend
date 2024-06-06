class RemoveDatetimeFromQuiz < ActiveRecord::Migration[7.1]
  def change
    remove_column :quizzes, :duration
    add_column :quizzes, :duration, :Integer
  end
end
