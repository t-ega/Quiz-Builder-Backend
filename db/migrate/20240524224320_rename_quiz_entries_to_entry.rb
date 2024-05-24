class RenameQuizEntriesToEntry < ActiveRecord::Migration[7.1]
  def change
    rename_column :quiz_entry_answers, :quiz_entries_id, :quiz_entry_id
  end
end
