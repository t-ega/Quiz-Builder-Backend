module API
  module V1
    class Base < Grape::API
      version "v1", using: :path
      prefix :api
      format :json

      helpers ResponseHelpers

      helpers do
        def current_user
          return nil if authorization_token.nil?

          @current_user ||=
            AuthManager.find_by_authentication_token(authorization_token)
        end

        def authenticate!
          unless current_user
            render_error(
              message: Message.unauthorized_error,
              errors: "401 Unautorized",
              code: 401
            )
          end
        end

        def authorization_token
          # Memoize the token
          @authorization_token ||= headers["authorization"]
          @authorization_token&.split(" ")&.last
        end
      end

      rescue_from Grape::Exceptions::ValidationErrors do |e|
        render_error(
          message: Message.validation_error,
          errors: e.full_messages,
          code: 400
        )
      end

      rescue_from :all do |e|
        # TODO: Write errors to log file.
        Rails.logger.error(e)

        render_error(
          message: Message.internal_server_error,
          code: 500,
          errors: ["Internal Server error"]
        )
      end

      mount API::V1::Auth
      mount API::V1::Quiz
    end
  end
end
