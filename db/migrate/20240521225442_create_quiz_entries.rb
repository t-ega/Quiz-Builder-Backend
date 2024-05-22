class CreateQuizEntries < ActiveRecord::Migration[7.1]
  def change
    create_table :quiz_entries do |t|
      t.string :participant_email
      t.integer :duration
      t.integer :score
      t.references :quizzes, null: false, foreign_key: true

      t.timestamps
    end
  end
end
