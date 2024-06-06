class QuizEntryNotificationMailer < ApplicationMailer
  default from:
            "Quiz Builder <notifications@#{URI(ENV.fetch("PRODUCTION_HOST")).host}>"

  after_deliver :record_email_delivered_event

  def new_entry_notification(quiz:, quiz_entry:)
    @quiz = quiz
    @quiz_entry = quiz_entry
    @host = @quiz.user

    mail(to: @host.email, subject: "New Quiz Entry Recorded")
  end

  def record_email_delivered_event
    @host.update_emails_sent_count
  end
end
