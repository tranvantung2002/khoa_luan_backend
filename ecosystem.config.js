module.exports = {
  apps: [{
    name: 'khoaluanha',
    script: 'index.js',
    watch_delay: 1000,
    args: '--max-old-space-size=3072',
    node_args: '--max-old-space-size=3072',
    autorestart: false,
    watch: false,
    max_memory_restart: '3G',
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    env: {
      NODE_ENV: 'development',
      UV_THREADPOOL_SIZE: 128
    },
    env_production: {
      NODE_ENV: 'production',
      UV_THREADPOOL_SIZE: 128
    }
  }],
};
