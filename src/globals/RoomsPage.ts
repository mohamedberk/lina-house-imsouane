import { GlobalConfig } from 'payload'
import { revalidateTag, revalidatePath } from 'next/cache'
import { seoFields } from '../fields/seo'

export const RoomsPage: GlobalConfig = {
  slug: 'rooms-page',
  label: 'Rooms Page',
  admin: {
    description: 'Edit the /rooms page — page header and "Save with packages" CTA.',
    group: 'Pages',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async () => {
        revalidateTag('rooms-page')
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
        metaTitle: 'Rooms & Accommodation | Lina House Imsouane',
        metaDescription: 'Private rooms, dorms & family rooms at Lina House Imsouane — 500m from Magic Bay. Free WiFi, breakfast, rooftop terrace. Rated 9.7/10.',
        keywords: 'Imsouane rooms, hostel Imsouane, accommodation Morocco surf, Lina House rooms',
      }),
    },
    // ===== 1. PAGE HEADER =====
    {
      name: 'headerSection',
      type: 'group',
      label: '1. Page Header',
      fields: [
        {
          name: 'breadcrumbLabel',
          type: 'text',
          localized: true,
          defaultValue: 'Rooms',
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          defaultValue: 'Rooms & Accommodation in Imsouane',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          localized: true,
          defaultValue:
            'From private rooms to budget-friendly dorms — surf camp accommodation just 500m from Magic Bay, the longest right-hand wave in Africa',
        },
        {
          name: 'ratingScore',
          type: 'text',
          defaultValue: '9.7/10',
        },
        {
          name: 'ratingSource',
          type: 'text',
          localized: true,
          defaultValue: 'on Booking.com',
        },
        {
          name: 'infoChip1',
          type: 'text',
          localized: true,
          defaultValue: '6 room types · 23 beds',
        },
        {
          name: 'infoChip2',
          type: 'text',
          localized: true,
          defaultValue: '500m from Magic Bay',
        },
      ],
    },

    // ===== 2. PACKAGES CTA =====
    {
      name: 'packagesCta',
      type: 'group',
      label: '2. Packages CTA (dark blue strip at bottom)',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          defaultValue: 'Save more with our packages',
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          defaultValue:
            'Bundle your room with surf lessons, meals, and equipment for the best value. Packages start at €31.22/night.',
        },
        {
          name: 'buttonText',
          type: 'text',
          localized: true,
          defaultValue: 'View Packages',
        },
        {
          name: 'buttonLink',
          type: 'text',
          defaultValue: '/packages',
        },
      ],
    },
  ],
}
