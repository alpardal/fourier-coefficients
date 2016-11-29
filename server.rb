require "sinatra"
require "json"

files = Dir.glob(__dir__ + "/tables/*.json").map do
          |f| File.basename(f, File.extname(f))
        end

set :public_folder, "public"

get "/" do
  redirect "/index.html"
end

get "/tables" do
  content_type :json
  {tables: files}.to_json
end

get "/tables/:name" do
  content_type :json
  File.read(__dir__ + "/tables/#{params[:name]}.json")
end
