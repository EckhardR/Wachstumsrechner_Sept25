module.exports = {
  apps : [
    {
      name        : "Growth-App",
      script      : "index.js",
      watch       : true,
      exec_mode  : "cluster",
      env: {
        "NODE_ENV": process.env.NODE_ENV,
        "PORT": process.env.BACKEND_PORT,
      },
      env_production : {
         "NODE_ENV": process.env.NODE_ENV
      }
    }
  ]
}
