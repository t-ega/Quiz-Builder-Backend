class RenameTypeOnQuestion < ActiveRecord::Migration[7.1]
  def change
    rename_column :questions, :type, :question_type
  end
end
