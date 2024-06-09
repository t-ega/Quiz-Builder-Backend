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

          render_success(
            data: {
              token: result.token,
              username: result.user.username
            }
          )
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
            Users::Creator.new(
              username: username,
              password: password,
              email: email
            ).call

          if status != :ok
            render_error(
              message: Message.unprocessable_entity,
              errors: result,
              code: 422
            )
          end

          status, result =
            Session::Creator.new(email: email, password: password).call

          if status != :ok
            render_error(
              message: Message.unprocessable_entity,
              errors: result,
              code: 422
            )
          end

          render_success(
            data: {
              username: result.user.username,
              token: result.token
            },
            message: Message.account_created
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
