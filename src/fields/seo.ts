import type { Field, Tab } from 'payload'

type SeoDefaults = {
  metaTitle?: string
  metaDescription?: string
  keywords?: string
}

export const seoFields = (defaults: SeoDefaults = {}): Field[] => [
  {
    name: 'metaTitle',
    type: 'text',
    label: 'Meta Title',
    localized: true,
    defaultValue: defaults.metaTitle,
    admin: {
      description: 'Shown in browser tab and search engines. Recommended: 50-60 characters.',
    },
  },
  {
    name: 'metaDescription',
    type: 'textarea',
    label: 'Meta Description',
    localized: true,
    defaultValue: defaults.metaDescription,
    admin: {
      description: 'Shown in search results. Recommended: 150-160 characters.',
    },
  },
  {
    name: 'keywords',
    type: 'text',
    label: 'Meta Keywords',
    localized: true,
    defaultValue: defaults.keywords,
    admin: {
      description: 'Comma-separated keywords (optional, low SEO impact today).',
    },
  },
  {
    name: 'ogImage',
    type: 'upload',
    relationTo: 'media',
    label: 'Social Share Image',
    admin: {
      description: 'Shown when the page is shared on Facebook, Twitter, WhatsApp. Recommended: 1200x630px.',
    },
  },
]

export const seoTab = (defaults: SeoDefaults = {}): Tab => ({
  label: 'SEO',
  description: 'Search engine and social share metadata for this page',
  fields: [
    {
      name: 'seo',
      type: 'group',
      label: false,
      fields: seoFields(defaults),
    },
  ],
})
