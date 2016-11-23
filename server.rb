require 'sinatra'
require 'sinatra/reloader' if development?
require 'sinatra/json'
require 'json'
require 'byebug'

ARTICLES = "./data/articles.json"
OVERFLOW_ARTICLES = "./data/more-articles.json"

get '/' do
  @articles = JSON.parse(File.read(ARTICLES))
  erb :index
end

get '/api/articles' do
  json JSON.parse(File.read(OVERFLOW_ARTICLES))
end
