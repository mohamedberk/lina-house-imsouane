import { GlobalConfig } from 'payload'
import { revalidateTag, revalidatePath } from 'next/cache'
import { seoFields } from '../fields/seo'

export const BlogPage: GlobalConfig = {
  slug: 'blog-page',
  label: 'Blog Page',
  admin: {
    description: 'Edit the Blog page content - header section, search placeholder, and category labels.',
    group: 'Pages',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async () => {
        revalidateTag('blog-page')
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
    // ===== SEO =====
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      admin: {
        description: 'Search engine and social share metadata for this page',
      },
      fields: seoFields({
        metaTitle: 'Blog | Lina House Imsouane',
        metaDescription: 'Surf tips, travel guides, and stories from Imsouane — read the Lina House blog.',
        keywords: 'Imsouane blog, surf travel blog, Morocco surf stories, Lina House blog',
      }),
    },
    // ===== HEADER SECTION =====
    {
      name: 'headerSection',
      type: 'group',
      label: 'Header Section',
      admin: {
        description: 'The header at the top of the blog page',
      },
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          label: 'Eyebrow Text',
          defaultValue: 'Stories from the Sky',
          localized: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Page Title',
          defaultValue: 'Our Blog',
          localized: true,
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Subtitle',
          defaultValue: 'Travel tips, breathtaking stories, and insider guides to make your hot air balloon adventure in Marrakech unforgettable.',
          localized: true,
        },
      ],
    },

    // ===== SEARCH & FILTERS =====
    {
      name: 'filtersSection',
      type: 'group',
      label: 'Search & Filters',
      admin: {
        description: 'Search and filter settings',
      },
      fields: [
        {
          name: 'searchPlaceholder',
          type: 'text',
          label: 'Search Placeholder',
          defaultValue: 'Search articles...',
          localized: true,
        },
        {
          name: 'allPostsLabel',
          type: 'text',
          label: 'All Posts Filter Label',
          defaultValue: 'All Posts',
          localized: true,
        },
      ],
    },

    // ===== EMPTY STATE =====
    {
      name: 'emptyState',
      type: 'group',
      label: 'Empty State',
      admin: {
        description: 'Messages shown when no posts are found',
      },
      fields: [
        {
          name: 'noPostsTitle',
          type: 'text',
          label: 'No Posts Title',
          defaultValue: 'No posts found',
          localized: true,
        },
        {
          name: 'noPostsMessage',
          type: 'text',
          label: 'No Posts Message',
          defaultValue: 'Try adjusting your search or filter criteria.',
          localized: true,
        },
      ],
    },

    // ===== READ MORE LABELS =====
    {
      name: 'labels',
      type: 'group',
      label: 'Labels & Text',
      admin: {
        description: 'Various labels used in blog cards',
      },
      fields: [
        {
          name: 'readMoreText',
          type: 'text',
          label: 'Read More Text',
          defaultValue: 'Read More',
          localized: true,
        },
        {
          name: 'readText',
          type: 'text',
          label: 'Read Text (Short)',
          defaultValue: 'Read',
          localized: true,
        },
        {
          name: 'byAuthorPrefix',
          type: 'text',
          label: 'Author Prefix',
          defaultValue: 'By',
          localized: true,
        },
        {
          name: 'minReadSuffix',
          type: 'text',
          label: 'Min Read Suffix',
          defaultValue: 'min read',
          localized: true,
        },
        {
          name: 'minSuffix',
          type: 'text',
          label: 'Min Suffix (Short)',
          defaultValue: 'min',
          localized: true,
        },
      ],
    },
  ],
}
