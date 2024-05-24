module QuizService
  class FetchQuizService < ApplicationService
    def initialize(permalink, email)
      @email = email
      @permalink = permalink
    end

    def call
    end
  end
end
