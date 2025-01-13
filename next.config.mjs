/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        BACKEND_URL: "http://localhost:9999/api",
        WEBSOCKET_URL: "http://localhost:9999",
    }
};

export default nextConfig;
