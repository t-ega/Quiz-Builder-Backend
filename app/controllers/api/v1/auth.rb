module API
  module V1
    class Auth < Grape::API
      version "v1", using: :path
      format :json

      namespace :auth do
        desc "login a user"

        params do
          requires :email, type: String, desc: "User email"
          requires :password, type: String, desc: "User password"
        end

        post :login do
          password = params[:password]
          email = params[:email]

          token = AuthManager.authenticate_user(email, password)
          error!("Invalid email password", 401) if token.nil?

          { access_token: token.token, username: token.user.username }
        end

        desc "Register a user"

        params do
          requires :email, type: String, desc: "User email"
          requires :username, type: String, desc: "Username"
          requires :password, type: String, desc: "User password"
        end

        post :register do
          username = params[:username]
          password = params[:password]
          email = params[:email]

          user = CreateUserService.call(username, password, email)

          if user.valid?
            token = AuthManager.authenticate_user(email, password)
            return(
              {
                user: user,
                message: Message.account_created,
                token: token.token
              }
            )
          else
            error!(
              {
                sucess: false,
                message: Message.unprocessable_entity,
                errors: user.errors.full_messages
              },
              422
            )
          end
        end

        desc "Logout a user by expiring the token"

        post :logout do
          authenticate!
          token = authorization_token
          AuthManager.revoke_token(token)
          status :no_content
        end
      end
    end
  end
end
