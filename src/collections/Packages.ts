import type { CollectionConfig } from 'payload'
import { revalidateTag, revalidatePath } from 'next/cache'
import { iconOptions } from '../lib/iconMap'
import { seoTab } from '../fields/seo'

export const Packages: CollectionConfig = {
  slug: 'packages',
  defaultPopulate: {
    slug: true,
    title: true,
    images: true,
    price: true,
    order: true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'price', 'order'],
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
        revalidateTag('packs')
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
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true,
              admin: {
                description: 'URL-friendly name, e.g. "stay-eat", "full-surf"',
              },
            },
            {
              name: 'badge',
              type: 'text',
              localized: true,
              admin: {
                description: 'e.g. "Best Value", "Most Popular"',
              },
            },
            {
              name: 'category',
              type: 'text',
              localized: true,
              admin: {
                description: 'e.g. "Best Value", "Most Popular", "Quick Start"',
              },
            },
            {
              name: 'highlight',
              type: 'checkbox',
              label: 'Highlighted (dark card)',
              defaultValue: false,
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
                description: 'Base price in EUR (e.g. 31)',
              },
            },
            {
              name: 'priceUnit',
              type: 'text',
              localized: true,
              admin: {
                description: 'e.g. "/ night", "/ session"',
              },
            },
            {
              name: 'duration',
              type: 'text',
              localized: true,
              admin: {
                description: 'e.g. "Per Night", "Per Session"',
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
            {
              name: 'longDescription',
              type: 'textarea',
              localized: true,
              admin: {
                description: 'Extended description for the detail page',
              },
            },
          ],
        },
        // ── Tab 3: Highlights ──
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
              name: 'notIncludes',
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
        // ── Tab 5: Daily Schedule ──
        {
          label: 'Daily Schedule',
          fields: [
            {
              name: 'schedule',
              type: 'array',
              fields: [
                {
                  name: 'time',
                  type: 'text',
                  required: true,
                },
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
        // ── Tab 6: Linked Rooms ──
        {
          label: 'Linked Rooms',
          fields: [
            {
              name: 'linkedRooms',
              type: 'relationship',
              relationTo: 'rooms',
              hasMany: true,
              admin: {
                description:
                  'Rooms available on the package and booking pages. The included-room capacity setting determines whether each room is free or charged at its normal nightly price.',
              },
            },
          ],
        },
        // ── Tab 7: Booking ──
        {
          label: 'Booking',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'pricingBasis',
                  type: 'select',
                  required: true,
                  defaultValue: 'per-person',
                  options: [
                    { label: 'Per person', value: 'per-person' },
                    { label: 'Fixed package price', value: 'fixed' },
                  ],
                  admin: {
                    description: 'Controls how the package price is multiplied in checkout.',
                  },
                },
                {
                  name: 'durationNights',
                  type: 'number',
                  required: true,
                  min: 1,
                  admin: {
                    description: 'Checkout is set automatically from the selected check-in date.',
                  },
                },
                {
                  name: 'includedRoomMaxGuests',
                  type: 'number',
                  required: true,
                  min: 1,
                  defaultValue: 1,
                  label: 'Included room capacity',
                  admin: {
                    description: 'Rooms with this guest capacity or less are included. Larger rooms keep their normal nightly price.',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'includesBreakfast',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Breakfast included',
                },
                {
                  name: 'includedGroupSurfLessons',
                  type: 'number',
                  min: 0,
                  defaultValue: 0,
                  label: 'Included group surf lessons',
                },
                {
                  name: 'includedPrivateSurfLessons',
                  type: 'number',
                  min: 0,
                  defaultValue: 0,
                  label: 'Included private surf lessons',
                },
              ],
            },
            {
              name: 'ctaText',
              type: 'text',
              localized: true,
              defaultValue: 'Book Now',
            },
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
        // ── Tab 8: SEO ──
        seoTab(),
      ],
    },
  ],
}
