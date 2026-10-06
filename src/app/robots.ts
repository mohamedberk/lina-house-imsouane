import { MetadataRoute } from 'next'

const aiCrawlers = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'CCBot',
  'Bytespider',
  'Applebot-Extended',
  'Amazonbot',
  'Meta-ExternalAgent',
  'cohere-ai',
  'DuckAssistBot',
  'YouBot',
  'Diffbot',
  'MistralAI-User',
] as const

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      ...aiCrawlers.map((bot) => ({
        userAgent: bot,
        allow: '/',
        disallow: ['/admin/', '/api/'],
      })),
    ],
    sitemap: 'https://linahouse-imsouane.com/sitemap.xml',
  }
}
