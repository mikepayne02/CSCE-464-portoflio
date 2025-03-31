import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

function removeDupsAndLowerCase(array: string[]) {
  if (!array.length) return array
  const lowercaseItems = array.map((str) => str.toLowerCase())
  const distinctItems = new Set(lowercaseItems)
  return Array.from(distinctItems)
}

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.mdx', base: './src/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(60),
      description: z.string().min(40).max(160),
      publishDate: z
        .string()
        .or(z.date())
        .transform((val: any) => new Date(val)),
      updatedDate: z
        .string()
        .optional()
        .transform((str: any) => (str ? new Date(str) : undefined)),
      coverImage: z
        .object({
          src: image(),
          alt: z.string()
        })
        .optional(),
      draft: z.boolean().default(false),
      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      ogImage: z.string().optional(),
      ogManual: z.boolean().optional()
    })
})

export const collections = { projects }
