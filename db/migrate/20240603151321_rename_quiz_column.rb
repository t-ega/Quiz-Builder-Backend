class RenameQuizColumn < ActiveRecord::Migration[7.1]
  def change
    rename_column :quizzes, :quizzes_entries_count, :quiz_entries_count
  end
end
