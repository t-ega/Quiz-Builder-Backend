module API
  module V1
    class Base < Grape::API
      prefix :api

      helpers do
        def current_user
          return nil if authorization_token.nil?

          @current_user ||=
            AuthManager.find_by_authentication_token(authorization_token)
        end

        def authenticate!
          error!("401 Unauthorized", 401) unless current_user
        end

        def authorization_token
          # Memoize the token
          @authorization_token ||= headers["authorization"]
        end
      end

      mount API::V1::Auth
    end
  end
end
