class User < ApplicationRecord
  normalizes :email, with: ->(email) { email.downcase.strip }
  validates :email, presence: true

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :validatable

  has_many :authentication_tokens, dependent: :destroy
  has_many :quizzes, dependent: :destroy

  def update_emails_sent_count
    self.emails_sent += 1
    self.save!
  end
end
