import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { uploadthingStorage } from '@payloadcms/storage-uploadthing'
import { stripePlugin } from '@payloadcms/plugin-stripe'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { fr } from '@payloadcms/translations/languages/fr'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Bookings } from './collections/Bookings'
import { Blog } from './collections/Blog'
import { Rooms } from './collections/Rooms'
import { Packages } from './collections/Packages'
import { Activities } from './collections/Activities'
import { Homepage } from './globals/Homepage'
import { BlogPage } from './globals/BlogPage'
import { ContactPage } from './globals/ContactPage'
import { AboutPage } from './globals/AboutPage'
import { SiteSettings } from './globals/SiteSettings'
import { RestaurantPage } from './globals/RestaurantPage'
import { SurfPage } from './globals/SurfPage'
import { RoomsPage } from './globals/RoomsPage'
import { PackagesPage } from './globals/PackagesPage'
import { Transfers } from './globals/Transfers'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  i18n: {
    supportedLanguages: { en, fr },
    fallbackLanguage: 'en',
  },
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Français', code: 'fr' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  admin: {
    user: Users.slug,
    theme: 'light',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      title: 'Admin',
      titleSuffix: ' | Lina House',
      description: 'Lina House admin — manage rooms, packages, bookings and content for the surf camp & hostel in Imsouane, Morocco.',
      defaultOGImageType: 'static',
      openGraph: {
        title: 'Lina House Admin',
        description: 'Manage Lina House — surf camp & hostel in Imsouane, Morocco.',
        siteName: 'Lina House',
      },
      icons: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          url: '/favicon.ico',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          url: '/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          url: '/favicon-16x16.png',
        },
        {
          rel: 'apple-touch-icon',
          type: 'image/png',
          sizes: '180x180',
          url: '/apple-touch-icon.png',
        },
      ],
    },
    components: {
      beforeDashboard: ['/components/admin/OverviewDashboard'],
      graphics: {
        Logo: '/components/admin/Logo',
        Icon: '/components/admin/Icon',
      },
    },
  },
  collections: [Users, Media, Bookings, Blog, Rooms, Packages, Activities],
  globals: [Homepage, AboutPage, RoomsPage, SurfPage, PackagesPage, RestaurantPage, BlogPage, ContactPage, Transfers, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    uploadthingStorage({
      collections: {
        media: true,
      },
      options: {
        token: process.env.UPLOADTHING_TOKEN,
        acl: 'public-read',
      },
    }),
    stripePlugin({
      stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
      stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOKS_ENDPOINT_SECRET,
      isTestKey: process.env.STRIPE_SECRET_KEY?.includes('sk_test_'),
      logs: true,
    }),
  ],
  cors: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL || 'https://linahouse-imsouane.com',
  ].filter(Boolean),
})
