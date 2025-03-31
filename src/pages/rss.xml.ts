import { getAllProjects } from '@/utils/project'
import { siteConfig } from '@/site-config'
import rss from '@astrojs/rss'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  const posts = await getAllProjects()

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: import.meta.env.SITE,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/projects/${post.id}`
    }))
  })
}
