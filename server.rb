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
    if @req.path == '/'
      @articles = JSON.parse(File.read(ARTICLES))
      index = ERB.new(File.read("views/index.erb")).result(binding)
      @res['Content-Type'] = 'text/html'
      @res.write(index)
    elsif @req.path == '/api/articles'
      json = File.read(OVERFLOW_ARTICLES)
      @res.write(json)
    end
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
