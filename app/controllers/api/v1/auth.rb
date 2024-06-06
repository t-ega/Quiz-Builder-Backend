module API
  module V1
    class Auth < Grape::API
      namespace :auth do
        desc "login a user"

        params do
          requires :email, type: String, desc: "User email"
          requires :password, type: String, desc: "User password"
        end

        post :login do
          password = params[:password]
          email = params[:email]

          status, result =
            Session::Creator.new(email: email, password: password).call

          if status != :ok
            render_error(
              message: Message.unprocessable_entity,
              errors: result,
              code: 422
            )
          end

          { token: result.token, username: result.user.username }
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

          status, result =
            Session::Creator.new(
              username: username,
              password: password,
              email: email
            ).call

          if status != :ok
            render_error(
              { message: Message.unprocessable_entity, errors: result },
              422
            )
          end

          status, token = Session::Manager.new(email: email, password: password)
          if status != :ok
            render_error(
              { message: Message.unprocessable_entity, errors: result },
              422
            )
          end

          render_success(
            {
              user: result,
              message: Message.account_created,
              token: token.token
            }
          )
        end

        desc "Logout a user by expiring the token"

        post :logout do
          authenticate!

          token = authorization_token
          Session::Destroyer.new(token).call
          status :no_content
        end
      end
    end
  end
end
