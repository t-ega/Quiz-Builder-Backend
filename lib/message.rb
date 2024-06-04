class Message
  class << self
    def invalid_credentials
      "Invalid credentials"
    end

    def unauthorized_error
      "You need to be unauthorized to access this endpoint!"
    end

    def account_created
      "Account created successfully"
    end

    def internal_server_error
      "An internal error occurred. We are aware and are we are working on it."
    end

    def validation_error
      "One or more required parameters are missing"
    end

    def not_found
      "The requested resource could not be found"
    end

    def unprocessable_entity
      "Could not process this request. Ensure you passed the right data "
    end
  end
end
