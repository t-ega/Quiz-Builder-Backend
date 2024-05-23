class Quiz < ApplicationRecord
  scope :pub_id, ->(public_id) { where(public_id: public_id) }
  default_scope { where(status: "DRAFT") }

  STATUSES = %w[DRAFT PUBLISHED].freeze

  validates :title, presence: true, length: { minimum: 3, maximum: 30 }
  # Duration is in seconds
  validates :duration,
            presence: true,
            numericality: {
              only_integer: true,
              greater_than: 0
            }

  validates :opens_at, presence: true
  validates :closes_at, presence: true
  validate :opens_at_in_future
  validate :closes_at_after_opens_at

  validates :status,
            inclusion: {
              in: STATUSES,
              message: "%{value} is not a valid status"
            }

  before_create :generate_public_id # This is how every quiz would be referenced

  belongs_to :user
  has_many :questions, dependent: :destroy
  accepts_nested_attributes_for :questions

  private

  def opens_at_in_future
    if opens_at.present? && opens_at <= Time.current
      errors.add(:opens_at, "must be in the future")
    end
  end

  def closes_at_after_opens_at
    if closes_at.present? && opens_at.present? && closes_at <= opens_at
      errors.add(:closes_at, "must be after opens_at")
    end
  end

  def generate_public_id
    loop do
      self.public_id = SecureRandom.uuid
      break unless Quiz.exists?(public_id: public_id)
    end
  end
end