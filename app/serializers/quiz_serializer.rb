class QuizSerializer < ActiveModel::Serializer
  attributes :id
  has_many :questions
end
