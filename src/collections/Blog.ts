import type { CollectionConfig } from 'payload'
import { revalidateTag, revalidatePath } from 'next/cache'

export const Blog: CollectionConfig = {
  slug: 'blog',
  defaultPopulate: {
    slug: true,
    title: true,
    excerpt: true,
    featuredImage: true,
    category: true,
    publishedAt: true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt'],
    group: 'Content',
    components: {
      views: {
        list: {
          Component: '/components/admin/BlogListView',
        },
      },
    },
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async () => {
        revalidateTag('blog-posts')
        revalidatePath('/', 'layout')
      },
    ],
  },
  fields: [
    // ===== ADMIN: AUTO-TRANSLATE BUTTON =====
    {
      name: 'translateActions',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/admin/TranslateButton',
        },
      },
    },
    // Basic Info
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Blog Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "best-time-for-balloon-rides")',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: 'Short summary for blog cards (150-200 characters recommended)',
      },
    },
    // Featured Image
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Featured Image',
    },
    // Content
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
      label: 'Blog Content',
    },
    // Categorization
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          required: true,
          index: true,
          options: [
            { label: 'Travel Tips', value: 'travel-tips' },
            { label: 'Experience Stories', value: 'experience-stories' },
            { label: 'Marrakech Guide', value: 'marrakech-guide' },
            { label: 'Photography', value: 'photography' },
            { label: 'Safety & FAQs', value: 'safety-faqs' },
            { label: 'Behind the Scenes', value: 'behind-the-scenes' },
          ],
          admin: {
            width: '50%',
          },
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'draft',
          index: true,
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
    },
    // Tags
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      admin: {
        description: 'Add relevant tags for better discoverability',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },
    // Author & Date
    {
      type: 'row',
      fields: [
        {
          name: 'author',
          type: 'text',
          required: true,
          localized: true,
          defaultValue: 'Lina House Team',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'publishedAt',
          type: 'date',
          required: true,
          index: true,
          admin: {
            width: '50%',
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'MMM d, yyyy',
            },
          },
        },
      ],
    },
    // Reading Time
    {
      name: 'readingTime',
      type: 'number',
      label: 'Reading Time (minutes)',
      min: 1,
      defaultValue: 5,
      admin: {
        description: 'Estimated reading time in minutes',
      },
    },
    // SEO Fields
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          localized: true,
          label: 'Meta Title',
          admin: {
            description: 'Leave empty to use blog title',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          localized: true,
          label: 'Meta Description',
          admin: {
            description: 'Leave empty to use excerpt',
          },
        },
        {
          name: 'keywords',
          type: 'array',
          label: 'Keywords',
          fields: [
            {
              name: 'keyword',
              type: 'text',
              required: true,
              localized: true,
            },
          ],
        },
      ],
    },
    // Related Posts
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'blog',
      hasMany: true,
      label: 'Related Posts',
      admin: {
        description: 'Select related blog posts to show at the bottom',
      },
    },
  ],
}
