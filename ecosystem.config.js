module.exports = {
  apps: [
    {
      name: "zounz-server",
      script: "src/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
        MONGO_URI:
          "mongodb+srv://giaredmati:qJwdRX6O01fKqy3S@brainsmoothies.rbueu.mongodb.net/?retryWrites=true&w=majority&appName=brainsmoothies",
        SESS_NAME: "sid",
        SESS_SECRET: "secret!session",
        SESS_LIFETIME: 86400000,
      },
    },
  ],
};
