require "action_controller"
  require "uuid"
class Moneta::Web::Controller < ActionController::Metal
  use Rack::JSON
  use Rack::ContentType
  
  include Moneta::Web::Http
  include ActionController::RackDelegation
  
  class << self
    attr_accessor:logger
    attr_accessor:backend
  end
    
  def to_a
    logger.info([status, headers, response_body].inspect)
    super
  end
    
  def index
    backend[all] ||= []
    
    self.status = Found
    self.content_type = Mime::Json
    self.response_body = backend[all]
  end
  
  def create(object=json_data)
    id = UUID.generate
    logger.info("Storing #{id} => #{object.inspect}")
    backend[instance(id)] = object
    backend[all] ||= []
    backend[all] = backend[all] << url(id)

    self.status = Created
    self.location = url(id)
    self.response_body = ""
  end
  
  def show(id=params[:id])
    if object = backend[instance(id)]
      self.status = Found
      self.content_type = Mime::Json
      self.response_body = object
    else
      not_found!
    end
  end
  
  def update(id=params[:id], object=json_data)
    if backend.key?(instance(id))
      backend[instance(id)].merge
      okay!
    else
      not_found!
    end    
  end
  
  def destroy(id=params[:id])
    if backend.key?(instance(id))
      logger.info("DELETE #{request.path} from #{backend[all].inspect} #{(backend[all] - [request.path]).inspect}")
      backend.delete(instance(id))
      backend[all] = backend[all] - [request.path]
      okay!
    else
      not_found!
    end
  end

private
  def okay!
    self.status = 200
  end

  def not_found!
    self.status = 404
  end

  def all
    "#{controller_name}/all"
  end
  
  def instance(id)
    "#{controller_name}/#{id}"
  end

  def url(id)
    (Pathname.new(request.path) + id).to_s
  end
  
  def json_data
    env["rack.json.decoded"]
  end
  
  def backend
    self.class.backend
  end
  
  def logger
    self.class.logger
  end
end