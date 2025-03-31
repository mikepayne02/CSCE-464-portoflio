import type { SiteConfig } from '@/types'

export const siteConfig: SiteConfig = {
  // Used as both a meta property (src/components/BaseHead.astro L:31 + L:49) & the generated satori png (src/pages/og-image/[slug].png.ts)
  author: 'Michael Payne',
  // Meta property used to construct the meta title property, found in src/components/BaseHead.astro L:11
  title: 'Michael Payne',
  contactEmail: 'michael@mail.mikepayne.me',
  // Meta property used as the default description meta property
  description: "Michael Payne's Portfolio",
  // HTML lang property, found in src/layouts/Base.astro L:18
  lang: 'en-US',
  // Meta property, found in src/components/BaseHead.astro L:42
  ogLocale: 'en_US',
  // Option to sort posts by updatedDate if set to true (if property exists). Default (false) will sort by publishDate
  sortPostsByUpdatedDate: false,
  // Date.prototype.toLocaleDateString() parameters, found in src/utils/date.ts.
  date: {
    locale: 'en-US',
    options: {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  },
  bucketEndpoint: 'https://content.mikepayne.me',
  webmentions: {
    // Webmention.io API endpoint. Get your own here: https://webmention.io/, and follow this blog post: https://astro-cactus.chriswilliams.dev/posts/webmentions/
    link: 'https://webmention.io/www.mikepayne.me/webmention'
  }
}

export const menuLinks: Array<{ title: string; path: string }> = [
  {
    title: 'Projects',
    path: '/projects/'
  },
  {
    title: 'Skills',
    path: '/tools/'
  }
]
