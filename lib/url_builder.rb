class UrlBuilder
  class << self
    def quiz_permalink(permalink)
      base_url = ENV.fetch("PRODUCTION_HOST")
      base_url = base_url.delete_suffix("/")
      "#{base_url}/#{permalink}"
    end
  end
end
