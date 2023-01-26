require "sinatra"

UPLOADS_PATH = File.join(settings.public_folder, "uploads")

get "/" do
  erb :home
end

post "/upload" do
  if params[:video] && params[:video][:filename]
    @filename = params[:video][:filename]
    video_path = File.join(UPLOADS_PATH, @filename)
    FileUtils.mkdir_p(UPLOADS_PATH)
    IO.copy_stream(params[:video][:tempfile].open, video_path)
  end

  erb :video
end
