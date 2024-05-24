module API
  module V1
    class Quiz < Grape::API
      helpers SharedParams

      namespace :admin do
        namespace :quiz do
          desc "Create a quiz"

          params do
            requires "title", type: String, desc: "Title of the quiz"
            optional "duration",
                     type: Integer,
                     desc:
                       "How long the quiz should be taken. Note: Must be in secs!"
            optional "opens_at",
                     type: DateTime,
                     desc: "The opening time of the quiz"
            optional "closes_at",
                     type: DateTime,
                     desc:
                       "The time when the quiz would no longer be valid to be taken"
            requires :questions_attributes, type: Array do
              use :question # Shared params
            end
          end

          post do
            authenticate!
            quiz =
              CreateQuizService.call(**declared(params), user: current_user)

            if quiz.valid?
              return(
                render_success(message: "Quiz created successfuly", data: quiz)
              )
            end

            render_error(
              message: Message.unprocessable_entity,
              errors: quiz.errors.full_messages,
              code: 422
            )
          end

          desc "Fetch the details of a quiz for the currently authenticated user"

          get ":id" do
            authenticate!

            quiz = ::Quiz.find_by(public_id: params[:id], user: current_user)

            if quiz.nil?
              render_error(
                message: Message.not_found,
                errors: "Quiz with id: #{params[:id]} was not found",
                code: 404
              )
            end

            return(render_success(message: "Quiz found", data: quiz))
          end

          desc "Fetch the details of all the quizzes for the currently authenticated user"

          get do
            authenticate!

            quiz = ::Quiz.where(user: current_user)

            if quiz.nil?
              render_error(
                message: Message.not_found,
                errors: "Quizzes for user was not found",
                code: 404
              )
            end

            return(render_success(message: "Quizzes found", data: quiz))
          end

          desc "Update a quiz"

          params do
            requires :id, type: String, desc: "The ID of the quiz"
            optional :title, type: String, desc: "Title of the quiz"

            optional :duration,
                     type: Integer,
                     desc:
                       "How long the quiz should be taken. Note: Should be in secs!"
            optional :opens_at,
                     type: DateTime,
                     desc: "The opening time of the quiz"
            optional :closes_at,
                     type: DateTime,
                     desc:
                       "The time when the quiz would no longer be valid to be taken"
            optional :questions, type: Array do
              use :question # Shared params
            end
          end

          route_param :id do
            put do
              authenticate!

              quiz = UpdateQuizService.call(declared(params))

              if quiz.valid?
                return(
                  render_success(
                    message: "Quiz updated successfuly",
                    data: quiz
                  )
                )
              end

              render_error(
                message: Message.unprocessable_entity,
                errors: quiz.errors.full_messages,
                code: 422
              )
            end

            desc "Change the status of a quiz"

            params do
              requires :action, type: Symbol, values: %i[publish draft archive]
            end

            put "/status" do
              authenticate!

              action = params[:action]

              publish =
                UpdateQuizStatusService.call(params[:id], current_user, action)

              if publish
                return(
                  render_success(
                    message: "Quiz status updated to #{action} successfully"
                  )
                )
              end

              render_error(
                message: Message.unprocessable_entity,
                errors: "Unable to update quiz status to #{action}",
                code: 422
              )
            end

            desc "Send invites to quiz participants"

            params do
              requires :invites, type: Array do
                requires :first_name, type: String
                requires :last_name, type: String
                requires :email, type: String, as: :participant_email
              end
            end

            post "/invite" do
              authenticate!

              queued =
                SendQuizInviteService.call(
                  params[:id],
                  current_user,
                  params[:invites]
                )

              if queued
                return(
                  render_success(message: "Quiz invite queued successfully")
                )
              end
              render_error(message: "Unable to process invites", code: 400)
            end
          end
        end
      end
    end
  end
end
