module API
  class Base < Grape::API
    mount API::V1::Base

    route :any, "*path" do
      all_paths = API::V1::Base.routes.map { |route| route.path }
      puts all_paths
      error!({ success: false, message: Message.not_found, errors: nil }, 404)
    end
  end
end
