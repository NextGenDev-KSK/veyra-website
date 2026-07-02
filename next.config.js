/** @type {import('next').NextConfig} */

// On GitHub Pages a project site is served from a subpath (e.g. /veyra-website).
// CI sets NEXT_PUBLIC_BASE_PATH to that subpath; local dev leaves it empty so the
// site runs at the root of http://localhost:9002.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath,
};

export default nextConfig;
