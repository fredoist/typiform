/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'hd.unsplash.com'],
  },

  env: {
    // default site metadata
    title: 'Typiform',
    description: 'The simplest online form builder that works like a doc',
    icon: '/assets/img/icon.svg',
    url: 'https://typiform.vercel.app',
    og_image: 'https://typiform.vercel.app/assets/img/og/default-image.jpg',
  },
}
