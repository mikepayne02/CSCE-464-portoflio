import type { APIRoute } from 'astro'

import { siteConfig } from '@/site-config'

const { title } = siteConfig

export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify({
      name: title,
      short_name: 'Mike Payne',
      start_url: import.meta.env.BASE_URL,
      icons: [
        {
          src: '/favicon-dark/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/favicon-dark/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ],
      theme_color: '#070708',
      background_color: '#070708',
      display: 'standalone'
    })
  )
}
