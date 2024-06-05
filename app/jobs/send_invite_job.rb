class SendInviteJob < ApplicationJob
  def perform(host:, quiz:, invites:)
    quiz = quiz.with_indifferent_access

    # quiz_duration = quiz[:duration]
    permalink = quiz[:permalink]
    url = UrlBuilder.quiz_permalink(permalink)

    # Register participant for the quiz if the participant has not yet been enrolled.

    invites&.map do |invitee|
      invitee = invitee.with_indifferent_access

      entry =
        QuizEntry.find_or_create_by(
          participant_email: invitee[:email],
          quiz_id: quiz[:id]
        )

      if entry.valid?
        # Only send the invite if the user has not taken the quiz
        return if entry.taken_at.present?

        # Ensure a user can't exceed the email limit
        return if (host.emails_sent >= ENV.fetch("MAX_EMAILS", 1).to_i)

        InviteMailer
          .with(participant: invitee, host: host, url: url, quiz: quiz)
          .quiz_invite
          .deliver_later
        return
      end

      # Log the details of the failure
      Rails.logger.error(
        {
          message: "Unable to create entry for #{invitee[:email]}!",
          error: entry.errors.full_messages,
          entry: entry
        }
      )
    end
  end
end
