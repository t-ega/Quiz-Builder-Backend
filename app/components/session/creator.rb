module Session
  TOKEN_EXPIRATION_TIME = 1.day.from_now.freeze
  TOKEN_LENGTH = 32.freeze

  class Creator
    def initialize(email:, password:)
      @email = email
      @password = password
    end

    def call
      user = User.find_by_email(email)
      return :error, "Invalid email or password" if user.blank?

      valid_password = user.valid_password?(password)
      return :error, "Invalid email or password" if !valid_password

      token =
        AuthenticationToken.create(
          token: generate_token,
          user: user,
          expires_at: TOKEN_EXPIRATION_TIME
        )
      return :error, token.errors.full_messages if token.errors.present

      [:ok, token]
    end

    private

    attr_reader :email, :password

    def generate_token
      SecureRandom.alphanumeric(TOKEN_LENGTH)
    end
  end
end
