require "moneta"
require "moneta/basic_file"
require "rack"
require "lib/moneta/web"
require "logger"
database = Moneta::BasicFile.new(:path => "database")

server = Moneta::Web::Server.new(:backend => database)
server.resources :Blocks

run Rack::URLMap.new \
  "/tetris/db" => server,
  "/" =>  Rack::Directory.new("public")