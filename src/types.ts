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

export type SiteMeta = {
  title: string
  description?: string
  ogImage?: string | undefined
  articleDate?: string | undefined
}
