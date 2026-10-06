import { GlobalConfig } from 'payload'
import { revalidateTag, revalidatePath } from 'next/cache'
import { seoFields } from '../fields/seo'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
  admin: {
    description:
      'Edit the main homepage content — all sections that appear on the Lina House landing page.',
    group: 'Pages',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async () => {
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

    // ===== SEO =====
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      admin: {
        description: 'Search engine and social share metadata for the homepage',
      },
      fields: seoFields({
        metaTitle: 'Lina House | Surf Camp & Hostel in Imsouane, Morocco',
        metaDescription: 'Surf, stay and discover Imsouane. 9.7/10 rated hostel, 500m from the beach. Surf lessons, homemade restaurant, rooftop terrace with ocean views.',
        keywords: 'Imsouane surf camp, Imsouane hostel, Morocco surf, Lina House, Magic Bay surf, Imsouane accommodation, surf Morocco',
      }),
    },

    // ===== 1. HERO SECTION =====
    {
      name: 'heroSection',
      type: 'group',
      label: '1. Hero Section',
      admin: {
        description: 'The full-screen banner at the top of the homepage',
      },
      fields: [
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Background Image',
          admin: {
            description:
              'Fallback/poster image when no video URL is set (recommended: 1920x1080 or larger).',
          },
        },
        {
          name: 'heroVideoUrl',
          type: 'text',
          label: 'Hero Video URL — Desktop (Cloudinary)',
          admin: {
            description:
              'Optional. Cloudinary video URL used on tablets & desktops (≥768px). Only this file is downloaded on desktop — the mobile URL is never loaded. Example: https://res.cloudinary.com/<cloud>/video/upload/q_auto,vc_auto,w_1280,f_auto,fps_30/<PUBLIC_ID>.mp4',
          },
        },
        {
          name: 'heroVideoMobileUrl',
          type: 'text',
          label: 'Hero Video URL — Mobile (Cloudinary)',
          admin: {
            description:
              'Optional. Cloudinary video URL used on phones (<768px). Only this file is downloaded on mobile. If empty, the desktop URL is used on mobile too. Recommended: smaller width (e.g. w_720) and portrait crop. Example: https://res.cloudinary.com/<cloud>/video/upload/q_auto,vc_auto,w_720,f_auto,fps_30/<PUBLIC_ID>.mp4',
          },
        },
        {
          name: 'heroVideoWebmUrl',
          type: 'text',
          label: 'Hero Video URL — Desktop WebM (optional, smaller/faster)',
          admin: {
            description:
              'Optional. WebM version of the desktop video. Chrome/Firefox/Edge will prefer this (30-50% smaller than MP4). Safari falls back to MP4 automatically. Leave empty to skip.',
          },
        },
        {
          name: 'heroVideoMobileWebmUrl',
          type: 'text',
          label: 'Hero Video URL — Mobile WebM (optional)',
          admin: {
            description:
              'Optional. WebM version of the mobile video. If empty, the desktop WebM is used on mobile too (if present).',
          },
        },
        {
          name: 'heroPosterUrl',
          type: 'text',
          label: 'Hero Video Poster URL (optional)',
          admin: {
            description:
              'Leave empty — the first frame of the Cloudinary video is used automatically. Only set this if you want a specific still image. Example of a custom frame: https://res.cloudinary.com/<cloud>/video/upload/so_2,w_1280,q_auto,f_auto/<PUBLIC_ID>.jpg',
          },
        },
        {
          name: 'headline',
          type: 'text',
          label: 'Main Headline',
          defaultValue: 'Lina House',
          localized: true,
        },
        {
          name: 'tagline',
          type: 'text',
          label: 'Tagline',
          defaultValue: 'Surf. Stay. Discover Imsouane.',
          localized: true,
          admin: {
            description: 'Large text below the headline',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          defaultValue:
            'A beachfront surf camp & hostel just 500m from the legendary Magic Bay — home to the longest wave in Africa',
          localized: true,
        },
        {
          name: 'highlights',
          type: 'array',
          label: 'Quick Highlights',
          maxRows: 4,
          admin: {
            description: 'Small icon+label items shown below the description (max 4)',
          },
          fields: [
            {
              name: 'icon',
              type: 'select',
              label: 'Icon',
              required: true,
              options: [
                { label: 'Waves', value: 'waves' },
                { label: 'Restaurant', value: 'utensils' },
                { label: 'Star', value: 'star' },
                { label: 'Sun', value: 'sun' },
                { label: 'Wifi', value: 'wifi' },
                { label: 'Shield', value: 'shield' },
                { label: 'Map Pin', value: 'map-pin' },
                { label: 'Heart', value: 'heart' },
              ],
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
            },
          ],
          defaultValue: [
            { icon: 'waves', label: 'Surf Lessons' },
            { icon: 'utensils', label: 'Restaurant' },
            { icon: 'star', label: '9.7/10 Rating' },
            { icon: 'sun', label: 'Rooftop Terrace' },
          ],
        },
        {
          name: 'primaryButtonText',
          type: 'text',
          label: 'Primary Button Text',
          defaultValue: 'Book Your Stay',
          localized: true,
        },
        {
          name: 'primaryButtonLink',
          type: 'text',
          label: 'Primary Button Link',
          defaultValue: '#rooms',
        },
        {
          name: 'secondaryButtonText',
          type: 'text',
          label: 'Secondary Button Text',
          defaultValue: 'Surf Lessons',
          localized: true,
        },
        {
          name: 'secondaryButtonLink',
          type: 'text',
          label: 'Secondary Button Link',
          defaultValue: '#surf',
        },
      ],
    },

    // ===== 2. ABOUT / WELCOME SECTION =====
    {
      name: 'aboutSection',
      type: 'group',
      label: '2. About / Welcome',
      admin: {
        description: 'The "Welcome to Lina House" section with stats and experience card',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          defaultValue: 'Our house,',
          localized: true,
        },
        {
          name: 'titleAccent',
          type: 'text',
          label: 'Section Title (italic accent)',
          defaultValue: 'a seven-minute walk from the sea',
          localized: true,
          admin: {
            description: 'The italic serif coral phrase after the title. Rendered after a space.',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          defaultValue:
            "Nestled in the charming fishing village of Imsouane, Lina House is more than a place to stay — it's a gateway to Morocco's most magical coastline. Whether you're here to surf, explore, or simply unwind, our doors are always open. Enjoy mornings on our rooftop terrace with panoramic ocean views, share stories with fellow travelers over wood-fire dinners, and immerse yourself in the slow, sun-soaked rhythm of village life.",
          localized: true,
        },
        {
          name: 'stats',
          type: 'array',
          label: 'Stats',
          maxRows: 4,
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
            },
          ],
          defaultValue: [
            { value: '500m', label: 'From Magic Bay' },
            { value: '9.7/10', label: 'Guest Rating' },
            { value: '365', label: 'Days of Sunshine' },
            { value: '23', label: 'Cozy Beds' },
          ],
        },
        {
          name: 'experienceImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Experience Card Background Image',
          admin: {
            description: 'Background image for the experience card on the right',
          },
        },
        {
          name: 'experienceTitle',
          type: 'text',
          label: 'Experience Card Title',
          defaultValue: 'The Lina House Experience',
          localized: true,
        },
        {
          name: 'experienceFeatures',
          type: 'array',
          label: 'Experience Features',
          maxRows: 3,
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              localized: true,
            },
          ],
          defaultValue: [
            {
              title: 'Surf',
              description:
                'World-class waves steps from your door. Lessons for all levels with experienced local instructors.',
            },
            {
              title: 'Food',
              description:
                'Fresh fish from the harbour, traditional tagines, and wood-fire BBQ every evening on our terrace.',
            },
            {
              title: 'Home',
              description:
                'A warm, welcoming space with ocean views, rooftop terrace, and the feeling of being part of a community.',
            },
          ],
        },
        {
          name: 'experienceButtonText',
          type: 'text',
          label: 'Experience Button Text',
          defaultValue: 'Explore What Awaits',
          localized: true,
        },
        {
          name: 'experienceButtonLink',
          type: 'text',
          label: 'Experience Button Link',
          defaultValue: '#rooms',
        },
      ],
    },

    // ===== 3. ROOMS SECTION =====
    {
      name: 'roomsSection',
      type: 'group',
      label: '3. Rooms',
      admin: {
        description: 'The "Where you\'ll stay" section showing all room types',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          defaultValue: 'Our rooms,',
          localized: true,
        },
        {
          name: 'titleAccent',
          type: 'text',
          label: 'Section Title (italic accent)',
          defaultValue: 'for every kind of stay',
          localized: true,
          admin: {
            description: 'The italic serif coral phrase after the title. Rendered after a space.',
          },
        },
        {
          name: 'featuredRooms',
          type: 'relationship',
          relationTo: 'rooms',
          hasMany: true,
          label: 'Featured Rooms',
          admin: {
            description: 'Pick which rooms to feature on the homepage. Leave empty to show all rooms sorted by order.',
          },
        },
      ],
    },

    // ===== 4. SURF & ACTIVITIES SECTION =====
    {
      name: 'surfSection',
      type: 'group',
      label: '4. Surf & Activities',
      admin: {
        description: 'Surf lessons and board rental cards',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          defaultValue: 'Our wave,',
          localized: true,
        },
        {
          name: 'titleAccent',
          type: 'text',
          label: 'Section Title (italic accent)',
          defaultValue: 'the longest in Africa',
          localized: true,
          admin: {
            description: 'The italic serif coral phrase after the title. Rendered after a space.',
          },
        },
        {
          name: 'description',
          type: 'text',
          label: 'Subtitle',
          defaultValue:
            'Certified instructors, premium equipment, and the perfect wave — everything you need for an unforgettable surf experience',
          localized: true,
        },
        {
          name: 'featuredActivities',
          type: 'relationship',
          relationTo: 'activities',
          hasMany: true,
          label: 'Featured Activities',
          admin: {
            description: 'Pick which activities to feature on the homepage. Leave empty to show all activities sorted by order.',
          },
        },
      ],
    },

    // ===== 5. PACKAGES SECTION =====
    {
      name: 'packagesSection',
      type: 'group',
      label: '5. Packages',
      admin: {
        description: 'Stay packages with pricing and features',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          defaultValue: 'Our packages,',
          localized: true,
        },
        {
          name: 'titleAccent',
          type: 'text',
          label: 'Section Title (italic accent)',
          defaultValue: 'stay longer, save more',
          localized: true,
          admin: {
            description: 'The italic serif coral phrase after the title. Rendered after a space.',
          },
        },
        {
          name: 'description',
          type: 'text',
          label: 'Subtitle',
          defaultValue:
            'Bundle your stay and save — each package is crafted for the ultimate Imsouane experience',
          localized: true,
        },
        {
          name: 'featuredPackages',
          type: 'relationship',
          relationTo: 'packages',
          hasMany: true,
          label: 'Featured Packages',
          admin: {
            description: 'Pick which packages to feature on the homepage. Leave empty to show all packages sorted by order.',
          },
        },
      ],
    },

    // ===== 5b. RENTALS SECTION =====
    {
      name: 'rentalsSection',
      type: 'group',
      label: '5b. Rentals Section',
      admin: { description: 'Surfboard + wetsuit rentals card with inline booking form' },
      fields: [
        { name: 'title', type: 'text', label: 'Section Title', defaultValue: 'Rentals,', localized: true },
        { name: 'titleAccent', type: 'text', label: 'Section Title (italic accent)', defaultValue: 'paddle out today', localized: true, admin: { description: 'The italic serif coral phrase after the title. Rendered after a space.' } },
        { name: 'description', type: 'text', label: 'Subtitle', defaultValue: 'Quality boards and wetsuits, ready on-site — book by the day.', localized: true },
        { name: 'fromPriceBadge', type: 'text', label: 'Top-left badge (icon panel)', defaultValue: 'From 6€ / day', localized: true },
        { name: 'soloNote', type: 'text', label: 'Solo price note (icon panel)', defaultValue: 'Solo: 7€ / day', localized: true },
        { name: 'groupNote', type: 'text', label: 'Group price note (icon panel)', defaultValue: 'Group (2+): 6€ / day per person', localized: true },
        { name: 'cardTitle', type: 'text', label: 'Card Title', defaultValue: 'Surfboard + Wetsuit Rental', localized: true },
        { name: 'cardDescription', type: 'textarea', label: 'Card Description', defaultValue: 'Freshly maintained gear, swapped every season. Perfect for every level and every Imsouane wave.', localized: true },
        {
          name: 'features',
          type: 'array',
          label: 'Feature bullets',
          localized: true,
          minRows: 0,
          maxRows: 6,
          fields: [
            { name: 'label', type: 'text', required: true },
            {
              name: 'icon',
              type: 'select',
              defaultValue: 'waves',
              options: [
                { label: 'Waves', value: 'waves' },
                { label: 'Shield', value: 'shield' },
                { label: 'Check', value: 'check' },
                { label: 'Star', value: 'star' },
              ],
            },
          ],
        },
        { name: 'displayPrice', type: 'number', label: 'Display price (shown next to Book Now)', defaultValue: 6 },
        { name: 'perDayLabel', type: 'text', label: '/ day label', defaultValue: '/ day', localized: true },
        { name: 'soloPricePerDay', type: 'number', label: 'Solo price per day (€) — used in booking math', defaultValue: 7 },
        { name: 'groupPricePerDay', type: 'number', label: 'Group price per day (€) — 2+ people', defaultValue: 6 },
        { name: 'bookNowText', type: 'text', label: 'Book Now button text', defaultValue: 'Book Now', localized: true },
        {
          name: 'form',
          type: 'group',
          label: 'Booking form labels',
          fields: [
            { name: 'equipment', type: 'text', defaultValue: 'Equipment', localized: true },
            { name: 'boardOnly', type: 'text', defaultValue: 'Board', localized: true },
            { name: 'wetsuitOnly', type: 'text', defaultValue: 'Wetsuit', localized: true },
            { name: 'both', type: 'text', defaultValue: 'Both', localized: true },
            { name: 'startDate', type: 'text', defaultValue: 'Start date', localized: true },
            { name: 'endDate', type: 'text', defaultValue: 'End date', localized: true },
            { name: 'quantity', type: 'text', defaultValue: 'People', localized: true },
            { name: 'fullName', type: 'text', defaultValue: 'Full name', localized: true },
            { name: 'email', type: 'text', defaultValue: 'Email', localized: true },
            { name: 'phone', type: 'text', defaultValue: 'Phone', localized: true },
            { name: 'days', type: 'text', defaultValue: 'days', localized: true },
            { name: 'day', type: 'text', defaultValue: 'day', localized: true },
            { name: 'perPerson', type: 'text', defaultValue: 'per person / day', localized: true },
            { name: 'submit', type: 'text', defaultValue: 'Confirm booking', localized: true },
            { name: 'submitting', type: 'text', defaultValue: 'Sending…', localized: true },
            { name: 'successTitle', type: 'text', defaultValue: 'Thanks!', localized: true },
            { name: 'successMessage', type: 'text', defaultValue: "Thanks — we'll confirm by email.", localized: true },
            { name: 'errorGeneric', type: 'text', defaultValue: 'Something went wrong. Please try again.', localized: true },
            { name: 'errorDateOrder', type: 'text', defaultValue: 'End date must be after start date.', localized: true },
          ],
        },
      ],
    },

    // ===== 6. RESTAURANT SECTION =====
    {
      name: 'restaurantSection',
      type: 'group',
      label: '6. Restaurant',
      admin: {
        description: 'Restaurant hero, meal cards, and food philosophy',
      },
      fields: [
        {
          name: 'heroImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Restaurant Hero Image',
          admin: {
            description: 'Background image for the restaurant hero banner',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          defaultValue: 'Our kitchen,',
          localized: true,
        },
        {
          name: 'titleAccent',
          type: 'text',
          label: 'Section Title (italic accent)',
          defaultValue: 'fresh fish and a wood fire',
          localized: true,
          admin: {
            description: 'The italic serif coral phrase after the title. Rendered after a space.',
          },
        },
        {
          name: 'description',
          type: 'text',
          label: 'Subtitle',
          defaultValue:
            'Fresh catches from the harbour, traditional Moroccan flavors, and wood-fire BBQ every evening',
          localized: true,
        },
        {
          name: 'meals',
          type: 'array',
          label: 'Meals',
          maxRows: 4,
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'time',
              type: 'text',
              label: 'Time',
              localized: true,
            },
            {
              name: 'description',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Meal Image',
            },
          ],
          defaultValue: [
            {
              title: 'Breakfast',
              time: '8:00 AM — 10:30 AM',
              description:
                'Start your day with fresh bread, eggs, Moroccan pancakes, seasonal fruit, fresh juice, and coffee. Included with every stay.',
            },
            {
              title: 'Lunch',
              time: '12:30 PM — 3:00 PM',
              description:
                'Light bites and hearty tagines made with fresh local ingredients. Perfect fuel between surf sessions.',
            },
            {
              title: 'BBQ Dinner',
              time: '7:00 PM — 9:30 PM',
              description:
                'Fresh fish from the harbour, grilled over wood fire on our terrace. A communal dining experience under the stars.',
            },
          ],
        },
        {
          name: 'philosophy',
          type: 'array',
          label: 'Food Philosophy',
          maxRows: 6,
          admin: {
            description: 'Icon badges shown below the meal cards',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'description',
              type: 'text',
              localized: true,
            },
          ],
          defaultValue: [
            { title: 'From the Harbour', description: 'Daily fresh catch' },
            { title: '100% Fresh', description: 'Local ingredients' },
            { title: 'Wood-Fire Grill', description: 'Traditional cooking' },
            { title: 'Made with Love', description: 'Home-cooked meals' },
          ],
        },
      ],
    },

    // ===== 7. WHY LINA HOUSE — Feature Strip =====
    {
      name: 'featureStrip',
      type: 'group',
      label: '7. Why Lina House (Feature Strip)',
      admin: {
        description: 'The dark horizontal strip with key stats/features',
      },
      fields: [
        {
          name: 'features',
          type: 'array',
          label: 'Features',
          maxRows: 8,
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
            },
          ],
          defaultValue: [
            { value: '500m', label: 'From Beach' },
            { value: '9.7/10', label: 'Guest Rating' },
            { value: 'Restaurant', label: 'On-site' },
            { value: 'Rooftop', label: 'Terrace' },
            { value: 'Free WiFi', label: 'High-speed' },
            { value: '24/7', label: 'Security' },
          ],
        },
      ],
    },

    // ===== 8. REVIEWS SECTION =====
    {
      name: 'reviewsSection',
      type: 'group',
      label: '8. Reviews',
      admin: {
        description: 'Guest reviews and rating badges',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          defaultValue: 'Our guests,',
          localized: true,
        },
        {
          name: 'titleAccent',
          type: 'text',
          label: 'Section Title (italic accent)',
          defaultValue: 'in their own words',
          localized: true,
          admin: {
            description: 'The italic serif coral phrase after the title. Rendered after a space.',
          },
        },
        {
          name: 'ratingBadges',
          type: 'array',
          label: 'Rating Badges',
          maxRows: 5,
          fields: [
            {
              name: 'score',
              type: 'text',
              required: true,
            },
            {
              name: 'source',
              type: 'text',
              required: true,
            },
            {
              name: 'label',
              type: 'text',
              localized: true,
            },
          ],
          defaultValue: [
            { score: '9.7', source: 'Booking.com', label: 'Exceptional' },
            { score: '9.4', source: 'Hostelworld', label: 'Superb' },
            { score: '4.8', source: 'Google', label: 'Excellent' },
          ],
        },
        {
          name: 'reviews',
          type: 'array',
          label: 'Reviews',
          maxRows: 20,
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'from',
              type: 'text',
              label: 'From (Country · Platform)',
            },
            {
              name: 'quote',
              type: 'textarea',
              required: true,
              localized: true,
            },
            {
              name: 'dark',
              type: 'checkbox',
              label: 'Dark Card Style',
              defaultValue: false,
            },
          ],
          defaultValue: [
            {
              name: 'Sarah M.',
              from: 'Australia · Booking.com',
              quote:
                '"Best hostel I\'ve ever stayed at. The surf lessons were incredible, the food was amazing, and the vibe is just perfect. Yassine and the team made us feel like family."',
              dark: true,
            },
            {
              name: 'Thomas L.',
              from: 'France · Hostelworld',
              quote:
                '"The location is unbeatable — you can hear the waves from your bed. Breakfast on the terrace watching surfers was a daily highlight. Will definitely be back!"',
              dark: false,
            },
            {
              name: 'Marco P.',
              from: 'Italy · Google',
              quote:
                '"Came for a week, stayed for a month. The BBQ dinners are legendary, the community is incredible, and the waves are endless. This place is pure magic."',
              dark: false,
            },
            {
              name: 'Emma K.',
              from: 'Germany · Booking.com',
              quote:
                '"The rooftop terrace is absolutely magical at sunset. We spent every evening up there watching the sky turn pink. The staff arranged everything from surf lessons to day trips."',
              dark: true,
            },
            {
              name: 'Lucas R.',
              from: 'Brazil · Google',
              quote:
                '"As a surfer, Imsouane is paradise — and Lina House is the perfect base. The instructors know every break, the food keeps you energized, and the beds are super comfortable."',
              dark: false,
            },
            {
              name: 'Sophie W.',
              from: 'UK · Hostelworld',
              quote:
                '"I traveled solo and felt instantly at home. The communal dinners are the highlight — sharing stories with people from all over the world while eating the freshest fish I\'ve ever had."',
              dark: true,
            },
            {
              name: 'Yuki T.',
              from: 'Japan · Booking.com',
              quote:
                '"Clean, cozy, and perfectly located. The breakfast spread is incredible — fresh juice, Moroccan pancakes, and the best coffee. I extended my stay twice!"',
              dark: false,
            },
            {
              name: 'Carlos M.',
              from: 'Spain · Google',
              quote:
                '"Mejor hostel de Marruecos! The vibe is unmatched. Yassine and team are the most welcoming hosts. The BBQ nights with fresh fish from the harbour are unforgettable."',
              dark: true,
            },
            {
              name: 'Anna B.',
              from: 'Netherlands · Hostelworld',
              quote:
                '"Woke up to ocean sounds, surfed all morning, ate the most delicious tagine for lunch, then watched sunset from the rooftop. Repeat for two weeks straight. Pure heaven."',
              dark: false,
            },
          ],
        },
      ],
    },

    // ===== 9. GALLERY SECTION =====
    {
      name: 'gallerySection',
      type: 'group',
      label: '9. Gallery',
      admin: {
        description: 'Bento-grid photo gallery with lightbox',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          defaultValue: 'Around the house,',
          localized: true,
        },
        {
          name: 'titleAccent',
          type: 'text',
          label: 'Section Title (italic accent)',
          defaultValue: 'in photographs',
          localized: true,
          admin: {
            description: 'The italic serif coral phrase after the title. Rendered after a space.',
          },
        },
        {
          name: 'images',
          type: 'upload',
          relationTo: 'media',
          hasMany: true,
          label: 'Gallery Images',
          admin: {
            description: 'Drag and drop multiple images at once. Alt text can be added later in the Media library.',
          },
        },
        {
          name: 'instagramUrl',
          type: 'text',
          label: 'Instagram URL',
          defaultValue:
            'https://www.instagram.com/linahouserestaurant?utm_source=qr&igsh=YndheDV2em10emFy',
        },
      ],
    },

    // ===== 10. LOCATION & CONTACT =====
    {
      name: 'locationSection',
      type: 'group',
      label: '10. Location & Contact',
      admin: {
        description: 'Map, contact info, and directions',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          defaultValue: "Imsouane,",
          localized: true,
        },
        {
          name: 'titleAccent',
          type: 'text',
          label: 'Section Title (italic accent)',
          defaultValue: "on Morocco's Atlantic coast",
          localized: true,
          admin: {
            description: 'The italic serif coral phrase after the title. Rendered after a space.',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          defaultValue:
            'Located in the heart of Imsouane, just steps from the legendary surf breaks of Magic Bay and Cathedral.',
          localized: true,
        },
        {
          name: 'mapEmbedUrl',
          type: 'textarea',
          label: 'Google Maps Embed URL',
          defaultValue:
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3033.059454274444!2d-9.820146224932397!3d30.8426278745314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb25fc0d7ce8e69%3A0xcaee8427dd384dab!2sLina%20House%20Imsouane!5e1!3m2!1sfr!2sma!4v1772232140663!5m2!1sfr!2sma',
          admin: {
            description: 'The full Google Maps embed URL (from Maps > Share > Embed)',
          },
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
          defaultValue: '+212 772-228120',
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
          defaultValue: 'contact@linahouse.com',
        },
        {
          name: 'whatsappNumber',
          type: 'text',
          label: 'WhatsApp Number (without +)',
          defaultValue: '212772228120',
          admin: {
            description: 'Used for WhatsApp links — format: 212772228120',
          },
        },
        {
          name: 'address',
          type: 'text',
          label: 'Address',
          defaultValue: 'N0 Route Amadel, Imsouane, Morocco',
          localized: true,
        },
        {
          name: 'instagramUrl',
          type: 'text',
          label: 'Instagram URL',
          defaultValue:
            'https://www.instagram.com/linahouserestaurant?utm_source=qr&igsh=YndheDV2em10emFy',
        },
        {
          name: 'tiktokUrl',
          type: 'text',
          label: 'TikTok URL',
          defaultValue: 'https://www.tiktok.com/@linahouse',
        },
        {
          name: 'routes',
          type: 'array',
          label: 'Getting Here — Routes',
          maxRows: 5,
          fields: [
            {
              name: 'from',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'time',
              type: 'text',
              required: true,
              localized: true,
            },
          ],
          defaultValue: [
            { from: 'From Agadir Airport', time: '2h drive' },
            { from: 'From Essaouira', time: '2.5h drive' },
            { from: 'From Marrakech', time: '4h drive' },
          ],
        },
      ],
    },

    // ===== 11. FOOTER =====
    {
      name: 'footer',
      type: 'group',
      label: '11. Footer',
      admin: {
        description: 'Footer content and brand information',
      },
      fields: [
        {
          name: 'brandName',
          type: 'text',
          label: 'Brand Name',
          defaultValue: 'Lina House',
          localized: true,
        },
        {
          name: 'brandTagline',
          type: 'text',
          label: 'Brand Tagline',
          defaultValue: 'Imsouane — By the Ocean',
          localized: true,
        },
        {
          name: 'brandDescription',
          type: 'textarea',
          label: 'Brand Description',
          defaultValue:
            'Surf camp & hostel in Imsouane, Morocco. Steps from the longest wave in Africa, with a rooftop restaurant, surf lessons, and the warmest welcome on the coast.',
          localized: true,
        },
        {
          name: 'copyrightText',
          type: 'text',
          label: 'Copyright Text',
          defaultValue: 'Lina House. All rights reserved.',
          localized: true,
        },
        {
          name: 'designCredit',
          type: 'text',
          label: 'Design Credit',
          defaultValue: 'Designed with love in Imsouane',
          localized: true,
        },
      ],
    },
  ],
}
