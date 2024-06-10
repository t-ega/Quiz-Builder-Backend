class AuthenticationToken < ApplicationRecord
  belongs_to :user
  validates :token, presence: true
  scope :valid,
        ->(token) { where("token = ? AND expires_at > ?", token, Time.current) }

  def self.revoke_token(token)
    auth_token = AuthenticationToken.find_by(token: token)
    auth_token&.update(expires_at: Time.current)
  end

  def self.find_user_by_authentication_token(token)
    token = AuthenticationToken.valid(token).first
    token&.user
  end
end
