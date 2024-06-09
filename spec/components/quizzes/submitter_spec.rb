require "rails_helper"

RSpec.describe "Quizzes::Submitter" do
  describe "call" do
    it "should submit a quiz successfully" do
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

      quiz.aasm.fire!(:publish)

      quiz_entry =
        FactoryBot.create(
          :quiz_entry,
          participant_email: "email@example.com",
          quiz: quiz
        )

      entry_payload = {
        email: "email@example.com",
        permalink: quiz.permalink,
        entry: [{ question: "question 1", answers: %w[Option1] }]
      }

      status, _ = Quizzes::Submitter.new(entry_payload).call
      expect(status).to eq(:ok)

      quiz_entry.reload

      expect(quiz_entry.taken_at).to be_present
      expect(quiz_entry.score).to eq(1)
    end

    it "should prevent a quiz entry from being submitted if the user is not enrolled" do
      quiz = FactoryBot.create(:quiz)

      quiz.aasm.fire!(:publish)

      quiz_entry =
        FactoryBot.create(:quiz_entry, participant_email: "email@example.com")

      entry_payload = {
        email: "wrongemail@example.com",
        permalink: quiz.permalink,
        entry: [{ question: "question 1", answers: %w[Option1] }]
      }

      status, result = Quizzes::Submitter.new(entry_payload).call
      expect(status).to eq(:error)

      quiz_entry.reload

      expect(result).to eq("Participant not enrolled for the quiz")
      expect(quiz_entry.taken_at).not_to be_present
      expect(quiz_entry.score).not_to be_present
    end

    it "should prevent a quiz entry from being submitted if the user has taken the quiz" do
      quiz = FactoryBot.create(:quiz)

      quiz.aasm.fire!(:publish)

      quiz_entry =
        FactoryBot.create(
          :quiz_entry,
          score: 0,
          quiz: quiz,
          taken_at: Time.current,
          participant_email: "email@example.com"
        )

      entry_payload = {
        email: "email@example.com",
        permalink: quiz.permalink,
        entry: [{ question: "question 1", answers: %w[Option1] }]
      }

      status, result = Quizzes::Submitter.new(entry_payload).call
      expect(status).to eq(:error)

      quiz_entry.reload

      expect(result).to eq("The quiz has already been taken!")
      expect(quiz_entry.score).to eq(0)
    end

    it "should prevent a quiz entry from being submitted if the quiz is not published" do
      quiz = FactoryBot.create(:quiz)

      quiz.aasm.fire!(:archive)
      FactoryBot.create(:quiz_entry, participant_email: "email@example.com")

      entry_payload = {
        email: "email@example.com",
        permalink: quiz.permalink,
        entry: [{ question: "question 1", answers: %w[Option1] }]
      }

      status, result = Quizzes::Submitter.new(entry_payload).call
      expect(status).to eq(:error)
      expect(result).to eq("The quiz requested was not found")
    end
  end
end
