class CreateQuizEntryAnswers < ActiveRecord::Migration[7.1]
  def change
    create_table :quiz_entry_answers do |t|
      t.references :quiz_entries, null: false, foreign_key: true
      t.references :option, null: false, foreign_key: true
      t.datetime :answered_at

      t.timestamps
    end
  end
end
