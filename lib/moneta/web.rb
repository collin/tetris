require "pathname"
module Moneta::Web
  module Http
    MethodNotAllowed = 405
    Found = 302
    Created = 201
  
    Okay = [200, {}, []].freeze
    NotFound = [404, {}, []].freeze
    module Mime
      Json = "application/json".freeze
    end
  end
  
  class NoBackendError < ArgumentError; end

  def self.root
    @root ||= Pathname.new(__FILE__).dirname.expand_path + ".."
  end
  
  require root+"rack/json"
  require root+"moneta/web/controller"
  require root+"moneta/web/server"
end
