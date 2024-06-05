class ApplicationMailer < ActionMailer::Base
  default from: "system@#{URI(ENV.fetch("PRODUCTION_HOST")).host}>"
  layout "mailer"
end
