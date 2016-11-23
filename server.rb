require 'json'
require 'byebug'
require 'rack'
require 'erb'

ARTICLES = "./data/articles.json"
OVERFLOW_ARTICLES = "./data/more-articles.json"

class App
  attr_reader :req, :res
  def self.call(req)
    @req = Rack::Request.new(req)
    @res = Rack::Response.new
    @articles = JSON.parse(File.read(ARTICLES))
    raw_template = File.read("views/articles.erb")
    bound_template = ERB.new(raw_template).result(binding)
    top = ERB.new(File.read("views/index.erb")).result(binding)
    @res['Content-Type'] = 'text/html'
    @res.write(top)
    @res.write(bound_template)
    @res.finish
  end
end

Rack::Server.start({
  app: App,
  Port:3000
})
