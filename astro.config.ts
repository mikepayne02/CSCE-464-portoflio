import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import Icons from 'unplugin-icons/vite'
import pagefind from 'astro-pagefind'
import { defineConfig, envField, fontProviders } from 'astro/config'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeUnwrapImages from 'rehype-unwrap-images'
import { remarkReadingTime } from './src/utils/remark-reading-time.mjs'
import { og } from './src/utils/opengraph'

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
    sitemap(),
    pagefind(),
    mdx(),
    og()
  ],
  env: {
    schema: {
      AUTHOR_BIRTHDAY: envField.string({
        context: 'server',
        access: 'secret'
      }),
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
      }),
      WEBMENTION_API_KEY: envField.string({
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
    resolve: {
      // Temporary Workaround
      // SEE: https://github.com/withastro/adapters/pull/436#issuecomment-2525190557
      //
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      //
      // @ts-ignore
      alias: import.meta.env.PROD && {
        'react-dom/server': 'react-dom/server.edge'
      }
    }
  },
  image: {
    domains: ['webmention.io']
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
  prefetch: {
    prefetchAll: true
  },
  output: 'static',
  experimental: {
    contentIntellisense: true,
    clientPrerender: true,
    fonts: [
      {
        provider: fontProviders.google(),
        name: 'Fira Sans',
        cssVariable: '--font-sans',
        weights: [400, 500, 600, 700],
        styles: ['normal', 'italic'],
        subsets: ['latin']
      },
      {
        provider: fontProviders.google(),
        name: 'Fira Code',
        cssVariable: '--font-mono',
        weights: [400, 500, 600, 700],
        styles: ['normal'],
        subsets: ['latin']
      }
    ]
  },
  adapter: cloudflare({
    imageService: 'compile',
    platformProxy: {
      enabled: true,
      configPath: 'wrangler.jsonc'
    }
  })
})
