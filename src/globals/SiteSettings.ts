import { GlobalConfig } from 'payload'
import { revalidateTag, revalidatePath } from 'next/cache'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    description: 'Manage header, footer, and tracking settings - changes apply across all pages',
    group: 'Settings',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async () => {
        revalidateTag('site-settings')
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
    // ===== HEADER SETTINGS =====
    {
      type: 'collapsible',
      label: 'Header Settings',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'headerNavLinks',
          type: 'array',
          label: 'Navigation Links',
          admin: {
            description: 'Configure the main navigation menu links',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              label: 'Link Label',
            },
            {
              name: 'href',
              type: 'text',
              required: true,
              label: 'Link URL',
              admin: {
                description: 'Use relative paths like /flights, /about, etc.',
              },
            },
          ],
          defaultValue: [
            { label: 'Rooms', href: '/rooms' },
            { label: 'Surf', href: '/surf' },
            { label: 'Packages', href: '/packages' },
            { label: 'Restaurant', href: '/restaurant' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
          ],
        },
        {
          name: 'headerCtaText',
          type: 'text',
          label: 'CTA Button Text',
          defaultValue: 'Book Now',
          localized: true,
        },
        {
          name: 'headerCtaLink',
          type: 'text',
          label: 'CTA Button Link',
          defaultValue: '/booking',
        },
        {
          name: 'headerWhatsappNumber',
          type: 'text',
          label: 'WhatsApp Number (mobile menu)',
          defaultValue: '212772228120',
          admin: {
            description: 'Phone number without + sign, e.g. 212772228120',
          },
        },
        {
          name: 'headerWhatsappText',
          type: 'text',
          label: 'WhatsApp Link Text',
          defaultValue: 'WhatsApp Us',
          localized: true,
        },
      ],
    },

    // ===== FOOTER SETTINGS =====
    {
      type: 'collapsible',
      label: 'Footer Settings',
      admin: {
        initCollapsed: false,
      },
      fields: [
        // Brand Section
        {
          name: 'footerBrandDescription',
          type: 'textarea',
          label: 'Brand Description',
          defaultValue: 'Surf camp & hostel in Imsouane, Morocco. 500m from the beach, rated 9.7/10 on Hostelworld. Surf lessons, homemade restaurant, rooftop terrace.',
          localized: true,
        },
        {
          name: 'footerCopyrightText',
          type: 'text',
          label: 'Copyright Text',
          defaultValue: 'Lina House. All rights reserved.',
          localized: true,
        },

        // Contact Info
        {
          type: 'row',
          fields: [
            {
              name: 'footerPhone',
              type: 'text',
              label: 'Phone Number',
              defaultValue: '+212 772-228120',
              admin: { width: '50%' },
            },
            {
              name: 'footerEmail',
              type: 'text',
              label: 'Email Address',
              defaultValue: 'contact@linahouse.com',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'footerWhatsappNumber',
              type: 'text',
              label: 'WhatsApp Number',
              defaultValue: '212772228120',
              admin: {
                width: '50%',
                description: 'Without + sign',
              },
            },
            {
              name: 'footerLocation',
              type: 'text',
              label: 'Location',
              defaultValue: 'Imsouane, Morocco',
              localized: true,
              admin: { width: '50%' },
            },
          ],
        },

        // Social Links
        {
          type: 'row',
          fields: [
            {
              name: 'footerInstagramUrl',
              type: 'text',
              label: 'Instagram URL',
              defaultValue: 'https://www.instagram.com/linahouserestaurant?utm_source=qr&igsh=YndheDV2em10emFy',
              admin: { width: '50%' },
            },
            {
              name: 'footerTiktokUrl',
              type: 'text',
              label: 'TikTok URL',
              defaultValue: '',
              admin: { width: '50%' },
            },
          ],
        },

        // Footer Navigation - Experiences Column
        {
          name: 'footerExperiencesLinks',
          type: 'array',
          label: 'Experiences Column Links',
          admin: {
            description: 'Links in the "Experiences" column',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              label: 'Link Label',
            },
            {
              name: 'href',
              type: 'text',
              required: true,
              label: 'Link URL',
            },
          ],
          defaultValue: [
            { label: 'Rooms', href: '/rooms' },
            { label: 'Surf & Activities', href: '/surf' },
            { label: 'Packages', href: '/packages' },
            { label: 'Restaurant', href: '/restaurant' },
          ],
        },

        // Footer Navigation - About Column
        {
          name: 'footerAboutLinks',
          type: 'array',
          label: 'About Column Links',
          admin: {
            description: 'Links in the "About" column',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              label: 'Link Label',
            },
            {
              name: 'href',
              type: 'text',
              required: true,
              label: 'Link URL',
            },
          ],
          defaultValue: [
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
            { label: 'Privacy Policy', href: '/privacy-policy' },
            { label: 'Refund Policy', href: '/refund-policy' },
            { label: 'Terms of Use', href: '/terms-of-use' },
          ],
        },
      ],
    },

    // ===== TRACKING & ANALYTICS =====
    {
      type: 'collapsible',
      label: 'Tracking & Analytics',
      admin: {
        initCollapsed: false,
        description: 'Configure Google Ads and other tracking codes',
      },
      fields: [
        {
          name: 'googleAdsId',
          type: 'text',
          label: 'Google Ads ID',
          admin: {
            description: 'Your Google Ads ID (e.g., AW-123456789). Get this from Google Ads → Tools & Settings → Conversions',
            placeholder: 'AW-XXXXXXXXX',
          },
        },
        {
          name: 'googleAdsConversionId',
          type: 'text',
          label: 'Conversion ID',
          admin: {
            description: 'Google Ads Conversion ID for tracking bookings (usually same as Google Ads ID)',
            placeholder: 'AW-XXXXXXXXX',
          },
        },
        {
          name: 'googleAdsConversionLabel',
          type: 'text',
          label: 'Conversion Label',
          admin: {
            description: 'Google Ads Conversion Label for tracking bookings (e.g., AbCdEfGhIjK)',
            placeholder: 'XXXXXXXXXXX',
          },
        },
      ],
    },
  ],
}
