module.exports = {
  apps: [
    {
      name: "rsaf-transport-portal-reactjs",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 2000,
      },
    },
  ],
}
