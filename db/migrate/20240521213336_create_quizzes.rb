class CreateQuizzes < ActiveRecord::Migration[7.1]
  def change
    create_table :quizzes do |t|
      t.string :title, null: false
      t.datetime :duration
      t.boolean :active
      t.datetime :opens_at
      t.string :public_id, null: false
      t.datetime :closes_at
      t.string :permalink
      t.string :status, default: "DRAFT"

      t.timestamps
    end
    add_foreign_key :quizzes, :user
  end
end
