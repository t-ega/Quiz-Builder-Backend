class RemoveDatetimeFromQuizDuration < ActiveRecord::Migration[7.1]
  def change
    add_column :quizzes, :quizzes_entries_count, :Integer, default: 0
    add_column :quizzes, :duration, :Integer
  end
end
