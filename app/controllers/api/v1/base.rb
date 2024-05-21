module API
  module V1
    class Base < Grape::API
      prefix :api

      mount API::V1::Auth
    end

    # helpers do
    #   def current_user
    #     return nil if headers["Authorization"].nil?

    #     @current_user ||=
    #       Auth::AuthService.find_by_authentication_token(
    #         headers["Authorization"]
    #       )
    #   end

    #   def authenticate!
    #     error!("401 Unauthorized", 401) unless current_user
    #   end
    # end
  end
end
