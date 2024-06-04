module API
  module V1
    module Admin
      class Quiz < Grape::API
        helpers SharedParams

        namespace :admin do
          namespace :quiz do
            desc "Create a quiz"

            params do
              requires :title, type: String, desc: "Title of the quiz"
              optional :duration,
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
              requires :questions, type: Array do
                use :question # Shared params
              end
            end

            post do
              authenticate!

              quiz =
                QuizService::CreateQuizService.call(
                  **declared(params, include_parent_namespaces: false),
                  user: current_user
                )

              if quiz.valid?
                return(
                  render_success(
                    message: "Quiz created successfuly",
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

            desc "Fetch the details of a quiz for the currently authenticated user"

            get ":id" do
              authenticate!

              hash_params = params.with_indifferent_access

              quiz =
                ::Quiz.includes(:quiz_entries).find_by(
                  public_id: hash_params[:id],
                  user: current_user
                )

              if quiz.nil?
                render_error(
                  message: Message.not_found,
                  errors: "Quiz with id: #{hash_params[:id]} was not found",
                  code: 404
                )
              end

              return(
                render_success(
                  message: "Quiz found--",
                  data: quiz.as_json(exclude: %i[questions id user_id])
                )
              )
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

              return(
                render_success(
                  message: "Quizzes found",
                  data:
                    quiz.as_json(
                      exclude: %i[questions user_id id],
                      methods: :questions_count
                    )
                )
              )
            end

            route_param :id do
              desc "Update a quiz"

              params do
                optional :title, type: String, desc: "Title of the quiz"
                # Leave as symbol, aasm wont recognize string events!
                optional :status, type: Symbol, values: %i[publish archive]
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

              put do
                authenticate!

                quiz =
                  QuizService::UpdateQuizService.new(
                    params[:id],
                    declared(params, include_parent_namespaces: false)
                  )

                updated_quiz = quiz.update_quiz

                if updated_quiz
                  return(
                    render_success(
                      message: "Quiz updated successfuly",
                      data: updated_quiz
                    )
                  )
                end

                render_error(
                  message: Message.unprocessable_entity,
                  errors: quiz.errors.flatten,
                  code: 422
                )
              end

              desc "Fetch the entries(submissions) to a quiz"

              get "/entries" do
                authenticate!

                hash_params = params.with_indifferent_access

                quiz =
                  ::Quiz.includes(:quiz_entries).find_by(
                    public_id: hash_params[:id],
                    user: current_user
                  )

                if quiz.nil?
                  render_error(
                    message: Message.not_found,
                    errors: "Quiz with id: #{hash_params[:id]} was not found",
                    code: 404
                  )
                end

                return(
                  render_success(message: "Quiz found", data: quiz.quiz_entries)
                )
              end

              desc "Send invites to quiz participants"

              params do
                requires :invites, type: Array do
                  optional :first_name, type: String
                  optional :last_name, type: String
                  requires :email, type: String, as: :participant_email
                end
              end

              post "/invite" do
                authenticate!

                queued =
                  QuizService::SendQuizInviteService.call(
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

              desc "Delete a quiz"

              delete do
                authenticate!

                quiz =
                  ::Quiz.find_by(public_id: params[:id], user: current_user)

                if quiz.nil?
                  render_error(
                    message: Message.not_found,
                    errors: "Quiz with id: #{params[:id]} was not found",
                    code: 404
                  )
                end

                success = quiz.destroy

                if success
                  return(render_success(message: "Quiz deleted!", data: quiz))
                end

                render_error(
                  message: Message.unprocessable_entity,
                  errors: success.errors,
                  code: 404
                )
              end
            end
          end
        end
      end
    end
  end
end
