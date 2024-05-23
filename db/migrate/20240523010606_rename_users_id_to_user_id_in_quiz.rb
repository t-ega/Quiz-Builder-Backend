class RenameUsersIdToUserIdInQuiz < ActiveRecord::Migration[7.1]
  def change
    rename_column :quizzes, :users_id, :user_id
  end
end
