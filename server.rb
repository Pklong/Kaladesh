require 'sinatra'
require 'sinatra/reloader' if development?
require 'json'
require 'byebug'

get '/articles' do
  file = JSON.parse(File.read("./views/articles.json"))
  @titles = file.map { |x| [x["url"], x["title"]] }
  @tags = file.map do |x|
    x["tags"].map { | y| y["name"] }
  end
  # byebug
  erb :index
end
