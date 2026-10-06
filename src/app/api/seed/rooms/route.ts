import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const roomsData = [
  {
    name: 'Standard Single Private',
    slug: 'single',
    badge: '',
    order: 1,
    detail: '1 guest · Private room · Shared bathroom',
    price: 18.14,
    priceBreakfast: 22.28,
    rating: '9.7',
    tagline: 'Your private retreat in Imsouane',
    description:
      'A cozy private room for solo travelers. Comfortable single bed, fresh linens, and a quiet corner of the house. Shared bathroom with the rest of the floor. Perfect for surfers who want their own space after a long day in the water.',
    guests: 1,
    beds: '1 single bed',
    bathroom: 'Shared bathroom',
    amenities: [
      { icon: 'wifi', label: 'Free WiFi' },
      { icon: 'sun', label: 'Natural light' },
      { icon: 'shield', label: 'Secure lockers' },
      { icon: 'utensils', label: 'Breakfast option' },
    ],
    highlights: [
      { icon: 'heart', title: 'Solo-friendly', desc: 'Designed for travelers on their own' },
      { icon: 'star', title: '9.7/10 rating', desc: 'Loved by past guests' },
    ],
    houseRules: [
      { rule: 'Check-in from 2:00 PM — Check-out by 11:00 AM' },
      { rule: 'No smoking inside rooms' },
      { rule: 'Respect quiet hours after 11:00 PM' },
    ],
    waMessage: "Hi! I'd like to book the Single Private room at Lina House.",
  },
  {
    name: 'Standard Double Private',
    slug: 'double',
    badge: 'Most Popular',
    order: 2,
    detail: '2 guests · Private room · Shared bathroom',
    price: 28.18,
    priceBreakfast: 33.24,
    rating: '9.7',
    tagline: 'Cozy double room for couples & friends',
    description:
      "A warm private double room with a comfortable double bed — perfect for couples or close friends. Shared bathroom down the hall. Mornings are for rooftop coffee, afternoons for Magic Bay, and evenings for wood-fire dinners.",
    guests: 2,
    beds: '1 double bed',
    bathroom: 'Shared bathroom',
    amenities: [
      { icon: 'wifi', label: 'Free WiFi' },
      { icon: 'sun', label: 'Natural light' },
      { icon: 'shield', label: 'Secure lockers' },
      { icon: 'utensils', label: 'Breakfast option' },
    ],
    highlights: [
      { icon: 'heart', title: 'Couples love it', desc: 'Cozy and romantic' },
      { icon: 'star', title: '9.7/10 rating', desc: 'Exceptional on Booking.com' },
    ],
    houseRules: [
      { rule: 'Check-in from 2:00 PM — Check-out by 11:00 AM' },
      { rule: 'No smoking inside rooms' },
      { rule: 'Respect quiet hours after 11:00 PM' },
    ],
    waMessage: "Hi! I'd like to book the Double Private room at Lina House.",
  },
  {
    name: 'Standard Twin Private',
    slug: 'twin',
    badge: '',
    order: 3,
    detail: '2 guests · Private room · Shared bathroom',
    price: 28.18,
    priceBreakfast: 34.25,
    rating: '9.6',
    tagline: 'Two beds, one private space',
    description:
      'A private twin room with two single beds — ideal for friends or family traveling together who prefer separate beds. Shared bathroom. Same warmth, same view, same home.',
    guests: 2,
    beds: '2 single beds',
    bathroom: 'Shared bathroom',
    amenities: [
      { icon: 'wifi', label: 'Free WiFi' },
      { icon: 'sun', label: 'Natural light' },
      { icon: 'shield', label: 'Secure lockers' },
      { icon: 'utensils', label: 'Breakfast option' },
    ],
    highlights: [
      { icon: 'heart', title: 'Great for friends', desc: 'Private room, separate beds' },
    ],
    houseRules: [
      { rule: 'Check-in from 2:00 PM — Check-out by 11:00 AM' },
      { rule: 'No smoking inside rooms' },
      { rule: 'Respect quiet hours after 11:00 PM' },
    ],
    waMessage: "Hi! I'd like to book the Twin Private room at Lina House.",
  },
  {
    name: '4-Bed Female Dorm',
    slug: 'female-dorm',
    badge: 'Best Value',
    order: 4,
    detail: 'Per bed · Female dorm · Shared bathroom',
    price: 13.08,
    priceBreakfast: 16.11,
    rating: '9.4',
    tagline: 'Safe, social, and all for her',
    description:
      'A female-only 4-bed dorm — safe, clean, and social. Each bed has its own reading light, power outlet, and secure locker. A great way to meet fellow solo female travelers from around the world.',
    guests: 1,
    beds: 'Single bed in a 4-bed dorm',
    bathroom: 'Shared bathroom',
    amenities: [
      { icon: 'wifi', label: 'Free WiFi' },
      { icon: 'shield', label: 'Secure lockers' },
      { icon: 'heart', label: 'Female-only' },
      { icon: 'utensils', label: 'Breakfast option' },
    ],
    highlights: [
      { icon: 'shield', title: 'Female-only', desc: 'Safe space just for women' },
      { icon: 'heart', title: 'Super social', desc: 'Meet solo travelers from everywhere' },
    ],
    houseRules: [
      { rule: 'Female guests only' },
      { rule: 'Check-in from 2:00 PM — Check-out by 11:00 AM' },
      { rule: 'Respect quiet hours after 11:00 PM' },
    ],
    waMessage: "Hi! I'd like to book a bed in the Female Dorm at Lina House.",
  },
  {
    name: '4-Bed Mixed Dorm (Ensuite)',
    slug: 'mixed-dorm',
    badge: '',
    order: 5,
    detail: 'Per bed · Mixed dorm · Ensuite bathroom',
    price: 13.08,
    priceBreakfast: 16.11,
    rating: '9.4',
    tagline: 'The social surfer dorm',
    description:
      'Our mixed-gender 4-bed dorm with an ensuite bathroom — the bathroom is just yours and your three roommates. Each bed has a reading light, outlet, and secure locker. Wake up, surf, repeat.',
    guests: 1,
    beds: 'Single bed in a 4-bed mixed dorm',
    bathroom: 'Ensuite shared bathroom',
    amenities: [
      { icon: 'wifi', label: 'Free WiFi' },
      { icon: 'shield', label: 'Secure lockers' },
      { icon: 'waves', label: 'Surfer-friendly' },
      { icon: 'utensils', label: 'Breakfast option' },
    ],
    highlights: [
      { icon: 'waves', title: 'Surfer vibes', desc: 'Mostly filled with fellow surfers' },
      { icon: 'heart', title: 'Community first', desc: 'Friends for life, not just a bed' },
    ],
    houseRules: [
      { rule: 'Check-in from 2:00 PM — Check-out by 11:00 AM' },
      { rule: 'No smoking inside rooms' },
      { rule: 'Respect quiet hours after 11:00 PM' },
    ],
    waMessage: "Hi! I'd like to book a bed in the Mixed Dorm at Lina House.",
  },
]

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const existing = await payload.find({
      collection: 'rooms',
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      return NextResponse.json({
        success: false,
        message: `Rooms already seeded (${existing.totalDocs} found). Delete them first from /admin if you want to re-seed.`,
      })
    }

    const created: { id: string | number; name: string; slug: string }[] = []
    for (const room of roomsData) {
      const doc = await payload.create({
        collection: 'rooms',
        data: room as any,
      })
      created.push({ id: doc.id, name: room.name, slug: room.slug })
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${created.length} rooms`,
      rooms: created,
      note: 'Images not included — add them from /admin/collections/rooms for each room.',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    )
  }
}
