module API
  module V1
    module Client
      class Quiz < Grape::API
        namespace :quiz do
          desc "Get details about a quiz."

          params do
            requires :email, type: String, desc: "The email of the participant"
          end
          #   TODO: SERIALIZE RESPONSE
          get ":permalink/particpant" do
            quiz = ::Quiz.find_by(permalink: params[:permalink])
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

            return render_success(data: quiz)
          end
        end
      end
    end
  end
end
