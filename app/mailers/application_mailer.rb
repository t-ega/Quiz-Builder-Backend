class ApplicationMailer < ActionMailer::Base
  default from: "system@#{ENV.fetch("PRODUCTION_HOST")}"
  layout "mailer"
end
