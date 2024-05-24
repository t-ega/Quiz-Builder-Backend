class SendQuizInviteService < ApplicationService
  def initialize(id, user, data)
    @id = id
    @user = user
    @data = data
  end

  def call
    quiz = Quiz.pub_id(@id).current_user(@user).first
    return if quiz.nil?

    # Create the invite

    SendInviteJob.perform_later(
      quiz: quiz.as_json,
      host: @user.email,
      invites: @data
    )
    true
  end
end
