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

              status, result =
                Quizzes::Creator.new(
                  **declared(params, include_parent_namespaces: false),
                  user: current_user
                ).call

              if status != :ok
                render_error(
                  message: Message.unprocessable_entity,
                  errors: result,
                  code: 422
                )
              end

              render_success(message: "Quiz created successfuly", data: result)
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

              render_success(
                message: "Quiz found",
                data: quiz.as_json(exclude: %i[questions id user_id])
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

              render_success(
                message: "Quizzes found",
                data:
                  quiz.as_json(
                    exclude: %i[questions user_id id],
                    methods: :questions_count
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

                status, result =
                  Quizzes::Updater.new(
                    quiz_id: params[:id],
                    update_options:
                      declared(params, include_parent_namespaces: false)
                  ).call

                if status != :ok
                  render_error(
                    message: Message.unprocessable_entity,
                    errors: result,
                    code: 422
                  )
                end

                render_success(
                  message: "Quiz updated successfuly",
                  data: result
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

                if quiz.blank?
                  render_error(
                    message: Message.not_found,
                    errors: "Quiz with id: #{hash_params[:id]} was not found",
                    code: 404
                  )
                end

                render_success(message: "Quiz found", data: quiz.quiz_entries)
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

                status, result =
                  Quizzes::Inviter.new(
                    id: params[:id],
                    user: current_user,
                    data: params[:invites]
                  ).call

                render_error(message: result, code: 400) if status != :ok

                render_success(message: result)
              end

              desc "Delete a quiz"

              delete do
                authenticate!

                public_id = params[:id]

                status, result, code =
                  Quizzes::Destroyer.new(
                    public_id: public_id,
                    user: current_user
                  ).call

                render_error(message: result, code: code) if status != :ok

                return(render_success(message: result))
              end
            end
          end
        end
      end
    end
  end
end
