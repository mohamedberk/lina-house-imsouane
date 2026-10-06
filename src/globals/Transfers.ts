import { GlobalConfig } from 'payload'
import { revalidateTag, revalidatePath } from 'next/cache'

export const Transfers: GlobalConfig = {
  slug: 'transfers',
  label: 'Transfers',
  admin: {
    description:
      'Manage taxi / airport transfer routes and prices. Used by the booking wizard (Extras step) and the Surf page taxi card.',
    group: 'Pages',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async () => {
        revalidateTag('transfers')
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
      name: 'cardTitle',
      type: 'text',
      localized: true,
      defaultValue: 'Taxi & Airport Transfer',
    },
    {
      name: 'cardDescription',
      type: 'textarea',
      localized: true,
      defaultValue:
        'We arrange comfortable transfers on all routes. Just let us know your arrival details.',
    },
    {
      name: 'routes',
      type: 'array',
      required: true,
      admin: {
        description:
          'Each route has a stable routeId (used by bookings), a localized label, and a price in EUR.',
      },
      fields: [
        {
          name: 'routeId',
          type: 'text',
          required: true,
          admin: {
            description:
              'Unique slug, e.g. "airport-imsouane". Do NOT change after bookings reference it.',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'priceEur',
          type: 'number',
          required: true,
          min: 0,
          admin: { description: 'One-way price in EUR.' },
        },
        {
          name: 'active',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Uncheck to hide from the booking wizard and Surf page.' },
        },
      ],
      defaultValue: [
        {
          routeId: 'imsouane-taghazout',
          label: 'Imsouane ↔ Taghazout',
          priceEur: 25,
          active: true,
        },
        {
          routeId: 'imsouane-agadir',
          label: 'Imsouane ↔ Agadir',
          priceEur: 35,
          active: true,
        },
        {
          routeId: 'airport-imsouane',
          label: 'Airport ↔ Imsouane',
          priceEur: 45,
          active: true,
        },
        {
          routeId: 'airport-essaouira',
          label: 'Airport ↔ Essaouira',
          priceEur: 30,
          active: true,
        },
      ],
    },
  ],
}
