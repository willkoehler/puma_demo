require "bundler"

Bundler.require

require "./lib/app"
run Sinatra::Application
