Rack::Attack.throttle("requests by ip", limit: 1, period: 1.minute) do |req|
  req.ip
end
