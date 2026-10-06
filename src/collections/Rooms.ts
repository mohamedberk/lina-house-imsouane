import type { CollectionConfig } from 'payload'
import { revalidateTag, revalidatePath } from 'next/cache'
import { iconOptions } from '../lib/iconMap'
import { seoTab } from '../fields/seo'

export const Rooms: CollectionConfig = {
  slug: 'rooms',
  defaultPopulate: {
    slug: true,
    name: true,
    images: true,
    price: true,
    order: true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'price', 'order'],
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
        revalidateTag('rooms')
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
              name: 'name',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true,
              admin: {
                description: 'URL-friendly name, e.g. "single", "female-dorm"',
              },
            },
            {
              name: 'badge',
              type: 'text',
              localized: true,
              admin: {
                description: 'e.g. "Most Popular", "Best Value", "Premium"',
              },
            },
            {
              name: 'order',
              type: 'number',
              defaultValue: 0,
              index: true,
              admin: {
                description: 'Display order (lower = first)',
              },
            },
            {
              name: 'detail',
              type: 'text',
              localized: true,
              admin: {
                description: 'e.g. "1 guest · Private room · Shared bathroom"',
              },
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
                description: 'Price per night in EUR (e.g. 18)',
              },
            },
            {
              name: 'priceBreakfast',
              type: 'number',
              admin: {
                description: 'Price with breakfast in EUR (e.g. 22). Leave empty if N/A.',
              },
            },
            {
              name: 'rating',
              type: 'text',
              admin: {
                description: 'e.g. "4.9"',
              },
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
              admin: {
                description: 'e.g. "Your private retreat in Imsouane"',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              localized: true,
            },
          ],
        },
        // ── Tab 3: Room Specs ──
        {
          label: 'Room Specs',
          fields: [
            {
              name: 'guests',
              type: 'number',
              required: true,
              defaultValue: 1,
            },
            {
              name: 'beds',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: 'e.g. "1 single bed", "1 double bed"',
              },
            },
            {
              name: 'bathroom',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: 'e.g. "Shared bathroom", "Private shower"',
              },
            },
            {
              name: 'amenities',
              type: 'array',
              maxRows: 10,
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  options: [...iconOptions],
                },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  localized: true,
                },
              ],
            },
          ],
        },
        // ── Tab 4: Highlights ──
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
        // ── Tab 5: House Rules ──
        {
          label: 'House Rules',
          fields: [
            {
              name: 'houseRules',
              type: 'array',
              fields: [
                {
                  name: 'rule',
                  type: 'text',
                  required: true,
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
