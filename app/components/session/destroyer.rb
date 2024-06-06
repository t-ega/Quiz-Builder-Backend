module Session
  class Destroyer
    def initialize(token)
      @token = token
    end

    def call
      AuthenticationToken.revoke_token(@token)
      [:ok, nil]
    end
  end
end
