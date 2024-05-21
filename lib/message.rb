class Message
  class << self
    def invalid_credentials
      "Invalid credentials"
    end

    def account_created
      "Account created successfully"
    end

    def unprocessable_entity
      "Could not process this request. Ensure you passed the right data "
    end
  end
end
