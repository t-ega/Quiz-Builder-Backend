class QuizSubmissionMailer < ApplicationMailer
  def new_entry_notification(quiz, quiz_entry)
    @quiz = quiz
    @quiz_entry = quiz_entry
    @host = @quiz.user

    mail(to: @host.email, subject: "New Quiz Entry Recorded")
  end
end
