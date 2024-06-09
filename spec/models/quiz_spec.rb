require "rails_helper"

RSpec.describe Quiz, type: :model do
  it { should validate_length_of(:title).is_at_least(3) }
  it { should validate_length_of(:title).is_at_most(30) }

  it do
    should validate_inclusion_of(:status).in_array(
             %w[draft archived published]
           ).with_message(/is not a valid status/)
  end

  it { should belong_to(:user) }
  it { should have_many(:quiz_entries) }
end
