silence_single_worker_warning

before_fork do
  require "puma_worker_killer"

  PumaWorkerKiller.config do |config|
    config.ram = 1024 # mb
    config.frequency = 0.3  # seconds
    config.reaper_status_logs = true # setting this to false will not log lines like:
    # PumaWorkerKiller: Consuming 54.34765625 mb with master and 2 workers.
  end

  PumaWorkerKiller.start
end
