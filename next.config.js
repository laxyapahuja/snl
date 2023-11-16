/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        API_URL: process.env.API_URL,
    },
    eslint: {
        ignoreDuringBuilds: true,
    }
}

module.exports = nextConfig