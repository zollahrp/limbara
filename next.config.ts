/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', // Mengizinkan semua folder di dalam Cloudinary
      },
    ],
  },
};

export default nextConfig;
