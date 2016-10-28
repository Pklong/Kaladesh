require 'sinatra'
require 'sinatra/reloader' if development?
require 'json'

get '/articles' do
  file = JSON.parse(File.read("./views/articles.json"))
  @titles = file.map { |x| [x["url"], x["title"]] }

  erb :index
end
