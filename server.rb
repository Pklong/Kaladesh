require 'sinatra'
require 'sinatra/reloader' if development?
require 'json'

get '/api/articles' do
  file = JSON.parse(File.read("./views/articles.json"))
  @titles = file.map { |x| x["title"] }

  erb :index
end
