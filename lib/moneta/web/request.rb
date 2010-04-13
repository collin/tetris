class Request < Rack::Request
  def json_data
    env["rack.json.decoded"]      
  end
  
  def pathname
    Pathname.new(path)
  end
  
  def options?
    request_method == "OPTIONS"
  end
end
