import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const surfPageData = {
  headerSection: {
    breadcrumbLabel: 'Surf & Lessons',
    title: 'Surf & Lessons',
    subtitle: 'Lessons, equipment & world-class waves — just 500m from Lina House',
    ratingScore: '9.7/10',
    ratingSource: 'on Hostelworld',
    infoChip1: '3 lesson types · 2h sessions',
    infoChip2: '500m from Magic Bay',
  },
  rentalsSection: {
    title: 'Rentals & Transport',
    subtitle: 'Quality surf equipment for every level, plus easy transport to get you here and around.',
    surfboardCard: {
      title: 'Surfboard + Wetsuit',
      description: 'Full-day rental — quality boards for all levels, from foam to fiberglass.',
      soloPrice: 70,
      soloLabel: '/ solo',
      groupPrice: 60,
      groupLabel: '/ group',
    },
    taxiCard: {
      title: 'Taxi & Airport Transfer',
      description:
        'We arrange comfortable transfers on all routes. Just let us know your arrival details.',
      routes: [
        { label: 'Imsouane ↔ Taghazout' },
        { label: 'Imsouane ↔ Agadir' },
        { label: 'Airport ↔ Imsouane' },
      ],
    },
    goodToKnowCard: {
      title: 'Good to Know',
      facts: [
        { label: 'All equipment sanitized daily' },
        { label: 'Boards: foam, soft-top & fiberglass' },
        { label: 'Wetsuits in all sizes available' },
        { label: 'Taxi prices confirmed before booking' },
      ],
    },
  },
  spotsSection: {
    title: 'The Breaks of Imsouane',
    subtitle:
      "Home to one of the longest right-hand waves in Africa. Whether you're catching your first whitewash or carving a long point break, Imsouane has a wave for you.",
    spots: [
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
  typicalDaySection: {
    title: 'A Typical Surf Day',
    subtitle: 'Wake up to ocean views, surf world-class waves, and end the day on the rooftop with new friends.',
    timeline: [
      { time: '8am', icon: 'sunrise', title: 'Wake Up', desc: 'Fresh breakfast on the terrace with ocean views', color: 'bg-primary' },
      { time: '9am', icon: 'waves', title: 'Surf Session', desc: '2-hour lesson or free surf at Magic Bay', color: 'bg-accent' },
      { time: '12pm', icon: 'utensils-crossed', title: 'Lunch', desc: 'Fresh Moroccan & international dishes', color: 'bg-azure' },
      { time: '2pm', icon: 'compass', title: 'Chill & Explore', desc: 'Explore the village, relax, or grab a massage', color: 'bg-primary' },
      { time: '5pm', icon: 'waves', title: 'Sunset Surf', desc: 'Chase the golden hour waves', color: 'bg-accent' },
      { time: '8pm', icon: 'sunset', title: 'Rooftop Vibes', desc: 'Dinner, stories & stargazing from the rooftop', color: 'bg-azure' },
    ],
  },
  finalCtaSection: {
    backgroundImageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
    title: 'Your Best Surf Trip\nStarts Here',
    description:
      "Book your lesson, grab your board, and let the waves of Imsouane do the rest. We'll take care of everything — you just show up.",
    primaryButtonText: 'Book a Lesson',
    primaryButtonLink: '/booking?type=surf&slug=group',
    secondaryButtonText: 'Contact Us',
    secondaryButtonLink: '/contact',
  },
}

const roomsPageData = {
  headerSection: {
    breadcrumbLabel: 'Rooms',
    title: 'Rooms & Accommodation in Imsouane',
    subtitle:
      'From private rooms to budget-friendly dorms — surf camp accommodation just 500m from Magic Bay, the longest right-hand wave in Africa',
    ratingScore: '9.7/10',
    ratingSource: 'on Booking.com',
    infoChip1: '6 room types · 23 beds',
    infoChip2: '500m from Magic Bay',
  },
  packagesCta: {
    title: 'Save more with our packages',
    description:
      'Bundle your room with surf lessons, meals, and equipment for the best value. Packages start at €31.22/night.',
    buttonText: 'View Packages',
    buttonLink: '/packages',
  },
}

const packagesPageData = {
  headerSection: {
    breadcrumbLabel: 'Packages & Deals',
    title: 'Packages & Deals',
    subtitle: 'From chill stays to full surf adventures — find your perfect Imsouane experience',
    ratingScore: '9.7/10',
    ratingSource: 'on Hostelworld',
    infoChip1: '3 packages · from €18.42',
    infoChip2: 'All-inclusive options',
  },
  finalCtaSection: {
    backgroundImageUrl:
      'https://images.unsplash.com/photo-1712472256773-f2a75a9861b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
    title: "Can't decide? We'll help you choose",
    description: "Message us on WhatsApp and we'll find the perfect package for your trip",
    whatsappButtonText: 'WhatsApp Us',
    whatsappMessage: "Hi! I'd like help choosing the right package at Lina House",
    emailButtonText: 'Email Us',
  },
}

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const [surf, rooms, packages] = await Promise.all([
      payload.updateGlobal({ slug: 'surf-page', data: surfPageData as any }),
      payload.updateGlobal({ slug: 'rooms-page', data: roomsPageData as any }),
      payload.updateGlobal({ slug: 'packages-page', data: packagesPageData as any }),
    ])

    return NextResponse.json({
      success: true,
      message: 'Surf, Rooms, and Packages page globals seeded successfully',
      seeded: {
        'surf-page': surf.id,
        'rooms-page': rooms.id,
        'packages-page': packages.id,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    )
  }
}
