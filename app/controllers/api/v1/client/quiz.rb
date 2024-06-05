module API
  module V1
    module Client
      class Quiz < Grape::API
        namespace :quiz do
          #   TODO: SERIALIZE RESPONSE
          route_param :permalink do
            desc "Get details about the quiz."

            get do
              quiz = ::Quiz.permalink(params[:permalink]).published.first

              if quiz.nil?
                render_error(
                  message: Message.not_found,
                  errors: "No quiz was found",
                  code: 404
                )
                return
              end

              return(
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
                ::Quiz
                  .includes(:quiz_entries)
                  .permalink(params[:permalink])
                  .published
                  .where("opens_at >= ? OR opens_at IS NULL", Time.current)
                  .first

              email = params[:email].downcase

              if quiz.nil?
                render_error(
                  message: Message.not_found,
                  errors: "No quiz was found",
                  code: 404
                )
                return
              end

              quiz_entry = quiz.quiz_entries.find_by(participant_email: email)

              if quiz_entry.nil?
                render_error(
                  message: Message.unprocessable_entity,
                  errors: "You're not registered for this quiz!",
                  code: 401
                )
                return
              end

              if quiz_entry.taken_at?.present?
                render_error(
                  message: Message.unprocessable_entity,
                  errors: "Quiz has been taken",
                  code: 401
                )
              end

              return(
                render_success(
                  data: {
                    quiz:
                      quiz.as_json(
                        only: %i[public_id title duration],
                        methods: :quiz_questions
                      )
                  }
                )
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
              quiz = ::Quiz.permalink(params[:permalink]).first

              if quiz.nil?
                render_error(
                  message: Message.not_found,
                  errors:
                    "No open quiz was found. Kindly reach out to your host.",
                  code: 404
                )
                return
              end

              invite = [
                {
                  email: params[:email].downcase,
                  first_name: params[:first_name].titleize,
                  last_name: params[:last_name].downcase
                }
              ]

              queued =
                QuizService::SendQuizInviteService.call(
                  quiz.public_id,
                  quiz.user,
                  invite
                )

              if queued
                return(
                  render_success(
                    message: "An email has been sent to your inbox."
                  )
                )
              end

              render_error(message: Message.unprocessable_entity, code: 400)
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
              submission = QuizService::QuizSubmissionService.new(valid_params)

              if submission.call
                return(
                  render_success(
                    message: "Quiz submitted",
                    data: submission.quiz_entry
                  )
                )
              end

              render_error(
                message: Message.unprocessable_entity,
                errors: submission.errors,
                code: 422
              )
            end
          end
        end
      end
    end
  end
end
