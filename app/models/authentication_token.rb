class AuthenticationToken < ApplicationRecord
  belongs_to :user
  validates :token, presence: true
  scope :valid,
        ->(token) { where("token = ? AND expires_at > ?", token, Time.current) }
end
