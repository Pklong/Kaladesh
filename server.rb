require 'sinatra'
require 'sinatra/reloader' if development?
require 'sinatra/json'
require 'json'
require 'byebug'

ARTICLES = "./views/articles.json"
OVERFLOW_ARTICLES = "./views/more-articles.json"

get '/' do

end

get '/articles' do
  page_view = params["page"] || 1
  file ||= JSON.parse(File.read(ARTICLES))

  articles(file)

  @tags = file.map do |x|
    x["tags"].map { | y| y["name"] }
  end
  erb :index
end

get '/api' do
  json JSON.parse(File.read(OVERFLOW_ARTICLES))
end


private
  def articles(p)
    @titles = []
    10.times do |x|
      title = p.shift()
      @titles << [title["url"], title["title"]]
    end
    @titles
  end
