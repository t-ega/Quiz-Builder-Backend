class AddEmailsSentCountToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :emails_sent, :integer, default: 0
  end
end
