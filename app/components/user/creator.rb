module User
  class Creator
    def initialize(email:, password:, username:)
      @email = email
      @password = password
      @username = username
    end

    def call
      user =
        User.create(username: @username, password: @password, email: @email)
      return :error, user.errors.full_messages if !user.valid?

      [:ok, user]
    end
  end
end
