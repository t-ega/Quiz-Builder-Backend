FactoryBot.define do
  factory :user do
    username { "username" }
    email { Faker::Internet.email }
    password { "password" }
    password_confirmation { "password" }
  end
end
