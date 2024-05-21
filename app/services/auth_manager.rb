class AuthManager
  TOKEN_EXPIRATION_TIME = 1.day.from_now

  class << self
    def authenticate_user(email, password)
      user = User.find_for_database_authentication(email: email)
      return if user.nil?

      valid_password = user.valid_password?(password)
      return unless valid_password

      token = generate_token
      AuthenticationToken.create!(
        token: token,
        user: user,
        expires_at: AuthManager::TOKEN_EXPIRATION_TIME
      )
    end

    def revoke_token(token)
      auth_token = AuthenticationToken.find_by(token: token)
      auth_token.update(expires_at: Time.current)
    end

    def find_by_authentication_token(token)
      auth_token = AuthenticationToken.valid(token).first
      auth_token&.user
    end

    private

    def generate_token
      len = 16
      loop do
        token = SecureRandom.alphanumeric(len)
        break token unless AuthenticationToken.exists?(token: token)
      end
    end

    def destroy_exiting_token(user)
      token = AuthenticationToken.find_by_user_id(user)
      token&.destroy
    end
  end
end
