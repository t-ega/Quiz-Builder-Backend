RSpec.describe "Quizzes::Inviter" do
  describe "invite" do
    it "should queue the invite email" do
      user = FactoryBot.create(:user)
      quiz = FactoryBot.create(:quiz, user: user)
      quiz.aasm.fire!(:publish) # Only published are allowed to be invited to

      invite_payload = [
        {
          first_name: "firstname",
          last_name: "lastname",
          email: "email@email.com"
        }
      ]

      status, result =
        Quizzes::Inviter.new(
          id: quiz.public_id,
          user: user,
          data: invite_payload
        ).call

      expect(status).to eq(:ok)
      expect(result).to eq("Quiz invite sent successfully")

      expect(SendInviteJob).to have_been_enqueued
    end
  end
end
