class InviteMailer < ApplicationMailer
  default from: "invitations@#{ENV.fetch("PRODUCTION_HOST")}"

  after_deliver :record_email_delivered_event

  def quiz_invite
    @email = params.dig(:participant, :email)
    @first_name = params.dig(:participant, :first_name)
    @last_name = params.dig(:participant, :last_name)
    @host = params[:host]
    @quiz = params[:quiz]
    @url = params[:url]
    mail(to: @email, subject: "You have been invited to take a quiz!")
  end

  def record_email_delivered_event
    @host.update_emails_sent_count
  end
end
