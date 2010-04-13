require "moneta"
require "moneta/basic_file"
require "rack"
require "lib/moneta/web"
require "lib/rack/json"
database = Moneta::BasicFile.new(:path => "database")

server = Moneta::Web::Server.new(:backend => database)
server.expose :blocks

use Rack::JSON
use Rack::Static, :urls => ["/css", "/images", "/javascripts", "/"], :root => "public"
run Rack::URLMap.new \
  "/tetris/db" => server