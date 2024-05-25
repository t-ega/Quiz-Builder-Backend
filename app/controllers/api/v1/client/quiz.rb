module API
  module V1
    module Client
      class Quiz < Grape::API
        namespace :quiz do
          #   TODO: SERIALIZE RESPONSE
          route_param :permalink do
            desc "Get details about the user's quiz."

            params do
              requires :email,
                       type: String,
                       desc: "The email of the participant"
            end

            get do
              quiz = ::Quiz.permalink(params[:permalink]).first
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
                  message: Message.not_found,
                  errors: "No quiz entry was found",
                  code: 404
                )
                return
              end

              return render_success(data: { quiz: quiz, entry: quiz_entry })
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
              requires :answers, type: Array, as: :options_attributes do
                requires :id, as: :option_id, type: Integer
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
