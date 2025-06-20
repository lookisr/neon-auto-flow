module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'backend/dist/index.js',
      cwd: process.cwd(),
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 5000
      }
    },
    {
      name: 'frontend',
      script: 'npx',
      args: 'serve -s dist -l 8080',
      cwd: process.cwd(),
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}; 