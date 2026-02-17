
module.exports = {
  apps: [{
    name: 'vyrtus-api',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
    }
  }]
}
