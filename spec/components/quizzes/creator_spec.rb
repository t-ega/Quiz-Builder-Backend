RSpec.describe "Quizzes::Creator" do
  describe "create" do
    let(:user) { FactoryBot.create(:user) }

    it "should create a quiz successfully" do
      quiz_payload = {
        title: "Title",
        user: user,
        questions: [
          {
            question: "question 1",
            type: QuestionType::MULTIPLE_CHOICE,
            options: [
              { option: "Option1", is_right: "true" },
              { option: "Option2", is_right: "false" }
            ]
          }
        ]
      }

      status, result = Quizzes::Creator.new(quiz_payload).call

      expect(Quiz.count).to eq(1)

      expect(status).to eq(:ok)

      expect(result.valid?).to be_truthy
      expect(result.permalink).to_not be_present
      expect(result.public_id).to be_present
      expect(result.status).to eq(Quiz::STATE_DRAFT.to_s)
      expect(result.questions_count).to eq(1)
    end
  end
end
