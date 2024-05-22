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
          requires :questions, type: Array do
            use :question # Shared params
          end
        end

        post do
          quiz = CreateQuizService.call(params)
          if quiz.valid?
            success_response(message: "Quiz created successfuly", data: quiz)
            return
          end
          error_response(
            message: Message.unprocessable_entity,
            errors: quiz.errors.full_messages,
            code: 422
          )
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
          optional :questions, type: Array do
            use :question # Shared params
          end
        end
      end
    end
  end
end
