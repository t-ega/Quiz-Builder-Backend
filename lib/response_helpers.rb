module ResponseHelpers
  def success_response(message:, data:)
    { status: true, message: message, data: data }
  end

  def error_response(message:, errors:, code:)
    error!(
      {
        success: false,
        message: message,
        errors: errors,
        timestamp: Time.current
      },
      code
    )
  end
end
