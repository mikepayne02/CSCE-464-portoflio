// https://github.com/sdnts/dietcode/blob/914e3970f6a0f555113768b12db3229dd822e6f1/astro.config.ts

import { access, copyFile, readFile, writeFile } from 'fs/promises'
import { siteConfig } from '../site.config'
import { getFormattedDate } from './date'
import type { AstroIntegration } from 'astro'
import parseFrontmatter from 'gray-matter'
import satori, { type SatoriOptions } from 'satori'
import { initWasm, Resvg } from '@resvg/resvg-wasm'
import { createHash } from 'crypto'
import { join } from 'path'

const render = ({
  title,
  profileImage,
  tags,
  date,
  coverImage
}: {
  title: string
  profileImage: Buffer
  tags: string[]
  date: Date
  coverImage: Buffer
}) => {
  const formattedDate = getFormattedDate(date)

  return {
    type: 'div',
    key: null,
    props: {
      tw: 'flex flex-col w-full h-full bg-[#18181b] text-[#fcfcfd]',
      children: [
        {
          type: 'img',
          key: null,
          props: {
            tw: 'rounded-full m-12',
            width: '220',
            height: '220',
            src: profileImage.buffer
          }
        },
        {
          type: 'img',
          key: null,
          props: {
            tw: 'absolute rounded-xl right-5 m-5',
            height: '350',
            src: coverImage.buffer
          }
        },
        {
          type: 'div',
          key: null,
          props: {
            tw: 'flex flex-col flex-1 w-full px-10 justify-center',
            children: [
              {
                type: 'p',
                props: {
                  tw: 'text-2xl mb-4',
                  children: formattedDate
                }
              },
              {
                type: 'h1',
                key: null,
                props: {
                  tw: 'text-6xl font-bold leading-snug text-white',
                  children: title
                }
              }
            ]
          }
        },
        {
          type: 'div',
          key: null,
          props: {
            tw: 'flex items-center justify-between w-full px-10 py-5 border-t border-[#60a5fa] text-xl',
            children: [
              {
                type: 'div',
                key: null,
                props: {
                  tw: 'flex items-center',
                  children: {
                    type: 'svg',
                    key: null,
                    props: {
                      xmlns: 'http://www.w3.org/2000/svg',
                      width: '100',
                      height: '100',
                      viewBox: '0 0 648 648',
                      children: {
                        type: 'path',
                        key: null,
                        props: {
                          d: 'M466.85,205.14c-13.08-13.08-30.46-20.28-48.96-20.28s-35.88,7.2-48.96,20.28l-90.84,90.84-44.24-44.24c-13.08-13.08-30.46-20.28-48.96-20.28s-35.88,7.2-49,20.32l-48.15,48.15c-.26.19-.5.39-.74.63l-67.31,67.31c-2.6,2.6-2.6,6.83,0,9.43,1.3,1.3,3.01,1.95,4.71,1.95s3.41-.65,4.71-1.95l26.05-26.05c25.55-23.09,58.13-24.01,80.55-1.79l39.83,39.83-65.96,65.96c-2.6,2.6-2.6,6.83,0,9.43,1.3,1.3,3.01,1.95,4.71,1.95s3.41-.65,4.71-1.95l65.96-65.96,44.16,44.16c13.08,13.07,30.46,20.28,48.95,20.28s35.88-7.2,48.95-20.28l90.85-90.85,90.84,90.84c13.08,13.08,30.46,20.28,48.96,20.28s35.88-7.2,48.96-20.28c13.08-13.08,20.28-30.47,20.28-48.96s-7.2-35.88-20.28-48.96l-139.8-139.8ZM282.87,300.76c11.5-10.36,26.22-16.03,41.82-16.03,16.71,0,32.43,6.51,44.24,18.32l44.18,44.18c-11.5,10.36-26.23,16.03-41.82,16.03-16.71,0-32.43-6.51-44.24-18.33l-44.18-44.18Z',
                          fill: '#fcfcfd',
                          stroke: 'none'
                        }
                      }
                    }
                  }
                }
              },
              {
                type: 'p',
                key: null,
                props: {
                  children: tags.map((tag) => `#${tag}`).join(' ')
                }
              },
              {
                type: 'div',
                key: null,
                props: {
                  tw: 'flex items-center',
                  children: [
                    {
                      type: 'p',
                      key: null,
                      props: {
                        tw: 'mr-4',
                        children: 'by'
                      }
                    },
                    {
                      type: 'p',
                      key: null,
                      props: {
                        tw: 'text-2xl font-bold',
                        children: siteConfig.author
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  }
}

let codegenDir: URL

export const og = (): AstroIntegration => ({
  name: 'opengraph',
  hooks: {
    'astro:config:setup': ({ createCodegenDir }) => {
      codegenDir = createCodegenDir()
    },
    'astro:build:done': async ({ dir, pages, logger }) => {
      logger.info('Generating opengraph images')
      const startTime = performance.now()

      // Load and initialize the resvg wasm module
      const index_bg = await readFile(
        'node_modules/@resvg/resvg-wasm/index_bg.wasm'
      )
      await initWasm(index_bg)

      // Read custom fonts into Buffers
      const firaCodeRegular = await readFile(
        'src/assets/fonts/FiraCode-Regular.ttf'
      )
      const firaCodeBold = await readFile('src/assets/fonts/FiraCode-Bold.ttf')

      // Set dimension and font options
      const satoriOptions: SatoriOptions = {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Fira Code',
            data: firaCodeRegular,
            weight: 400
          },
          {
            name: 'Fira Code',
            data: firaCodeBold,
            weight: 600
          }
        ]
      }

      // Load profile image common to all thumbnails
      const profileImage = await readFile('src/assets/profile.png')

      // Configurable pattern to match pages
      const ogPaths = new RegExp(`^projects/.+`)

      // Filter out all pages that aren't posts and hence don't require a custom image
      const filteredPages = pages.filter(({ pathname }) =>
        ogPaths.test(pathname)
      )

      // For every resolved page, do the following:
      for (const [index, { pathname }] of filteredPages.entries()) {
        // Start a hash to test for a chached image later
        const hash = createHash('sha256')

        // 3. Locate the source file for this resolved page. This depends heavily on your setup, but it should be straight-forward to do. After all, resolved pages and your source content would follow a similar structure!
        const page = pathname.slice(0, -1)
        const file = await readFile(`src/${page}.mdx`).catch(() =>
          readFile(`src/${page}/index.mdx`)
        )

        const itemStart = performance.now()

        // 4. Parse frontmatter for our source file and extract important details
        const frontMatterData = parseFrontmatter(file).data
        const { title, tags, publishDate, ogImage } = frontMatterData
        hash.update(JSON.stringify(frontMatterData))

        // Mix the cover image into the hash
        const coverImage = await readFile(ogImage)

        hash.update(new Uint8Array(coverImage))

        // Compute the cached file path and the corresponding path in the dist folder where it should be placed during build
        const digest = hash.digest('base64').substring(0, 10).replace('/', '_')
        const cacheFilePath = new URL(`${digest}.png`, codegenDir)
        const outputFilePath = join(dir.pathname, pathname, 'og.png')

        const cacheHit = await access(cacheFilePath)
          .then(() => true)
          .catch(() => false)

        // If we can access the cached thumbnail, copy it to its final location
        if (cacheHit) {
          await copyFile(cacheFilePath, outputFilePath)
        } else {
          // Render our SVG. The `render` function returns the JSX object that we talked about. I've separated this out just to keep things easy to follow
          const jsx = render({
            title,
            profileImage,
            tags,
            coverImage: coverImage,
            date: publishDate
          })
          // Convert the JSX to SVG using Satori
          const svg = await satori(jsx, satoriOptions)
          // Convert the SVG to PNG using Resvg
          const png = new Resvg(svg).render().asPng()
          // Write this PNG to a predictable location. I keep this right next to the page itself. That way, I can link to it easily.
          await writeFile(outputFilePath, png)
          // Save the cached PNG to the cache folder so it doesn't have to be re-generated on every build
          await writeFile(cacheFilePath, png)
        }

        const itemEnd = performance.now()
        logger.info(
          `/${pathname}og.png \x1b[90m ` +
            (cacheHit ? '(reused cache entry) ' : '') +
            `(+${(itemEnd - itemStart).toFixed(0)}ms) (${
              index + 1
            }/${filteredPages.length})\x1b[0m`
        )
      }

      const endTime = performance.now()

      // Just some fancy success message to make this plugin look like it belongs
      logger.info(
        `Generated OpenGraph images in ${((endTime - startTime) / 1000).toFixed(
          2
        )}s`
      )
    }
  }
})
