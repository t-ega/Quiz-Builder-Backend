module Quizzes
  class Submitter
    def initialize(data)
      @data = data.with_indifferent_access
    end

    def call
      @quiz =
        Quiz.includes(:quiz_entries).find_by_permalink_and_status(
          data[:permalink],
          :published
        )

      return :error, "The quiz requested was not found" if quiz.blank?

      @quiz_entry = quiz.quiz_entries.find_by(participant_email: data[:email])
      if quiz_entry.blank?
        return :error, "The quiz entry requested was not found"
      end

      if quiz_entry.taken_at.present?
        return :error, "The quiz has already been taken!"
      end

      submit_quiz_entry
    end

    private

    attr_reader :quiz, :quiz_entry, :data

    def submit_quiz_entry
      if quiz_entry.update(answers: data[:entry], taken_at: Time.current)
        Grader.new(quiz_entry.id).call
        send_notification
        return [:ok]
      end

      [:error, "The quiz could not be recorded!"]
    end

    def send_notification
      host = quiz.user
      # Ensure a user can't exceed the email limit
      return if (host.emails_sent >= ENV.fetch("MAX_EMAILS", 1).to_i)

      QuizEntryNotificationMailer.new_entry_notification(
        quiz: @quiz_entry.quiz,
        quiz_entry: @quiz_entry
      ).deliver_later
    end
  end
end
