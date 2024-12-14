/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BACKEND_URL: "https://memomeet-be.onrender.com/api",
        WEBSOCKET_URL: "https://memomeet-be.onrender.com",
    }
};

export default nextConfig;
