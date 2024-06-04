class InviteMailer < ApplicationMailer
  default from: "system@quiz-builder.com"

  def quiz_invite
    @email = params.dig(:participant, :email)
    @first_name = params.dig(:participant, :first_name)
    @last_name = params.dig(:participant, :last_name)
    @host = params[:host]
    @quiz = params[:quiz]
    @url = params[:url]
    mail(to: @email, subject: "You have been invited to take a quiz!")
  end
end
