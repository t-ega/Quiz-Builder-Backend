require "rails_helper"
require "active_support/testing/time_helpers"

RSpec.describe AuthenticationToken, type: :model do
  include ActiveSupport::Testing::TimeHelpers

  it { should belong_to(:user) }
  it { should validate_presence_of(:token) }

  it "should revoke a token " do
    user = FactoryBot.create(:user)
    expires_at = 1.day.from_now
    token =
      AuthenticationToken.create(
        token: "random",
        user: user,
        expires_at: expires_at
      )

    freeze_time do
      revoked_token = AuthenticationToken.revoke_token(token.token)
      expect(revoked_token).to be_truthy

      token.reload
      expect(token.expires_at).to eq(Time.current)
    end
  end

  it "should find a user given their token" do
    user = FactoryBot.create(:user)
    token =
      AuthenticationToken.create(
        token: "random",
        user: user,
        expires_at: 1.day.from_now
      )

    user_from_token =
      AuthenticationToken.find_user_by_authentication_token(token.token)
    expect(user_from_token.id).to eq(user.id)
  end

  it "should not return a user given their token has expired" do
    user = FactoryBot.create(:user)
    token =
      AuthenticationToken.create(
        token: "random",
        user: user,
        expires_at: 1.day.from_now
      )

    travel 2.day do
      user_from_token =
        AuthenticationToken.find_user_by_authentication_token(token.token)
      expect(user_from_token).to be_falsy
    end
  end
end
