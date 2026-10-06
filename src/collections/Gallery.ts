import type { CollectionConfig } from 'payload'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'order'],
    group: 'Content',
    description: 'Manage gallery images displayed on the About page',
    components: {
      views: {
        list: {
          Component: '/components/admin/GalleryListView',
        },
      },
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Image Title',
      admin: {
        description: 'Title/caption for the image',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Image',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'experience',
      index: true,
      options: [
        { label: 'Balloon Flight', value: 'flight' },
        { label: 'Experience', value: 'experience' },
        { label: 'Breakfast', value: 'breakfast' },
        { label: 'Views & Scenery', value: 'views' },
        { label: 'Group Photos', value: 'group' },
        { label: 'Sunrise', value: 'sunrise' },
      ],
      admin: {
        description: 'Category for filtering and organization',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      label: 'Featured Image',
      admin: {
        description: 'Featured images are shown prominently on the About page',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      index: true,
      label: 'Display Order',
      admin: {
        description: 'Lower numbers appear first (0 = first)',
      },
    },
  ],
}
