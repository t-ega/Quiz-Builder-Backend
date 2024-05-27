class AddQuestionsToQuizAndOpt < ActiveRecord::Migration[7.1]
  def change
    add_column :quizzes, :questions, :jsonb
    add_column :quiz_entries, :answers, :jsonb
  end
end
