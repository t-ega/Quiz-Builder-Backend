FactoryBot.define do
  factory :quiz_entry do
    participant_email { "email@example.com" }
    quiz do
      FactoryBot.create(
        :quiz,
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
      )
    end
  end
end
