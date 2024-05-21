module API
  class Base < Grape::API
    mount API::V1::Base

    route :any, "*path" do
      error!({ success: false, message: Message.not_found, errors: nil }, 404)
    end
  end
end
