begin
  require 'yajl'
  require 'yajl/json_gem'
rescue
  require 'json'
end

module Rack
  class JSON
    Mime = "application/json".freeze
    
    def initialize app
      @app = app
    end
   
    def call(env)
      request = Rack::Request.new(env)
      decode_json!(request)
      status, headers, body = @app.call env
      body = ::JSON.dump body if headers['Content-Type'] == Mime
      [status, headers, [body]]
    end
   
    def decode_json!(request)
      return unless request.content_type == Mime
      return unless request.put? or request.post?
      request.body.rewind
      request.env["rack.json.decoded"] = ::JSON.load(request.body.read)
    end
  end
end
