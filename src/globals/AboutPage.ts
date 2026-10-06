import { GlobalConfig } from 'payload'
import { revalidateTag, revalidatePath } from 'next/cache'
import { iconOptions } from '../lib/iconMap'
import { seoTab } from '../fields/seo'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Page',
  admin: {
    description: 'Edit the About page content — hero, story, experience, feature strip, experience cards, FAQ, and CTA sections.',
    group: 'Pages',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async () => {
        revalidateTag('about-page')
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
        // ─── 0. SEO ────────────────────────────────────────────────────
        seoTab({
          metaTitle: 'About | Lina House - Surf Camp Imsouane',
          metaDescription: 'Discover Lina House — a surf camp, hostel & restaurant in Imsouane, Morocco. 500m from Magic Bay, rated 9.7/10 on Booking.com.',
          keywords: 'surf camp, hostel, Imsouane, Morocco, Lina House, Magic Bay, surfing, accommodation, restaurant',
        }),

        // ─── 1. Hero Section ──────────────────────────────────────────
        {
          label: 'Hero',
          description: 'The main banner at the top of the about page',
          fields: [
            {
              name: 'heroSection',
              type: 'group',
              label: 'Hero Section',
              fields: [
                {
                  name: 'eyebrow',
                  type: 'text',
                  label: 'Eyebrow Text',
                  defaultValue: 'About Us',
                  localized: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                  defaultValue: 'A Place You Can Trust',
                  localized: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                  defaultValue: 'A surf camp, hostel & restaurant in the heart of Imsouane — where the waves meet Moroccan hospitality.',
                  localized: true,
                },
                {
                  name: 'ratingValue',
                  type: 'text',
                  label: 'Rating Value',
                  defaultValue: '9.7/10',
                  localized: true,
                },
                {
                  name: 'ratingLabel',
                  type: 'text',
                  label: 'Rating Label',
                  defaultValue: 'on Booking.com',
                  localized: true,
                },
                {
                  name: 'location',
                  type: 'text',
                  label: 'Location Text',
                  defaultValue: 'Imsouane, Morocco',
                  localized: true,
                },
                {
                  name: 'backgroundImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Background Image',
                  admin: {
                    description: 'Recommended: 1920x1080 or larger',
                  },
                },
                {
                  name: 'imageAlt',
                  type: 'text',
                  label: 'Background Image Alt Text',
                  defaultValue: 'Imsouane coastline',
                  localized: true,
                },
              ],
            },
          ],
        },

        // ─── 2. Story Section ─────────────────────────────────────────
        {
          label: 'Story',
          description: 'The "Our Story" section with image and feature list',
          fields: [
            {
              name: 'storySection',
              type: 'group',
              label: 'Story Section',
              fields: [
                {
                  name: 'eyebrow',
                  type: 'text',
                  label: 'Eyebrow Text',
                  defaultValue: 'Our Story',
                  localized: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                  defaultValue: 'A Place You Can Trust',
                  localized: true,
                },
                {
                  name: 'ratingText',
                  type: 'text',
                  label: 'Rating Badge Text',
                  defaultValue: '9.7/10 on Booking.com',
                  localized: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                  defaultValue: 'Lina House was born from a simple idea: create a warm, welcoming space where surfers and travelers feel at home. Located steps from Magic Bay — one of the world\'s longest right-hand waves — we combine authentic Moroccan hospitality with the laid-back surf lifestyle that makes Imsouane so special.',
                  localized: true,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Section Image',
                  admin: {
                    description: 'Image displayed alongside the story text',
                  },
                },
                {
                  name: 'imageAlt',
                  type: 'text',
                  label: 'Image Alt Text',
                  defaultValue: 'Lina House rooftop and ocean view in Imsouane',
                  localized: true,
                },
                {
                  name: 'features',
                  type: 'array',
                  label: 'Features',
                  admin: {
                    description: 'Checkmark feature list displayed below the description',
                  },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      localized: true,
                    },
                  ],
                  defaultValue: [
                    { label: 'Steps from Magic Bay surf break' },
                    { label: 'Homemade Moroccan breakfast daily' },
                    { label: 'Rooftop terrace with ocean views' },
                    { label: 'Community-driven atmosphere' },
                  ],
                },
              ],
            },
          ],
        },

        // ─── 3. Experience Section ────────────────────────────────────
        {
          label: 'Experience',
          description: 'The "More Than Just a Place to Sleep" section',
          fields: [
            {
              name: 'experienceSection',
              type: 'group',
              label: 'Experience Section',
              fields: [
                {
                  name: 'eyebrow',
                  type: 'text',
                  label: 'Eyebrow Text',
                  defaultValue: 'Our Experience',
                  localized: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                  defaultValue: 'More Than Just a Place to Sleep',
                  localized: true,
                },
                {
                  name: 'ratingText',
                  type: 'text',
                  label: 'Rating Badge Text',
                  defaultValue: 'Loved by guests worldwide',
                  localized: true,
                },
                {
                  name: 'description1',
                  type: 'textarea',
                  label: 'Description Paragraph 1',
                  defaultValue: 'What started as a small guesthouse has grown into a vibrant community hub where travelers from around the world share waves, stories, and wood-fire dinners under the stars.',
                  localized: true,
                },
                {
                  name: 'description2',
                  type: 'textarea',
                  label: 'Description Paragraph 2',
                  defaultValue: 'Our team — led by host Abdou — goes above and beyond to make every guest feel like family. From homemade breakfasts to organizing surf sessions, every detail is crafted for you.',
                  localized: true,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Section Image',
                  admin: {
                    description: 'Image displayed alongside the experience text',
                  },
                },
                {
                  name: 'imageAlt',
                  type: 'text',
                  label: 'Image Alt Text',
                  defaultValue: 'Cozy room at Lina House Imsouane',
                  localized: true,
                },
                {
                  name: 'features',
                  type: 'array',
                  label: 'Features',
                  admin: {
                    description: 'Checkmark feature list displayed below the description',
                  },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      localized: true,
                    },
                  ],
                  defaultValue: [
                    { label: 'Community surf sessions & lessons' },
                    { label: 'Wood-fire BBQ evenings' },
                    { label: 'Airport & surf spot transfers' },
                    { label: 'Local village excursions' },
                  ],
                },
              ],
            },
          ],
        },

        // ─── 4. Feature Strip ─────────────────────────────────────────
        {
          label: 'Feature Strip',
          description: 'The horizontal icon strip with key stats',
          fields: [
            {
              name: 'featureStrip',
              type: 'group',
              label: 'Feature Strip',
              fields: [
                {
                  name: 'items',
                  type: 'array',
                  label: 'Items',
                  minRows: 1,
                  maxRows: 8,
                  admin: {
                    description: 'Each item shows an icon, a value, and a label',
                  },
                  fields: [
                    {
                      name: 'icon',
                      type: 'select',
                      label: 'Icon',
                      options: [...iconOptions],
                      defaultValue: 'star',
                      required: true,
                    },
                    {
                      name: 'value',
                      type: 'text',
                      label: 'Value',
                      required: true,
                      localized: true,
                    },
                    {
                      name: 'label',
                      type: 'text',
                      label: 'Label',
                      required: true,
                      localized: true,
                    },
                  ],
                  defaultValue: [
                    { icon: 'map-pin', value: '500m', label: 'From Beach' },
                    { icon: 'star', value: '9.7/10', label: 'Guest Rating' },
                    { icon: 'utensils', value: 'Restaurant', label: 'On-site' },
                    { icon: 'sun', value: 'Rooftop', label: 'Terrace' },
                    { icon: 'wifi', value: 'Free WiFi', label: 'Fiber Optic' },
                    { icon: 'shield', value: '24/7', label: 'Security' },
                  ],
                },
              ],
            },
          ],
        },

        // ─── 5. Experience Cards ──────────────────────────────────────
        {
          label: 'Experience Cards',
          description: 'The three-card "Surf, Eat & Feel at Home" section',
          fields: [
            {
              name: 'experienceCards',
              type: 'group',
              label: 'Experience Cards',
              fields: [
                {
                  name: 'eyebrow',
                  type: 'text',
                  label: 'Eyebrow Text',
                  defaultValue: 'The Experience',
                  localized: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                  defaultValue: 'Surf, Eat & Feel at Home',
                  localized: true,
                },
                {
                  name: 'subtitle',
                  type: 'text',
                  label: 'Subtitle',
                  defaultValue: 'Three pillars that make Lina House more than just another place to sleep',
                  localized: true,
                },
                {
                  name: 'cards',
                  type: 'array',
                  label: 'Cards',
                  minRows: 1,
                  maxRows: 6,
                  admin: {
                    description: 'Each card has an icon, title, description, image, and feature list',
                  },
                  fields: [
                    {
                      name: 'icon',
                      type: 'select',
                      label: 'Icon',
                      options: [...iconOptions],
                      defaultValue: 'waves',
                      required: true,
                    },
                    {
                      name: 'title',
                      type: 'text',
                      label: 'Card Title',
                      required: true,
                      localized: true,
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      label: 'Card Description',
                      required: true,
                      localized: true,
                    },
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Card Image',
                    },
                    {
                      name: 'features',
                      type: 'array',
                      label: 'Card Features',
                      fields: [
                        {
                          name: 'label',
                          type: 'text',
                          required: true,
                          localized: true,
                        },
                      ],
                      defaultValue: [],
                    },
                  ],
                  defaultValue: [
                    {
                      icon: 'waves',
                      title: 'World-Class Surf',
                      description: "Magic Bay's gentle, incredibly long waves are perfect for beginners. Advanced surfers can tackle Cathedral's powerful point break just around the corner.",
                      features: [
                        { label: 'Certified instructors' },
                        { label: 'All levels welcome' },
                        { label: 'Equipment provided' },
                      ],
                    },
                    {
                      icon: 'utensils',
                      title: 'From Ocean to Table',
                      description: 'Fresh fish from the harbour, traditional tagines, and legendary wood-fire BBQ every evening. Every meal is made with love from local ingredients.',
                      features: [
                        { label: 'Fresh daily breakfast' },
                        { label: 'Wood-fire BBQ dinner' },
                        { label: 'Rooftop dining' },
                      ],
                    },
                    {
                      icon: 'heart',
                      title: 'A Place Called Home',
                      description: 'Cozy rooms, ocean-view rooftop terrace, and a warm community of travelers. Arrive as a guest, leave as family.',
                      features: [
                        { label: 'Ocean-view terrace' },
                        { label: 'Fiber optic WiFi' },
                        { label: 'Communal dinners' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ─── 6. FAQ Section ──────────────────────────────────────────
        {
          label: 'FAQ',
          description: 'Frequently Asked Questions accordion section',
          fields: [
            {
              name: 'faqSection',
              type: 'group',
              label: 'FAQ Section',
              fields: [
                {
                  name: 'eyebrow',
                  type: 'text',
                  label: 'Eyebrow Text',
                  defaultValue: 'FAQ',
                  localized: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                  defaultValue: 'Frequently Asked Questions',
                  localized: true,
                },
                {
                  name: 'contactText',
                  type: 'text',
                  label: 'Contact Prompt Text',
                  defaultValue: 'Still have questions?',
                  localized: true,
                },
                {
                  name: 'whatsappUrl',
                  type: 'text',
                  label: 'WhatsApp URL',
                  defaultValue: 'https://wa.me/212772228120',
                },
                {
                  name: 'whatsappLabel',
                  type: 'text',
                  label: 'WhatsApp Button Label',
                  defaultValue: 'Chat with us on WhatsApp',
                  localized: true,
                },
                {
                  name: 'faqs',
                  type: 'array',
                  label: 'FAQs',
                  minRows: 1,
                  admin: {
                    description: 'Add question/answer pairs',
                  },
                  fields: [
                    {
                      name: 'question',
                      type: 'text',
                      label: 'Question',
                      required: true,
                      localized: true,
                    },
                    {
                      name: 'answer',
                      type: 'textarea',
                      label: 'Answer',
                      required: true,
                      localized: true,
                    },
                  ],
                  defaultValue: [
                    {
                      question: 'What is the best time to visit Imsouane for surfing?',
                      answer: 'Imsouane has waves year-round! The best surf season is from September to April when the Atlantic swells are most consistent. Beginners will find Magic Bay gentle and welcoming any time of year, while advanced surfers prefer the bigger winter swells at Cathedral.',
                    },
                    {
                      question: 'Do I need to bring my own surf equipment?',
                      answer: 'No, we provide surfboards and wetsuits for rent. Our collection includes foamies for beginners, longboards, and shortboards for experienced surfers. If you prefer your own gear, we have secure board storage available.',
                    },
                    {
                      question: 'What is included with my stay at Lina House?',
                      answer: 'Every stay includes a homemade breakfast, free WiFi, access to our rooftop terrace with ocean views, and use of common areas. Packages that include meals and surf lessons are also available for the best value.',
                    },
                    {
                      question: 'How do I get to Imsouane from the airport?',
                      answer: "The nearest airport is Agadir Al Massira (AGA), about a 2-hour drive. We can arrange private transfers for you. Alternatively, you can take a grand taxi or rent a car. From Essaouira it's 2.5 hours, and from Marrakech about 4 hours.",
                    },
                    {
                      question: 'Can I book surf lessons without staying at Lina House?',
                      answer: 'Absolutely! Our Surf Only package is perfect for day visitors. Join a 2-hour group session with a certified instructor — board and wetsuit included. Just €18.42 per session.',
                    },
                    {
                      question: 'Is Lina House suitable for solo travelers?',
                      answer: "Definitely! Many of our guests travel solo. The communal dinners, shared dorms, and rooftop terrace make it incredibly easy to meet people. You'll arrive alone and leave with friends from around the world.",
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ─── 7. CTA Section ──────────────────────────────────────────
        {
          label: 'CTA',
          description: 'The bottom call-to-action banner',
          fields: [
            {
              name: 'ctaSection',
              type: 'group',
              label: 'CTA Section',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                  defaultValue: 'Ready to Experience Imsouane?',
                  localized: true,
                },
                {
                  name: 'subtitle',
                  type: 'text',
                  label: 'Subtitle',
                  defaultValue: "Book your stay at Lina House and discover the magic of Morocco's most beautiful coastline",
                  localized: true,
                },
                {
                  name: 'backgroundImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Background Image',
                  admin: {
                    description: 'Background image for the CTA banner',
                  },
                },
                {
                  name: 'primaryButtonText',
                  type: 'text',
                  label: 'Primary Button Text',
                  defaultValue: 'View Rooms',
                  localized: true,
                },
                {
                  name: 'primaryButtonLink',
                  type: 'text',
                  label: 'Primary Button Link',
                  defaultValue: '/rooms',
                  localized: true,
                },
                {
                  name: 'secondaryButtonText',
                  type: 'text',
                  label: 'Secondary Button Text',
                  defaultValue: 'View Packages',
                  localized: true,
                },
                {
                  name: 'secondaryButtonLink',
                  type: 'text',
                  label: 'Secondary Button Link',
                  defaultValue: '/packages',
                  localized: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
