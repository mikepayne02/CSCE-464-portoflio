import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { drizzle } from 'drizzle-orm/d1'
import { views } from 'src/schema'
import { sql } from 'drizzle-orm'

export default defineAction({
  accept: 'json',
  input: z.string(),
  handler: async (path, { locals }) => {
    const db = drizzle(locals.runtime.env.DB)

    try {
      await db
        .insert(views)
        .values({
          path: path,
          count: 1
        })
        .onConflictDoUpdate({
          target: views.path,
          set: {
            count: sql`${views.count} + 1`
          }
        })
      return { success: true }
    } catch (error) {
      console.error('Failed to increment page views:', error)
      return { success: false, error: 'Failed to update view count.' }
    }
  }
})
