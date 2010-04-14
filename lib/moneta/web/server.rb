require "uuid"
class Moneta::Web::Server
  include Moneta::Web::Http
  
  attr_accessor:logger
  
  def initialize(options={})
    @backend = options[:backend] or raise(Moneta::Web::NoBackendError, "You MUST provide a Moneta backend option to initialize.")
    @logger = options[:logger] || Logger.new(STDOUT)
    @endpoints = []
    @regexp = /$^/
  end
  
  def expose(*names)
    @endpoints.push(names)
    @regexp = Regexp.new "(#{@endpoints.join('|')})/?([\\w-]+)?/?"
  end
    
  def call(env)
    @request = Request.new(env)
    _, endpoint, id = *@request.path.match(@regexp)
    logger.info "#{@request.request_method} #{@request.path_info}"
    return NotFound unless endpoint
    id ? member(endpoint, id) : collection(endpoint)
  end
  
  def member(endpoint, id)
    key = [endpoint,id].join("/")
    all = [endpoint,"all"].join("/")
    logger.info("Member #{key}")
    return [200, {"Allow" => "GET,PUT,DELETE,HEAD,OPTIONS"}, []] if @request.options?
    @backend.key?(key) or return NotFound
    if @request.get? || @request.head?
      [Found, {"Content-Type" => Mime::Json}, @backend[key]]
    elsif @request.put?
      @backend[key].merge(@request.json_data)
      Okay
    elsif @request.delete?
      @backend.delete(key)
      logger.info("DELETE #{@request.path} from #{@backend[all]} #{(@backend[all] - [@request.path]).inspect}")
      @backend[all] = @backend[all] - [@request.path]
      Okay
    else
      [MethodNotAllowed, {"Allow" => "GET,PUT,DELETE,HEAD,OPTIONS"}, []]
    end
  end
  
  def collection(endpoint)
    logger.info("Collection #{endpoint}")
    all = [endpoint,"all"].join("/")
    if @request.options?
      [200, {"Allow" => "POST,GET,HEAD,OPTIONS"}, []]
    elsif @request.get? or @request.head?
      return NotFound unless @backend[all]
      [Found, {"Content-Type" => Mime::Json}, @backend[all]]
    elsif @request.post?
      return BadRequest if @request.json_data.nil?
      new_id = UUID.generate
      @backend[[endpoint,new_id].join("/")] = @request.json_data
      @backend[all] = (@backend[all] or []).push(location(new_id))
      [Created, {"Location" => location(new_id) }, []]
    else
      [MethodNotAllowed, {"Allow" => "POST,GET,HEAD,OPTIONS"}, []]
    end
  end
  
  def location(id)
    (@request.pathname + id).to_s
  end
end