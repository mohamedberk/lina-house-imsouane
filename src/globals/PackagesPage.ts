import { GlobalConfig } from 'payload'
import { revalidateTag, revalidatePath } from 'next/cache'
import { seoFields } from '../fields/seo'

export const PackagesPage: GlobalConfig = {
  slug: 'packages-page',
  label: 'Packages Page',
  admin: {
    description: 'Edit the /packages page — page header and final "Can\'t decide?" CTA.',
    group: 'Pages',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async () => {
        revalidateTag('packages-page')
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
        metaTitle: 'Packages & Deals | Lina House Imsouane',
        metaDescription: 'Surf, stay & experience Imsouane. Choose from surf packages, stay-only, and full adventure deals at Lina House — 500m from Magic Bay.',
        keywords: 'Imsouane packages, surf deals Morocco, Lina House packages, surf camp deals',
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
          defaultValue: 'Packages & Deals',
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          defaultValue: 'Packages & Deals',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          localized: true,
          defaultValue:
            'From chill stays to full surf adventures — find your perfect Imsouane experience',
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
          defaultValue: 'on Hostelworld',
        },
        {
          name: 'infoChip1',
          type: 'text',
          localized: true,
          defaultValue: '3 packages · from €18.42',
        },
        {
          name: 'infoChip2',
          type: 'text',
          localized: true,
          defaultValue: 'All-inclusive options',
        },
      ],
    },

    // ===== 2. FINAL CTA =====
    {
      name: 'finalCtaSection',
      type: 'group',
      label: '2. Final CTA',
      fields: [
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Background Image',
        },
        {
          name: 'backgroundImageUrl',
          type: 'text',
          label: 'Background Image URL',
          admin: { description: 'Used if no uploaded background image' },
          defaultValue:
            'https://images.unsplash.com/photo-1712472256773-f2a75a9861b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          defaultValue: "Can't decide? We'll help you choose",
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          defaultValue:
            "Message us on WhatsApp and we'll find the perfect package for your trip",
        },
        {
          name: 'whatsappButtonText',
          type: 'text',
          localized: true,
          defaultValue: 'WhatsApp Us',
        },
        {
          name: 'whatsappMessage',
          type: 'text',
          localized: true,
          defaultValue: "Hi! I'd like help choosing the right package at Lina House",
        },
        {
          name: 'emailButtonText',
          type: 'text',
          localized: true,
          defaultValue: 'Email Us',
        },
      ],
    },
  ],
}
