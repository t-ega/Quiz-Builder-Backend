class QuizEntryNotificationMailer < ApplicationMailer
  after_deliver :record_email_delivered_event

  def new_entry_notification(quiz:, quiz_entry:)
    @quiz = quiz
    @quiz_entry = quiz_entry
    @host = @quiz.user

    # Ensure a user can't exceed the email limit
    return if (@host.emails_sent >= ENV.fetch("MAX_EMAILS", 1).to_i)

    mail(to: @host.email, subject: "New Quiz Entry Recorded")
  end

  def record_email_delivered_event
    @host.update_emails_sent_count
  end
end
