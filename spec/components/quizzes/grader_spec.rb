RSpec.describe "Quizzes::Grader" do
  describe "grade" do
    it "should grade a quiz properly" do
      quiz =
        FactoryBot.create(
          :quiz,
          questions: [
            {
              question: "question 1",
              type: QuestionType::MULTIPLE_CHOICE,
              options: [
                { option: "Option1", is_right: true },
                { option: "Option2", is_right: false }
              ]
            }
          ]
        )

      quiz_entry =
        FactoryBot.create(
          :quiz_entry,
          quiz: quiz,
          answers: [{ question: "question 1", answers: %w[Option1] }]
        )

      success = Quizzes::Grader.new(quiz_entry.id).call
      expect(success).to be_truthy

      quiz_entry.reload
      expect(quiz_entry.score).to eq(1)
    end
  end
end
