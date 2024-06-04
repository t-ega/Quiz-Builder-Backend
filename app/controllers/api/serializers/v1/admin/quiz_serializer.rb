module API
    module V1
        module Admin
            class QuizSerializer
                attributes :public_id, :status, :title, :opens_at, :closes_at, :permalink, :questions
            end
        end
    end
end