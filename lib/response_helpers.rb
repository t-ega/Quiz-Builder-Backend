module ResponseHelpers
  def render_success(message:, data: nil)
    { status: true, message: message, data: data }
  end

  def render_error(message:, errors: nil, code:)
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
