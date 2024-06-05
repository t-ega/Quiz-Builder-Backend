# Quiz Builder Backend - README

Welcome to the Quiz Builder Backend! This application allows users to create, manage, and distribute quizzes with various question types. The backend is built using Ruby on Rails and Grape API library, with email functionalities powered by [Brevo](https://www.brevo.com/).

## Features

### User Management

- **User Registration and Authentication**: Users can register and sign in to the platform.

### Quiz Management

- **Create Quizzes**: Users can create quizzes with a maximum of 10 questions.
- **Question Types**: Supports three types of questions:
  - Yes or No
  - Multiple Choice
  - Multiple Right Answers (Select all that apply)
- **Options for Questions**: Each question can have 1 to 5 options.
- **Quiz Titles**: Each quiz has a title for easy identification.

### Quiz Links

- **Automated Link Generation**: Upon publishing a quiz, a unique alphanumeric link is generated.
- **Time Settings**: Users can set a time limit for taking the quiz.
- **Link Distribution**: Hosts can choose to send the quiz link via email.

### Taking the Quiz

- **Email-based Access**: Recipients use their email to access and take the quiz.
- **Single Attempt**: Each recipient can take the quiz only once.
- **Quiz Submission**: Recipients submit their answers for evaluation or they are submitted automatically if their time expires.

### Administration

- **Quiz Completion Notification**: Admins receive notifications when a quiz is completed.
- **User Quiz Tracking**: Admins can see who has taken the quiz, including their email and the time taken.
- **Draft Mode**: Quizzes can be saved as drafts and edited until published. **Note: Once published, quizzes cannot be edited.**

### Email Limitations

- **Email Sending Cap**: Each user is limited to sending a maximum of 5 emails to ensure efficient email usage.

## Installation and Setup

### Prerequisites

- Ruby (version 2.6.5 or higher)
- Rails (version 6.0 or higher)
- PostgreSQL (or another preferred database)

### Steps to Set Up

1. **Clone the Repository**:

   ```sh
   git clone https://github.com/t-ega/quiz-builder-backend.git
   cd quiz-builder
   ```

2. **Install Dependencies**:

   ```sh
   bundle install
   ```

3. **Database Setup**:

   ```sh
   rails db:create
   rails db:migrate
   ```

4. **Environment Configuration**:

   - Create a `.env` file in the root directory and add the following:

   ```sh
     PRODUCTION_HOST="https://yourfrontend.com"
    MAX_EMAILS=5
    SENDINBLUE_PASSWORD=
    SENDINBLUE_EMAIL=
   ```

5. **Start the Server**:
   ```sh
   rails server
   ```

### API Endpoints

#### User Management

- **Register**: `POST /api/v1/users/register`
- **Sign In**: `POST /api/v1/users/login`

#### Quiz Management

- **Create Quiz**: `POST /api/v1/admin/quizzes`
- **Update Quiz**: `PUT /api/v1/admin/quizzes/:id`

#### Taking the Quiz

- **Access Quiz**: `GET /api/v1/quizzes/:link`
- **Access Quiz Questions**: `GET /api/v1/quizzes/:id/questions?email=theuser@gmail.com`
- **Submit Quiz**: `POST /api/v1/quizzes/:id/submit`

#### Administration

### Email Functionality

- **Send Quiz Link**: The Brevo email service is used to send quiz links to recipients.

## Usage

### Register and Sign In

1. Register a new user by sending a `POST` request to `/api/v1/users/register` with the required parameters (e.g., email, password).
2. Sign in using the credentials to receive an authentication token.

### Create and Manage Quizzes

1. Create a new quiz by sending a `POST` request to `/api/v1/quizzes` with the quiz details.
2. Add questions and options to the quiz.
3. Set the quiz to draft mode or publish it to generate a unique link.
4. Use the unique link to distribute the quiz to recipients.

### Taking the Quiz

1. Recipients receive the quiz link via email.
2. Recipients use their email to access the quiz and submit their answers.

### Admin Monitoring

1. Admins can view completed quizzes and recipient details through the admin endpoints.

## Conclusion

The Quiz Builder Backend provides a robust and flexible platform for creating and managing quizzes.

I hope you love it!

## Contribution

You are always free to contribute to this project. Who knows it might be the next best open source headless library for tests management! Feel free to open a PR
