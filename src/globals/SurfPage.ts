import { GlobalConfig } from 'payload'
import { revalidateTag, revalidatePath } from 'next/cache'
import { seoFields } from '../fields/seo'

const timelineIconOptions = [
  { label: 'Sunrise', value: 'sunrise' },
  { label: 'Waves', value: 'waves' },
  { label: 'Utensils Crossed', value: 'utensils-crossed' },
  { label: 'Compass', value: 'compass' },
  { label: 'Sunset', value: 'sunset' },
  { label: 'Sun', value: 'sun' },
  { label: 'Star', value: 'star' },
  { label: 'Car', value: 'car' },
]

const colorOptions = [
  { label: 'Primary (Deep Ocean Blue)', value: 'bg-primary' },
  { label: 'Accent (Sunset Coral)', value: 'bg-accent' },
  { label: 'Azure (Ocean Tone)', value: 'bg-azure' },
  { label: 'Azure Dark', value: 'bg-azure-dark' },
]

export const SurfPage: GlobalConfig = {
  slug: 'surf-page',
  label: 'Surf Page',
  admin: {
    description:
      'Edit the /surf page — page header, rentals & transport cards, surf spots, typical day timeline, and final CTA.',
    group: 'Pages',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async () => {
        revalidateTag('surf-page')
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
        metaTitle: 'Surf in Imsouane | Lina House Surf Camp',
        metaDescription: 'Surf Imsouane with Lina House — lessons, rentals, transport, and surf spots guide for Magic Bay & Cathedral. All levels welcome.',
        keywords: 'Imsouane surf, Magic Bay surf, surf lessons Morocco, surf rental Imsouane',
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
          defaultValue: 'Surf & Lessons',
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          defaultValue: 'Surf & Lessons',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          localized: true,
          defaultValue: 'Lessons, equipment & world-class waves — just 500m from Lina House',
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
          defaultValue: '3 lesson types · 2h sessions',
        },
        {
          name: 'infoChip2',
          type: 'text',
          localized: true,
          defaultValue: '500m from Magic Bay',
        },
      ],
    },

    // ===== 2. RENTALS & TRANSPORT =====
    {
      name: 'rentalsSection',
      type: 'group',
      label: '2. Rentals & Transport',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          defaultValue: 'Rentals & Transport',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          localized: true,
          defaultValue:
            'Quality surf equipment for every level, plus easy transport to get you here and around.',
        },
        {
          name: 'surfboardCard',
          type: 'group',
          label: 'Surfboard + Wetsuit Card',
          fields: [
            {
              name: 'title',
              type: 'text',
              localized: true,
              defaultValue: 'Surfboard + Wetsuit',
            },
            {
              name: 'description',
              type: 'textarea',
              localized: true,
              defaultValue:
                'Full-day rental — quality boards for all levels, from foam to fiberglass.',
            },
            {
              name: 'soloPrice',
              type: 'number',
              defaultValue: 70,
            },
            {
              name: 'soloLabel',
              type: 'text',
              localized: true,
              defaultValue: '/ solo',
            },
            {
              name: 'groupPrice',
              type: 'number',
              defaultValue: 60,
            },
            {
              name: 'groupLabel',
              type: 'text',
              localized: true,
              defaultValue: '/ group',
            },
          ],
        },
        {
          name: 'taxiCard',
          type: 'group',
          label: 'Taxi & Airport Transfer Card',
          fields: [
            {
              name: 'title',
              type: 'text',
              localized: true,
              defaultValue: 'Taxi & Airport Transfer',
            },
            {
              name: 'description',
              type: 'textarea',
              localized: true,
              defaultValue:
                'We arrange comfortable transfers on all routes. Just let us know your arrival details.',
            },
            {
              name: 'routes',
              type: 'array',
              localized: true,
              fields: [
                { name: 'label', type: 'text', required: true, localized: true },
              ],
              defaultValue: [
                { label: 'Imsouane ↔ Taghazout' },
                { label: 'Imsouane ↔ Agadir' },
                { label: 'Airport ↔ Imsouane' },
              ],
            },
          ],
        },
        {
          name: 'goodToKnowCard',
          type: 'group',
          label: 'Good to Know Card',
          fields: [
            {
              name: 'title',
              type: 'text',
              localized: true,
              defaultValue: 'Good to Know',
            },
            {
              name: 'facts',
              type: 'array',
              localized: true,
              fields: [
                { name: 'label', type: 'text', required: true, localized: true },
              ],
              defaultValue: [
                { label: 'All equipment sanitized daily' },
                { label: 'Boards: foam, soft-top & fiberglass' },
                { label: 'Wetsuits in all sizes available' },
                { label: 'Taxi prices confirmed before booking' },
              ],
            },
          ],
        },
      ],
    },

    // ===== 3. SURF SPOTS =====
    {
      name: 'spotsSection',
      type: 'group',
      label: '3. Surf Spots (The Breaks of Imsouane)',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          defaultValue: 'The Breaks of Imsouane',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          localized: true,
          defaultValue:
            "Home to one of the longest right-hand waves in Africa. Whether you're catching your first whitewash or carving a long point break, Imsouane has a wave for you.",
        },
        {
          name: 'spots',
          type: 'array',
          maxRows: 6,
          fields: [
            { name: 'name', type: 'text', required: true, localized: true },
            { name: 'level', type: 'text', required: true, localized: true },
            {
              name: 'levelColor',
              type: 'select',
              options: colorOptions,
              defaultValue: 'bg-accent',
            },
            { name: 'description', type: 'textarea', required: true, localized: true },
            { name: 'image', type: 'upload', relationTo: 'media' },
            { name: 'imageUrl', type: 'text', admin: { description: 'External image URL (used if no uploaded image)' } },
            {
              name: 'stats',
              type: 'array',
              maxRows: 4,
              fields: [
                { name: 'value', type: 'text', required: true, localized: true },
                { name: 'label', type: 'text', required: true, localized: true },
              ],
            },
          ],
          defaultValue: [
            {
              name: 'Magic Bay (La Baie)',
              level: 'All Levels',
              levelColor: 'bg-accent',
              description:
                'The jewel of Imsouane — one of the longest right-hand point breaks in Africa. Gentle, peeling waves up to 800m long make it perfect for longboarding and beginners alike.',
              imageUrl:
                'https://images.unsplash.com/photo-1505459668311-8dfac7952bf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
              stats: [
                { value: '800m+', label: 'Wave length' },
                { value: '0.5–2m', label: 'Wave height' },
                { value: 'Year-round', label: 'Season' },
              ],
            },
            {
              name: 'Cathedral (La Cathédrale)',
              level: 'Intermediate+',
              levelColor: 'bg-azure-dark',
              description:
                'A powerful beach break just north of the bay. Faster, hollower waves that challenge intermediate and advanced surfers. Best on a northwest swell with offshore winds.',
              imageUrl:
                'https://images.unsplash.com/photo-1502933691298-84fc14542831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
              stats: [
                { value: 'Beach', label: 'Break type' },
                { value: '1–3m', label: 'Wave height' },
                { value: 'Oct–Apr', label: 'Best season' },
              ],
            },
          ],
        },
      ],
    },

    // ===== 4. TYPICAL SURF DAY =====
    {
      name: 'typicalDaySection',
      type: 'group',
      label: '4. A Typical Surf Day (Timeline)',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          defaultValue: 'A Typical Surf Day',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          localized: true,
          defaultValue:
            'Wake up to ocean views, surf world-class waves, and end the day on the rooftop with new friends.',
        },
        {
          name: 'timeline',
          type: 'array',
          maxRows: 10,
          fields: [
            { name: 'time', type: 'text', required: true, localized: true },
            {
              name: 'icon',
              type: 'select',
              options: timelineIconOptions,
              defaultValue: 'waves',
            },
            { name: 'title', type: 'text', required: true, localized: true },
            { name: 'desc', type: 'textarea', required: true, localized: true },
            {
              name: 'color',
              type: 'select',
              options: colorOptions,
              defaultValue: 'bg-primary',
            },
          ],
          defaultValue: [
            { time: '8am', icon: 'sunrise', title: 'Wake Up', desc: 'Fresh breakfast on the terrace with ocean views', color: 'bg-primary' },
            { time: '9am', icon: 'waves', title: 'Surf Session', desc: '2-hour lesson or free surf at Magic Bay', color: 'bg-accent' },
            { time: '12pm', icon: 'utensils-crossed', title: 'Lunch', desc: 'Fresh Moroccan & international dishes', color: 'bg-azure' },
            { time: '2pm', icon: 'compass', title: 'Chill & Explore', desc: 'Explore the village, relax, or grab a massage', color: 'bg-primary' },
            { time: '5pm', icon: 'waves', title: 'Sunset Surf', desc: 'Chase the golden hour waves', color: 'bg-accent' },
            { time: '8pm', icon: 'sunset', title: 'Rooftop Vibes', desc: 'Dinner, stories & stargazing from the rooftop', color: 'bg-azure' },
          ],
        },
      ],
    },

    // ===== 5. FINAL CTA =====
    {
      name: 'finalCtaSection',
      type: 'group',
      label: '5. Final CTA',
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
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
        },
        {
          name: 'title',
          type: 'textarea',
          localized: true,
          defaultValue: 'Your Best Surf Trip\nStarts Here',
          admin: { description: 'Use newlines for line breaks in the heading.' },
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          defaultValue:
            "Book your lesson, grab your board, and let the waves of Imsouane do the rest. We'll take care of everything — you just show up.",
        },
        {
          name: 'primaryButtonText',
          type: 'text',
          localized: true,
          defaultValue: 'Book a Lesson',
        },
        {
          name: 'primaryButtonLink',
          type: 'text',
          defaultValue: '/booking?type=surf&slug=group',
          admin: { description: 'Can be relative (e.g. /booking?…) — language prefix added automatically.' },
        },
        {
          name: 'secondaryButtonText',
          type: 'text',
          localized: true,
          defaultValue: 'Contact Us',
        },
        {
          name: 'secondaryButtonLink',
          type: 'text',
          defaultValue: '/contact',
        },
      ],
    },
  ],
}
