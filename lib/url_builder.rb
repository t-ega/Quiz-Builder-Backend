class UrlBuilder
  class << self
    def quiz_permalink(permalink)
      base_url = ENV.fetch("PRODUCTION_HOST")
      "#{base_url}/quiz/#{permalink}"
    end
  end
end
