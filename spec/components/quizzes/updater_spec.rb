RSpec.describe "Quizzes::Updater" do
  describe "update" do
    it "should update a quiz successfully" do
      quiz = FactoryBot.create(:quiz)
      update_payload = { title: "Changed title" }

      status, _ =
        Quizzes::Updater.new(
          quiz_id: quiz.public_id,
          update_options: update_payload
        ).call

      expect(status).to eq(:ok)
      quiz.reload

      expect(quiz.title).to eq("Changed title")
      expect(quiz.status).to eq(Quiz::STATE_DRAFT.to_s)
    end

    it "should throw an error if a quiz has been published" do
      quiz = FactoryBot.create(:quiz)
      quiz.aasm.fire!(:publish)

      update_options = { title: "Changed title" }

      status, result =
        Quizzes::Updater.new(
          quiz_id: quiz.public_id,
          update_options: update_options
        ).call

      expect(status).to eq(:error)
      expect(result).to eq(["Cannot modify a quiz once it's published!"])
      quiz.reload

      expect(quiz.title).not_to eq("Changed title")
      expect(quiz.status).to eq(Quiz::STATE_PUBLISHED.to_s)
    end

    it "should publish a quiz successfully" do
      quiz = FactoryBot.create(:quiz)
      expect(quiz.permalink).not_to be_present

      update_options = { status: "publish" }

      status, _ =
        Quizzes::Updater.new(
          quiz_id: quiz.public_id,
          update_options: update_options
        ).call

      expect(status).to eq(:ok)

      quiz.reload
      expect(quiz.status).to eq(Quiz::STATE_PUBLISHED.to_s)
      expect(quiz.permalink).to be_present
    end
  end
end
