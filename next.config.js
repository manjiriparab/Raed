/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  },
}
module.exports = nextConfig
