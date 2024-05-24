class SendInviteJob < ApplicationJob
  def perform(host:, quiz:, invites:)
    quiz = quiz.with_indifferent_access

    # quiz_duration = quiz[:duration]
    permalink = quiz[:permalink]
    url = UrlBuilder.quiz_permalink(permalink)

    # Register participant for the quiz if the participant has not yet been enrolled.

    invites&.map do |invitee|
      entry =
        QuizEntry.find_or_create_by(
          participant_email: invitee["email"],
          quiz_id: quiz["id"]
        )

      if entry.valid?
        InviteMailer
          .with(participant: invitee, host: host, url: url)
          .quiz_invite
          .deliver_later
        return
      end

      # Log the details of the failure
      Rails.logger.error(
        {
          message: "Unable to create entry for #{invitee["email"]}!",
          error: entry.errors,
          entry: entry
        }
      )
    end
  end
end
