# Puma large file upload demo

This is a simple app to demonstrate memory used by Puma for large file uploads and
compare it to proposed changes in PR https://github.com/puma/puma/pull/3062

### Steps to reproduce:

- Run the app `bundle exec puma -p 3000`
- Visit <http://localhost:3000/>
- Watch memory of ruby process with `top`, MacOS Activity Monitor, etc
- Use Chrome dev tools to throttle network bandwidth so you can monitor memory
  usage as upload progresses. I created a "Fast WiFi Upload" profile with 20 MBit/s
  upload bandwidth. See <https://css-tricks.com/throttling-the-network/>
- Choose a large video file (100Mb is good). Click "Upload" and watch memory use as
  the upload progresses. You will noticed process memory increase. I typically see
  memory grow from ~40MB to ~90MB during the upload.
- Sometimes garbage collection runs, dropping memory usage during the upload. This
  seems to be common when running several uploads in a row. But memory
  usage will continue to grow after that.
- Memory will jump when Puma hands the request off to Rack. This can probably
  also be improved. But that will require a change to Rack and it's out of scope
  for this PR.

### Steps to demonstrate benefits of PR https://github.com/puma/puma/pull/3062

- Update the Gemfile to use the PR version of Puma: `gem "puma", github: "willkoehler/puma", branch: "reduce_read_body_memory"`
- Restart the app and repeat steps above. You will noticed that memory stays fixed during
  the upload.

### Testing using `curl` and memory logging from `puma_worker_killer`

- Run the app with puma_worker_killer: `bundle exec puma -p 3000 --config puma.rb -w 1`
- Send a POST request with curl: `curl --form "video=@your_video.mp4" --limit-rate 10M http://localhost:3000/upload`
- Puma will log memory usage in the console
