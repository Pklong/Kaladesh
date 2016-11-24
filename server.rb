require 'json'
require 'byebug'
require 'rack'
require 'erb'

ARTICLES = "./data/articles.json"
OVERFLOW_ARTICLES = "./data/more-articles.json"

class App
  def self.call(req)
    @req = Rack::Request.new(req)
    @res = Rack::Response.new
    @res['Content-Type'] = 'text/html'
    if @req.path == '/'
      @articles = JSON.parse(File.read(ARTICLES))
      response_body = ERB.new(File.read("views/index.erb")).result(binding)
    elsif @req.path == '/api/articles'
      @articles = JSON.parse(File.read(OVERFLOW_ARTICLES))
      response_body = ERB.new(File.read("views/articles.erb")).result(binding)
    else
      response_body = "<h1>THERE IS NOTHING HERE! FREAK OOOOUT</h1>"
      @res.status = 404
    end
    @res.write(response_body)
    @res.finish
  end
end

app = Rack::Builder.new do
  use Rack::Static, urls: ["/lib", "/css"]
  run App
end.to_app

Rack::Server.start({
  app: app,
  Port:3000
})
