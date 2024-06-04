module API
    module V1
      module Admin
        class QuizInfoSerializer < ActiveModel::Serializer
            attributes :title, :duration, :questions_count

            def questions_count
              questions.count
            end
        end
      end
    end
end