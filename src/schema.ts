import { integer, sqliteTable, text, index } from 'drizzle-orm/sqlite-core'

export const views = sqliteTable(
  'views',
  {
    path: text('path').notNull().primaryKey(),
    count: integer('count').notNull().default(0)
  },
  (t) => [index('path_index').on(t.path)]
)

// --- Simplified Comments Table ---
export const comments = sqliteTable(
  'comments',
  {
    id: integer('id').primaryKey({ autoIncrement: true }), // Unique ID for each comment
    targetUrl: text('target_url').notNull(), // URL of the page being commented on
    authorName: text('author_name').notNull(), // Commenter's name (Required)
    email: text('email').notNull(), // Commenter's email (Required for Gravatar)
    commentText: text('comment_text').notNull(), // The actual comment content
    publishedAt: integer('published_at', { mode: 'timestamp_ms' }).notNull(), // When the comment was submitted
    approved: integer('approved', { mode: 'boolean' }).default(true).notNull(), // Moderation status (defaulting to approved for now)
    ipAddress: text('ip_address') // Optional: Store IP for moderation purposes
  },
  (t) => [
    // Index for quickly finding comments for a specific page
    index('target_url_idx').on(t.targetUrl),
    // Index for potentially filtering by approval status
    index('approved_idx').on(t.approved)
  ]
)

export type InsertComment = typeof comments.$inferInsert // Type for inserting comments
export type SelectComment = typeof comments.$inferSelect // Type for selecting comments
// --- End Comments Table ---

export type InsertView = typeof views.$inferInsert
