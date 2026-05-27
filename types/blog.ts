export interface PublicBlogPostSummary {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImageUrl: string | null
  publishedAt: string | null
}

export interface PublicBlogPost extends PublicBlogPostSummary {
  contentHtml: string
}
