class Quiz < ApplicationRecord
  scope :pub_id, ->(public_id) { where(public_id: public_id) }

  STATUSES = %w[DRAFT PUBLISHED].freeze

  validates :title, presence: true, length: { min: 3, max: 30 }
  # Duration is in seconds
  validates :duration,
            presence: true,
            numericality: {
              only_integer: true,
              greater_than: 0
            }
  validates :opens_at,
            optional: true,
            numericality: {
              greater_than_or_equal: Time.current.to_i
            }
  validates :closes_at,
            optional: true,
            numericality: {
              greater_than: (Time.current + 10.min.from_now),
              message:
                "Quiz closing time must be minimum ten minutes from publish time"
            }
  validates :status,
            inclusion: {
              in: STATUSES,
              message: "%{value} is not a valid status"
            }

  before_create :generate_public_id # This is how every quiz would be referenced

  belongs_to :user
  has_many :questions, dependent: :destroy

  private

  def generate_public_id
    loop do
      self.public_id = SecureRandom.uuid
      break unless Quiz.exists?(public_id: public_id)
    end
  end
end
