import { GlobalConfig } from 'payload'
import { revalidateTag, revalidatePath } from 'next/cache'
import { seoFields } from '../fields/seo'

export const RestaurantPage: GlobalConfig = {
  slug: 'restaurant-page',
  label: 'Restaurant Page',
  admin: {
    description:
      'Edit the Restaurant & Kitchen page — gallery, daily meals, full menu, food philosophy, and CTA.',
    group: 'Pages',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async () => {
        revalidateTag('restaurant')
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
        metaTitle: 'Restaurant & Kitchen | Lina House Imsouane',
        metaDescription: 'Homemade Moroccan & international cuisine at Lina House — rooftop terrace with ocean views, fresh fish, tagines, and wood-fire BBQ.',
        keywords: 'Imsouane restaurant, Lina House restaurant, Moroccan food Imsouane, rooftop dining',
      }),
    },
    // ===== 1. HEADER =====
    {
      name: 'headerSection',
      type: 'group',
      label: '1. Page Header',
      admin: {
        description: 'Breadcrumb and page title area',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Page Title',
          defaultValue: 'Restaurant & Kitchen',
          localized: true,
        },
        {
          name: 'breadcrumbLabel',
          type: 'text',
          label: 'Breadcrumb Label',
          defaultValue: 'Restaurant',
          localized: true,
        },
      ],
    },

    // ===== 2. PHOTO GALLERY =====
    {
      name: 'gallerySection',
      type: 'group',
      label: '2. Photo Gallery',
      admin: {
        description: 'Large hero image + 4 thumbnail grid at top of page (5 images total)',
      },
      fields: [
        {
          name: 'images',
          type: 'array',
          label: 'Gallery Images',
          minRows: 1,
          maxRows: 10,
          admin: {
            description:
              'First image is the large hero, next 4 appear as thumbnails on desktop. Upload up to 10 for the lightbox.',
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Image',
            },
            {
              name: 'alt',
              type: 'text',
              label: 'Alt Text',
              localized: true,
            },
          ],
          defaultValue: [
            { alt: 'Lina House restaurant' },
            { alt: 'Moroccan breakfast spread' },
            { alt: 'Moroccan tagine lunch' },
            { alt: 'BBQ dinner on the terrace' },
            { alt: 'Restaurant interior' },
          ],
        },
      ],
    },

    // ===== 3. DAILY MEALS =====
    {
      name: 'dailyMealsSection',
      type: 'group',
      label: '3. Daily Meals',
      admin: {
        description: 'Three meal cards — Breakfast, Lunch, BBQ Dinner',
      },
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          label: 'Eyebrow Text',
          defaultValue: 'DAILY DINING',
          localized: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          defaultValue: 'Three meals, one beautiful setting',
          localized: true,
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Subtitle',
          defaultValue: 'From sunrise breakfast to starlit BBQ dinners on our rooftop terrace',
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
              label: 'Meal Name',
              required: true,
              localized: true,
            },
            {
              name: 'time',
              type: 'text',
              label: 'Serving Time',
              required: true,
              localized: true,
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              localized: true,
            },
            {
              name: 'badge',
              type: 'text',
              label: 'Badge Text',
              admin: {
                description: 'e.g. "Included with Stay", "A la carte", "Signature"',
              },
              localized: true,
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Meal Image',
            },
            {
              name: 'dishes',
              type: 'array',
              label: 'Featured Dishes',
              maxRows: 8,
              admin: {
                description: 'Dishes shown under "FROM THE MENU" on the card',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  localized: true,
                },
              ],
            },
          ],
          defaultValue: [
            {
              title: 'Breakfast',
              time: '8:00 AM — 10:30 AM',
              description:
                'Start your day with fresh bread, eggs, Moroccan pancakes, seasonal fruit, fresh juice, and coffee on our sun-drenched terrace.',
              badge: 'Included with Stay',
              dishes: [
                { name: 'Moroccan Mint Tea Set' },
                { name: 'Msemen with Honey & Butter / Amlou' },
                { name: 'Omelette Berber — Eggs with Tomato' },
                { name: 'Avocado Toast with Egg' },
              ],
            },
            {
              title: 'Lunch',
              time: '12:30 PM — 3:00 PM',
              description:
                'Recharge between surf sessions with hearty tagines, fresh salads, and light bites made with local ingredients from the village market.',
              badge: 'A la carte',
              dishes: [
                { name: 'Chicken Tagine with Lemon & Olives' },
                { name: 'Couscous Royal (Mixed Meats)' },
                { name: 'Mixed Moroccan Salads' },
                { name: 'Chicken Sandwich' },
              ],
            },
            {
              title: 'BBQ Dinner',
              time: '7:00 PM — 9:30 PM',
              description:
                'Fresh fish from the harbour, grilled over wood fire on our rooftop terrace. A communal dining experience under the stars.',
              badge: 'Signature',
              dishes: [
                { name: 'Grilled Mixed Meats Plate' },
                { name: 'Mkkila: Seafood / Chicken / Minced Meat' },
                { name: 'Vegetable Tagine' },
                { name: 'Beef Tagine with Prunes & Almonds' },
              ],
            },
          ],
        },
      ],
    },

    // ===== 4. FULL MENU =====
    {
      name: 'menuSection',
      type: 'group',
      label: '4. Full Menu',
      admin: {
        description: 'All menu categories and items — shown with filter buttons',
      },
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          label: 'Eyebrow Text',
          defaultValue: 'OUR MENU',
          localized: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          defaultValue: 'Explore the full menu',
          localized: true,
        },
        {
          name: 'categories',
          type: 'array',
          label: 'Menu Categories',
          maxRows: 12,
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Category Name',
              required: true,
              localized: true,
            },
            {
              name: 'items',
              type: 'array',
              label: 'Menu Items',
              maxRows: 20,
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Item Name',
                  required: true,
                  localized: true,
                },
                {
                  name: 'price',
                  type: 'text',
                  label: 'Price',
                  admin: {
                    description: 'Optional — e.g. "€5" or "5 €"',
                  },
                },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Short Description',
                  localized: true,
                  admin: {
                    description: 'Optional — brief description of the dish',
                  },
                },
              ],
            },
          ],
          defaultValue: [
            {
              title: 'Starters',
              items: [
                { name: 'Moroccan Harira Soup' },
                { name: 'Zaalouk (Eggplant Salad)' },
                { name: 'Avocado Salad' },
                { name: 'Mixed Moroccan Salads' },
              ],
            },
            {
              title: 'Breakfast',
              items: [
                { name: 'Moroccan Mint Tea Set' },
                { name: 'Msemen with Honey & Butter / Amlou' },
                { name: 'Omelette Berber — Eggs with Tomato' },
                { name: 'Khlii with Eggs' },
                { name: 'Avocado Toast with Egg' },
                { name: 'Traditional Moroccan Breakfast Plate' },
              ],
            },
            {
              title: 'Main Courses',
              items: [
                { name: 'Chicken Tagine with Lemon & Olives' },
                { name: 'Beef Tagine with Prunes & Almonds' },
                { name: 'Vegetable Tagine' },
                { name: 'Couscous Royal (Mixed Meats)' },
                { name: 'Couscous with Seven Vegetables' },
                { name: 'Mkkila: Seafood / Chicken / Minced Meat' },
                { name: 'Grilled Mixed Meats Plate' },
              ],
            },
            {
              title: 'Snacks',
              items: [
                { name: 'Chicken Sandwich' },
                { name: 'Beef Burger / Cheeseburger' },
                { name: 'Chicken Wrap' },
                { name: 'Tacos Mixte' },
                { name: 'Tacos Vegetable' },
                { name: 'French Fries' },
                { name: 'Tacos: Minced Meat / Escalope Chicken' },
              ],
            },
            {
              title: 'Fresh Juices',
              items: [
                { name: 'Orange Juice' },
                { name: 'Avocado Juice' },
                { name: 'Mango Juice' },
                { name: 'Lemon Ginger Mint' },
                { name: 'Mixed Fruit Cocktail' },
              ],
            },
            {
              title: 'Drinks',
              items: [
                { name: 'Moroccan Mint Tea' },
                { name: 'Coffee Espresso / Cafe Latte' },
                { name: 'Hot Chocolate' },
                { name: 'Soft Drinks' },
                { name: 'Mineral Water' },
              ],
            },
            {
              title: 'Desserts',
              items: [
                { name: 'Moroccan Cookies (Kaab Ghzal, Ghriba...)' },
                { name: 'Orange Salad with Cinnamon' },
                { name: 'Fruit Salad' },
              ],
            },
          ],
        },
      ],
    },

    // ===== 5. FOOD PHILOSOPHY =====
    {
      name: 'philosophySection',
      type: 'group',
      label: '5. Food Philosophy',
      admin: {
        description: 'Dark section with 4 icon+text philosophy items',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          defaultValue: 'Our Food Philosophy',
          localized: true,
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Subtitle',
          defaultValue:
            'Every dish tells the story of Imsouane — from the harbour to your plate',
          localized: true,
        },
        {
          name: 'items',
          type: 'array',
          label: 'Philosophy Items',
          maxRows: 6,
          fields: [
            {
              name: 'icon',
              type: 'select',
              label: 'Icon',
              required: true,
              options: [
                { label: 'Anchor', value: 'anchor' },
                { label: 'Leaf', value: 'leaf' },
                { label: 'Flame', value: 'flame' },
                { label: 'Heart', value: 'heart' },
                { label: 'Star', value: 'star' },
                { label: 'Utensils', value: 'utensils' },
                { label: 'Sun', value: 'sun' },
                { label: 'Waves', value: 'waves' },
                { label: 'Shield', value: 'shield' },
                { label: 'Coffee', value: 'coffee' },
              ],
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: true,
              localized: true,
            },
            {
              name: 'description',
              type: 'text',
              label: 'Description',
              localized: true,
            },
          ],
          defaultValue: [
            {
              icon: 'anchor',
              title: 'From the Harbour',
              description: "Fresh fish delivered daily from Imsouane's fishing boats",
            },
            {
              icon: 'leaf',
              title: '100% Fresh',
              description: 'All ingredients sourced from local markets and farms',
            },
            {
              icon: 'flame',
              title: 'Wood-Fire Grill',
              description: 'Traditional cooking methods passed down through generations',
            },
            {
              icon: 'heart',
              title: 'Made with Love',
              description: 'Home-cooked meals — every guest is family',
            },
          ],
        },
      ],
    },

    // ===== 6. CTA =====
    {
      name: 'ctaSection',
      type: 'group',
      label: '6. Call to Action',
      admin: {
        description: 'Bottom CTA banner with WhatsApp and email links',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'CTA Title',
          defaultValue: 'Come taste Imsouane',
          localized: true,
        },
        {
          name: 'description',
          type: 'text',
          label: 'CTA Description',
          defaultValue:
            'Reserve your table, ask about our daily specials, or book a stay that includes all meals.',
          localized: true,
        },
        {
          name: 'whatsappButtonText',
          type: 'text',
          label: 'WhatsApp Button Text',
          defaultValue: 'Message on WhatsApp',
          localized: true,
        },
        {
          name: 'whatsappNumber',
          type: 'text',
          label: 'WhatsApp Number (without +)',
          defaultValue: '212772228120',
          admin: {
            description: 'Used for wa.me link — format: 212772228120',
          },
        },
        {
          name: 'whatsappMessage',
          type: 'text',
          label: 'Pre-filled WhatsApp Message',
          defaultValue: "Hi! I'd like to know about the restaurant at Lina House",
          localized: true,
        },
        {
          name: 'emailButtonText',
          type: 'text',
          label: 'Email Button Text',
          defaultValue: 'Send us an Email',
          localized: true,
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
          defaultValue: 'contact@linahouse.com',
        },
      ],
    },
  ],
}
