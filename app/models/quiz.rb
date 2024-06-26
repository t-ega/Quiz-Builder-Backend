class Quiz < ApplicationRecord
  include AASM
  scope :pub_id, ->(public_id) { where(public_id: public_id) }
  scope :current_user, ->(current_user) { where(user: current_user) }
  scope :published, -> { where(status: "published") }
  scope :permalink, ->(permalink) { where(permalink: permalink) }

  STATUSES = %w[draft published archived].freeze

  aasm whiny_persistence: true, column: :status do
    state :draft, initial: true
    state :published, before_enter: :generate_permalink
    state :archived

    event :publish do
      transitions from: %i[draft archived], to: :published
    end

    event :archive do
      transitions from: %i[draft published], to: :archived
    end
  end

  # These are the attributes that can be modified when the quiz has been published
  ALLOWED_ATTRIBUTES_WHEN_PUBLISHED = %w[status].freeze

  # TODO: Re-visit this later with Abiodun
  validate :quiz_published, on: :update

  validates :title, presence: true, length: { minimum: 3, maximum: 30 }

  validates :status,
            inclusion: {
              in: STATUSES,
              message: "%{value} is not a valid status."
            }

  before_create :generate_public_id # This is how every quiz would be referenced

  belongs_to :user
  has_many :quiz_entries, dependent: :destroy

  def questions_count
    questions.size
  end

  def quiz_questions
    questions.map do |question|
      {
        question: question["question"],
        question_type: question["question_type"],
        options: extract_only_options(question["options"])
      }
    end
  end

  private

  def extract_only_options(options)
    options.each_with_object([]) do |option, result|
      result << { option: option["option"] }
    end
  end

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

  def quiz_published
    # check if the previous status before this update was from a draft state
    # Uses ActiveRecord#dirty to achieve this
    previous_status_was_not_draft = status_was != Quiz::STATE_DRAFT.to_s
    if previous_status_was_not_draft && disallowed_changes_present?
      errors.add(:base, "Cannot modify a quiz once it's published!")
    end
  end

  def disallowed_changes_present?
    (changed - ALLOWED_ATTRIBUTES_WHEN_PUBLISHED).any?
  end

  def generate_public_id
    self.public_id = SecureRandom.uuid
  end

  def generate_permalink
    return if permalink.present?
    self.permalink = SecureRandom.alphanumeric(15)
  end
end
