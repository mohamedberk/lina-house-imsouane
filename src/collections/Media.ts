import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  defaultPopulate: {
    alt: true,
    url: true,
    filename: true,
    mimeType: true,
    width: true,
    height: true,
    sizes: {
      thumbnail: { url: true, width: true, height: true },
      card: { url: true, width: true, height: true },
      hero: { url: true, width: true, height: true },
      hero2x: { url: true, width: true, height: true },
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: {
        description: 'Optional — can be added later. Improves accessibility and SEO.',
      },
    },
  ],
  upload: {
    bulkUpload: false,
    mimeTypes: [
      'image/*',
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/quicktime',
      'video/x-msvideo',
    ],
    staticDir: 'media',
    resizeOptions: {
      width: 2400,
      withoutEnlargement: true,
      fit: 'inside',
    },
    formatOptions: {
      format: 'webp',
      options: { quality: 75 },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: undefined,
        position: 'center',
        formatOptions: { format: 'webp', options: { quality: 75 } },
      },
      {
        name: 'card',
        width: 800,
        height: undefined,
        position: 'center',
        formatOptions: { format: 'webp', options: { quality: 75 } },
      },
      {
        name: 'hero',
        width: 1600,
        height: undefined,
        position: 'center',
        formatOptions: { format: 'webp', options: { quality: 75 } },
      },
      {
        name: 'hero2x',
        width: 2400,
        height: undefined,
        position: 'center',
        formatOptions: { format: 'webp', options: { quality: 70 } },
      },
    ],
  },
}
