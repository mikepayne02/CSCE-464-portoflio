import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import tailwindcss from '@tailwindcss/vite'
import Icons from 'unplugin-icons/vite'
import pagefind from 'astro-pagefind'
import { defineConfig, envField } from 'astro/config'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeUnwrapImages from 'rehype-unwrap-images'
import { remarkReadingTime } from './src/utils/remark-reading-time.mjs'

const ReactCompilerConfig = {
  sources: (filename: string) => {
    return filename.indexOf('src/') !== -1
  }
}

// https://astro.build/config
export default defineConfig({
  site: 'https://www.mikepayne.me',
  integrations: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]]
      }
    }),
    pagefind(),
    mdx()
  ],
  env: {
    schema: {
      AUTHOR_EMAIL: envField.string({ context: 'server', access: 'public' }),
      MAPTILER_API_KEY: envField.string({
        context: 'client',
        access: 'public'
      }),
      MAP_DATA: envField.string({ context: 'client', access: 'public' }),
      TURNSTILE_SITE_KEY: envField.string({
        context: 'client',
        access: 'public'
      }),
      TURNSTILE_SECRET: envField.string({
        context: 'server',
        access: 'secret'
      }),
      RESEND_API_KEY: envField.string({
        context: 'server',
        access: 'secret'
      })
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
      Icons({
        compiler: 'astro'
      })
    ],
    resolve: import.meta.env.PROD ? {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: {
        "react-dom/server": "react-dom/server.edge",
      }
    } : {},
  },
  markdown: {
    remarkPlugins: [remarkReadingTime],
    rehypePlugins: [
      rehypeUnwrapImages,
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['nofollow, noopener, noreferrer']
        }
      ]
    ],
    remarkRehype: {
      footnoteLabelProperties: {
        className: ['underline']
      }
    }
  },
  prefetch: true,
  output: 'static',
  experimental: {
    contentIntellisense: true,
    clientPrerender: true
  },
  adapter: cloudflare({
    imageService: 'compile',
    platformProxy: {
      enabled: true
    }
  })
})
