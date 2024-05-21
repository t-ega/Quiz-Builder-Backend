class CreateUserService < ApplicationService
  def initialize(username, password, email)
    @username = username
    @password = password
    @email = email
  end

  def call
    User.create(username: @username, password: @password, email: @email)
  end
end
