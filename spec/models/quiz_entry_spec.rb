require "rails_helper"

RSpec.describe QuizEntry, type: :model do
  it { should validate_presence_of(:participant_email) }
  it do
    should normalize(:participant_email).from(" MYEMAIL@XYZ.COM\n ").to(
             "myemail@xyz.com"
           )
  end
  it { should allow_value("myemail@example.com").for(:participant_email) }
  it { should_not allow_value("email").for(:participant_email) }
  it { should belong_to(:quiz).counter_cache(true) }

  describe "create" do
    let!(:quiz) { FactoryBot.create(:quiz) }

    it "it should prevent quiz update if it has been graded" do
      entry =
        QuizEntry.create(
          participant_email: "email@xyz.com",
          taken_at: Time.now,
          score: 0,
          quiz: quiz
        )

      expect(entry.valid?).to be_truthy

      # Should not be able to update once the quiz has a taken_at and score
      updated_entry = entry.update(participant_email: "newemail@xyz.com")
      expect(updated_entry).to be_falsy

      expect(entry.errors[:base]).to eq ["cannot modify this entry!"]
    end
  end
end
