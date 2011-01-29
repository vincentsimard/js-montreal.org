#!/usr/bin/env ruby
#$LOAD_PATH.unshift *Dir["#{File.dirname(__FILE__)}/vendor/**/lib"]
require 'rubygems'
require 'haml'
require 'open-uri'
require 'md5'
require 'json'
require 'sinatra'
require 'date'

disable :run

# What could possibly go wrong?
def read_json_file(path)
  JSON.parse(File.open(path){ |f| f.read })
end

# That's right our database is the file system.
module Model
  # Reverse chronological
  MEETUPS = read_json_file('data/meetups.json').sort{ |a,b| b["num"] <=> a["num"] }
  PURPOSE = read_json_file('data/purpose.json')
  LINKS   = read_json_file('data/links.json')

  MENU = [{ :label => "Current", :href => "/", :cls => "current", :section => "index"},
          { :label => "Previously", :href => "meetups", :section => "previously"},
          { :label => "Where is it?", :href => "map", :section => "map"},
          { :label => "Want to present?", :href => "present", :section => "present"},
          { :label => "About", :href => "about", :section => "about"}]

  SITE = {
    :index      => { :label => "Current", :href => "/", :cls => "current" },
    :previously => { :label => "Previously", :href => "meetups" },
    :directions => { :label => "Where is it?", :href => "map" },
    :present    => { :label => "Want to present?", :href => "present" },
    :about      => { :label => "About", :href => "about" }
  }
end

helpers do
  
  # Returns the URL for the gravatar image associated with the email
  def gravaturl(email)
    hash = MD5::md5(email.downcase)
    "http://www.gravatar.com/avatar/#{hash}"
  end

  # Builds the top menu like a boss.
  def menu(current)
    Model::MENU.map{ |m|
      li_class = [current == m[:section] ? "selected" : "", m[:cls].to_s].join(" ")
      "<li class=\"#{li_class}\"><a href=\"#{m[:href]}\">#{m[:label]}</a>"
    }.join("")
  end
  
  # Is this meetup happening in the past?
  def past?(meetup)
    Date.parse(meetup["on"]) < Date.today
  end
end

before do
  # We're gonna need those
  @links = Model::LINKS
end

get "/meetups/?" do
  @section = "previously"

  # Exclude the current meeting
  haml :meetups, :locals => { :meetups => Model::MEETUPS.reject{ |m| m == Model::MEETUPS.first }}
end

get "/?" do
  @section = "index"
  haml :index, :locals => { :meetup => Model::MEETUPS.first }
end

get "/about/?" do
  @section = "about"
  haml :about, :locals => { :purpose => Model::PURPOSE }
end

get "/present/?" do
  @section = "present"
  haml :present, :locals => { :purpose => Model::PURPOSE }
end

# Return the contents of the Yahoo Pipe
# The pipe contains good shit.  It is displayed in the rainbow.
get "/data/js-links" do
  content_type :json
  expires (60*60*24), :public, :must_revalidate
  begin
    pipe = "_id=8ddf68d81456be270ea845566f3698b2&_render=json"
    pipe_content = open("http://pipes.yahoo.com/pipes/pipe.run?#{pipe}").read
    body JSON.generate(JSON.parse(pipe_content)["value"]["items"])
  rescue
    body "[]"
  end
end

get "/map/?" do
  @section = "map"
  haml :map
end

# Configuration
set :app_file, __FILE__
set :root, File.dirname(__FILE__)
set :public, Proc.new { File.join( root, "public") }

