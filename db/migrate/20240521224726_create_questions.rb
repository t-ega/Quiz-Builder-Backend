class CreateQuestions < ActiveRecord::Migration[7.1]
  def change
    create_table :questions do |t|
      t.string :text
      t.references :quiz, null: false, foreign_key: true
      t.string :type

      t.timestamps
    end
  end
end
