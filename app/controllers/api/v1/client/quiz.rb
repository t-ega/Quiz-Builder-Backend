module API
  module V1
    module Client
      class Quiz < Grape::API
        namespace :quiz do
          #   TODO: SERIALIZE RESPONSE
          route_param :permalink do
            desc "Get details about the quiz."

            get do
              quiz =
                ::Quiz.find_by_permalink_and_published(params[:permalink], true)

              if quiz.blank?
                render_error(
                  message: Message.not_found,
                  errors: "No quiz was found",
                  code: 404
                )
              end

              render_success(
                data: {
                  quiz:
                    quiz.as_json(
                      only: %i[public_id title duration],
                      methods: :questions_count,
                      include: {
                        user: {
                          only: %i[username]
                        }
                      }
                    )
                }
              )
            end

            desc "Get the quiz questions"

            params do
              requires :email,
                       type: String,
                       desc: "The email of the participant"
            end

            get :questions do
              quiz =
                ::Quiz.includes(:quiz_entries).find_by_permalink_and_published(
                  params[:permalink],
                  true
                )

              if quiz.blank?
                render_error(
                  message: Message.not_found,
                  errors: "No quiz was found",
                  code: 404
                )
              end

              email = params[:email].downcase
              quiz_entry = quiz.quiz_entries.find_by(participant_email: email)

              if quiz_entry.blank?
                render_error(
                  message: Message.unprocessable_entity,
                  errors: "You're not registered for this quiz!",
                  code: 401
                )
              end

              if quiz_entry.taken_at?.present?
                render_error(
                  message: Message.unprocessable_entity,
                  errors: "Quiz has been taken",
                  code: 401
                )
              end

              render_success(
                data: {
                  quiz:
                    quiz.as_json(
                      only: %i[public_id title duration],
                      methods: :quiz_questions
                    )
                }
              )
            end

            params do
              requires :email,
                       type: String,
                       desc: "The email of the participant"
              requires :first_name,
                       type: String,
                       desc: "The first name of the participant"
              requires :last_name,
                       type: String,
                       desc: "The last name of the participant"
            end

            post :invite do
              quiz = ::Quiz.find_by_permalink(params[:permalink])

              if quiz.blank?
                render_error(
                  message: Message.not_found,
                  errors:
                    "No open quiz was found. Kindly reach out to your host.",
                  code: 404
                )
              end

              invite_payload = [
                {
                  email: params[:email].downcase,
                  first_name: params[:first_name].titleize,
                  last_name: params[:last_name].downcase
                }
              ]

              status, result =
                Quizzes::Inviter.new(
                  id: quiz.public_id,
                  user: quiz.user,
                  data: invite_payload
                ).call

              if status != :ok
                render_error(message: Message.unprocessable_entity, code: 400)
              end

              render_success(message: result)
            end

            params do
              requires :email,
                       type: String,
                       desc: "The email of the participant"
              requires :entry, type: Array do
                requires :question, type: String
                requires :answers, type: Array[String]
              end
            end

            post :submit do
              valid_params = declared(params, include_parent_namespaces: false)
              valid_params[:permalink] = params[:permalink]
              status, result = Quizzes::Submitter.new(valid_params).call

              if status != :ok
                render_error(
                  message: Message.unprocessable_entity,
                  errors: result,
                  code: 422
                )
              end

              render_success(message: "Quiz submitted")
            end
          end
        end
      end
    end
  end
end
