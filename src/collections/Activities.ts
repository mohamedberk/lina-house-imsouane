import type { CollectionConfig } from 'payload'
import { revalidateTag, revalidatePath } from 'next/cache'
import { iconOptions } from '../lib/iconMap'
import { seoTab } from '../fields/seo'

export const Activities: CollectionConfig = {
  slug: 'activities',
  defaultPopulate: {
    slug: true,
    title: true,
    images: true,
    price: true,
    priceUnit: true,
    order: true,
    badge: true,
    duration: true,
    features: true,
    bookingLink: true,
    bookingText: true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'activityType', 'slug', 'price', 'order'],
    group: 'Content',
    components: {
      beforeListTable: ['/components/admin/TranslateAllCollectionButton'],
    },
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async () => {
        revalidateTag('activities')
        revalidateTag('homepage')
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
    {
      type: 'tabs',
      tabs: [
        // ── Tab 1: Card Info ──
        {
          label: 'Card Info',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'activityType',
              type: 'select',
              index: true,
              options: [
                { label: 'Lesson', value: 'lesson' },
                { label: 'Rental', value: 'rental' },
              ],
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true,
            },
            {
              name: 'badge',
              type: 'text',
              localized: true,
              admin: {
                description: 'e.g. "All Levels", "Most Popular", "Best Value"',
              },
            },
            {
              name: 'order',
              type: 'number',
              defaultValue: 0,
              index: true,
            },
            {
              name: 'images',
              type: 'array',
              minRows: 1,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'alt',
                  type: 'text',
                },
              ],
            },
            {
              name: 'price',
              type: 'number',
              required: true,
              admin: {
                description: 'Price in EUR (e.g. 18)',
              },
            },
            {
              name: 'priceUnit',
              type: 'text',
              localized: true,
              admin: {
                description: 'e.g. "/ session", "/ day", "/ person"',
              },
            },
            {
              name: 'duration',
              type: 'text',
              localized: true,
              admin: {
                description: 'e.g. "2h Session", "Per Day"',
              },
            },
            {
              name: 'features',
              type: 'array',
              maxRows: 6,
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  localized: true,
                },
              ],
            },
            {
              name: 'bookingLink',
              type: 'text',
              admin: {
                description: 'WhatsApp or booking URL',
              },
            },
            {
              name: 'bookingText',
              type: 'text',
              localized: true,
              defaultValue: 'Book Now',
            },
          ],
        },
        // ── Tab 2: Description ──
        {
          label: 'Description',
          fields: [
            {
              name: 'tagline',
              type: 'text',
              localized: true,
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              localized: true,
            },
          ],
        },
        // ── Tab 3: Lesson Details ──
        {
          label: 'Lesson Details',
          fields: [
            {
              name: 'level',
              type: 'text',
              localized: true,
              admin: {
                description: 'e.g. "All levels", "Beginner"',
              },
            },
            {
              name: 'groupSize',
              type: 'text',
              localized: true,
              admin: {
                description: 'e.g. "1 person", "2-4 people", "Large group"',
              },
            },
          ],
        },
        // ── Tab 4: Included / Not Included ──
        {
          label: 'Included / Not Included',
          fields: [
            {
              name: 'includes',
              type: 'array',
              label: 'What\'s Included',
              fields: [
                {
                  name: 'item',
                  type: 'text',
                  required: true,
                  localized: true,
                },
              ],
            },
            {
              name: 'notIncluded',
              type: 'array',
              label: 'Not Included',
              fields: [
                {
                  name: 'item',
                  type: 'text',
                  required: true,
                  localized: true,
                },
              ],
            },
          ],
        },
        // ── Tab 5: Highlights ──
        {
          label: 'Highlights',
          fields: [
            {
              name: 'highlights',
              type: 'array',
              maxRows: 4,
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  options: [...iconOptions],
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  localized: true,
                },
                {
                  name: 'desc',
                  type: 'text',
                  localized: true,
                },
              ],
            },
          ],
        },
        // ── Tab 6: Booking ──
        {
          label: 'Booking',
          fields: [
            {
              name: 'waMessage',
              type: 'text',
              localized: true,
              admin: {
                description: 'WhatsApp pre-filled message',
              },
            },
          ],
        },
        // ── Tab 7: SEO ──
        seoTab(),
      ],
    },
  ],
}
