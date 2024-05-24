class RenameQuizParticipant < ActiveRecord::Migration[7.1]
  def change
    rename_column :quiz_entries, :quizzes_id, :quiz_id
    add_column :quiz_entries, :taken_at, :datetime
    remove_column :quizzes, :active
  end
end
