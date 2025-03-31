export type SiteConfig = {
  author: string
  title: string
  description: string
  contactEmail: string
  lang: string
  ogLocale: string
  sortPostsByUpdatedDate: boolean
  date: {
    locale: string | string[] | undefined
    options: Intl.DateTimeFormatOptions
  }
  bucketEndpoint: string
  webmentions?: {
    link: string
    pingback?: string
  }
}

export type PaginationLink = {
  url: string
  text?: string
  srLabel?: string
}

export type SiteMeta = {
  title: string
  description?: string
  ogImage?: string | undefined
  articleDate?: string | undefined
}

/** Webmentions */
export type WebmentionsFeed = {
  type: string
  name: string
  children: WebmentionsChildren[]
}

export type WebmentionsCache = {
  lastFetched: string | null
  children: WebmentionsChildren[]
}

export type WebmentionsChildren = {
  type: string
  author: Author | null
  url: string
  published?: string | null
  'wm-received': string
  'wm-id': number
  'wm-source': string
  'wm-target': string
  'wm-protocol': string
  syndication?: string[] | null
  content?: Content | null
  'mention-of': string
  'wm-property': string
  'wm-private': boolean
  rels?: Rels | null
  name?: string | null
  photo?: string[] | null
  summary?: Summary | null
}

export type Author = {
  type: string
  name: string
  photo: string
  url: string
}

export type Content = {
  'content-type': string
  value: string
  html: string
  text: string
}

export type Rels = {
  canonical: string
}

export type Summary = {
  'content-type': string
  value: string
}

export type TurnstileOutcome = {
  success: boolean
  'error-codes'?: string[]
}

// --- NEW/UPDATED Unified Display Type ---
export type DisplayComment = {
  id: string // Unique identifier (e.g., "d1-123" or "wm-456")
  author?: {
    // Author is optional (mainly for webmentions that might lack it)
    name: string
    photo: string // Avatar URL (Gravatar or from webmention)
    // No 'url' field anymore
  }
  publishedDate: Date
  sourceUrl?: string // URL of the comment source (primarily for Webmentions)
  targetUrl: string // URL of the post being commented on
  htmlContent: string // Sanitized HTML content to display
  sourceType: 'webmention' | 'comment' // To differentiate source
}
// --- End DisplayComment Type ---
