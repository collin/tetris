require "moneta"
require "moneta/basic_file"
require "rack"
require "lib/moneta/web"
require "lib/rack/json"
require "logger"
database = Moneta::BasicFile.new(:path => "database")

server = Moneta::Web::Server.new(:backend => database)
server.expose :blocks

use Rack::JSON
use Rack::ContentType
run Rack::URLMap.new \
  "/tetris/db" => server,
  "/" =>  Rack::Directory.new("public")