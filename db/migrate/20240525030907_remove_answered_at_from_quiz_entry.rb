class RemoveAnsweredAtFromQuizEntry < ActiveRecord::Migration[7.1]
  def change
    remove_column :quiz_entry_answers, :answered_at
  end
end
