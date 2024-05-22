class CreateQuizzes < ActiveRecord::Migration[7.1]
  def change
    create_table :quizzes do |t|
      t.string :title, null: false
      t.datetime :duration
      t.boolean :active
      t.datetime :opens_at
      t.string :public_id, null: false
      t.datetime :closes_at
      t.references :users, null: false, foreign_key: true
      t.string :permalink
      t.string :status, default: "DRAFT"

      t.timestamps
    end
  end
end
