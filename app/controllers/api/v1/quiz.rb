module API
  module V1
    class Quiz < Grape::API
      helpers SharedParams

      namespace :quiz do
        desc "Create a quiz"

        params do
          requires "title", type: String, desc: "Title of the quiz"
          requires "duration",
                   type: String,
                   desc: "How long the quiz should be taken"
          requires "active",
                   type: String,
                   desc: "The status that shows if the quiz can be attempted"
          requires "opens_at",
                   type: String,
                   desc: "The opening time of the quiz"
          requires "closes_at",
                   type: String,
                   desc:
                     "The time when the quiz would no longer be valid to be taken"
          requires :questions_attributes, type: Array do
            use :question # Shared params
          end
        end

        post do
          authenticate!
          quiz = CreateQuizService.call(**params, user: current_user)

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

          quiz = ::Quiz.find_by(id: params[:id], user: current_user)

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
                   type: String,
                   desc: "How long the quiz should be taken"
          optional :active,
                   type: String,
                   desc: "The status that shows if the quiz can be attempted"

          optional :opens_at, type: String, desc: "The opening time of the quiz"
          optional :closes_at,
                   type: String,
                   desc:
                     "The time when the quiz would no longer be valid to be taken"
          optional :status,
                   type: String,
                   values: %w[DRAFT PUBLISHED],
                   desc: "The status of the quiz"
          optional :questions, type: Array do
            use :question # Shared params
          end
        end

        put ":id" do
          authenticate!
          quiz = UpdateQuizService.call(params)

          if quiz.errors.empty?
            return(
              render_success(message: "Quiz updated successfuly", data: quiz)
            )
          end

          render_error(
            message: Message.unprocessable_entity,
            errors: quiz.errors.full_messages,
            code: 422
          )
        end
      end
    end
  end
end
