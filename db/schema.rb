# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_05_24_001533) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "authentication_tokens", force: :cascade do |t|
    t.string "token"
    t.bigint "user_id", null: false
    t.datetime "expires_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_authentication_tokens_on_user_id"
  end

  create_table "options", force: :cascade do |t|
    t.string "text"
    t.bigint "question_id", null: false
    t.boolean "is_right"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["question_id"], name: "index_options_on_question_id"
  end

  create_table "questions", force: :cascade do |t|
    t.string "text"
    t.bigint "quiz_id", null: false
    t.string "question_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["quiz_id"], name: "index_questions_on_quiz_id"
  end

  create_table "quiz_entries", force: :cascade do |t|
    t.string "participant_email"
    t.integer "duration"
    t.integer "score"
    t.bigint "quiz_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "taken_at"
    t.index ["quiz_id"], name: "index_quiz_entries_on_quiz_id"
  end

  create_table "quiz_entry_answers", force: :cascade do |t|
    t.bigint "quiz_entries_id", null: false
    t.bigint "option_id", null: false
    t.datetime "answered_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["option_id"], name: "index_quiz_entry_answers_on_option_id"
    t.index ["quiz_entries_id"], name: "index_quiz_entry_answers_on_quiz_entries_id"
  end

  create_table "quizzes", force: :cascade do |t|
    t.string "title", null: false
    t.datetime "duration"
    t.datetime "opens_at"
    t.string "public_id", null: false
    t.datetime "closes_at"
    t.bigint "user_id", null: false
    t.string "permalink"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_quizzes_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "authentication_tokens", "users"
  add_foreign_key "options", "questions"
  add_foreign_key "questions", "quizzes"
  add_foreign_key "quiz_entries", "quizzes"
  add_foreign_key "quiz_entry_answers", "options"
  add_foreign_key "quiz_entry_answers", "quiz_entries", column: "quiz_entries_id"
  add_foreign_key "quizzes", "users"
end
