class DeleteUnnecessaryTables < ActiveRecord::Migration[7.1]
  def change
    drop_table :quiz_entry_answers
    drop_table :options
    drop_table :questions
  end
end
