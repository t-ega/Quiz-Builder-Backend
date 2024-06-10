require "rails_helper"

RSpec.describe "Session::Creator" do
  describe ".call" do
    it "should create a session for the user" do
      user =
        FactoryBot.create(:user, email: "test@gmail.com", password: "password")

      status, result =
        Session::Creator.new(email: "test@gmail.com", password: "password").call
      expect(status).to eq(:ok)
      expect(result.user_id).to eq(user.id)
      expect(result.expires_at).to be_present
    end

    it "should return an error if the email or password is incorrect" do
      FactoryBot.create(:user, email: "test@gmail.com", password: "password")

      status, result =
        Session::Creator.new(
          email: "test@gmail.com",
          password: "wrongpassword"
        ).call

      expect(status).to eq(:error)
      expect(result).to eq("Invalid email or password")
    end
  end
end
