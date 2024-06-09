FactoryBot.define do
  factory :quiz do
    title { "title" }
    user { FactoryBot.create(:user) }
    questions do
      [
        {
          question: "question 1",
          type: QuestionType::MULTIPLE_CHOICE,
          options: [
            { option: "Option1", is_right: "true" },
            { option: "Option2", is_right: "false" }
          ]
        }
      ]
    end
  end
end
