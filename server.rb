require 'sinatra'
require 'byebug'
require 'json'

get '/api/articles' do
  file = JSON.parse(File.read("./data/articles.json"))
  titles = file.map { |x| "\\n" + x["title"] }
  erb :index
end
