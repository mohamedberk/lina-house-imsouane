import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const packagesData = [
  {
    title: '3-Day Surf Escape',
    slug: '3-day-surf-escape',
    badge: 'Quick Start',
    category: 'Quick Start',
    highlight: false,
    order: 1,
    price: 110.49,
    priceUnit: '/ person',
    duration: '3 days / 2 nights',
    pricingBasis: 'per-person',
    durationNights: 2,
    includedRoomMaxGuests: 1,
    includesBreakfast: true,
    includedGroupSurfLessons: 2,
    includedPrivateSurfLessons: 0,
    features: [
      { label: '2 nights in a private room' },
      { label: '2 guided surf lessons (2h each)' },
      { label: 'Daily homemade breakfast' },
      { label: 'Board & wetsuit included' },
      { label: 'Airport pickup available' },
    ],
    tagline: 'A long weekend by the longest wave in Africa',
    description:
      "Your quick escape to Imsouane — two nights of ocean views, two surf sessions on Magic Bay's endless wave, and three mornings waking up to the sound of the Atlantic. Perfect for a weekend getaway from the city.",
    longDescription:
      "Fly in Friday, catch your first wave Saturday morning, join us for a wood-fire BBQ Saturday night, surf one more time Sunday and head home already planning your return. All equipment, breakfast, and a cozy private room are included. Add lunch and dinner for a few extra euros.",
    highlights: [
      { icon: 'waves', title: '2 surf lessons', desc: 'With certified instructors' },
      { icon: 'sun', title: 'Rooftop breakfasts', desc: 'Ocean view every morning' },
      { icon: 'heart', title: 'Community vibe', desc: 'Meet surfers from the world over' },
    ],
    includes: [
      { item: '2 nights accommodation (private room)' },
      { item: '2 surf lessons (2h each)' },
      { item: 'Daily homemade breakfast' },
      { item: 'Board & wetsuit rental' },
      { item: 'WiFi, rooftop access, secure lockers' },
    ],
    notIncludes: [
      { item: 'Airport transfer (optional add-on)' },
      { item: 'Lunch & dinner' },
      { item: 'Travel insurance' },
    ],
    schedule: [
      { time: 'Day 1 — PM', icon: 'heart', label: 'Check-in, rooftop welcome drinks' },
      { time: 'Day 2 — AM', icon: 'waves', label: 'Surf lesson #1 at Magic Bay' },
      { time: 'Day 2 — PM', icon: 'utensils', label: 'Lunch, free time, wood-fire BBQ' },
      { time: 'Day 3 — AM', icon: 'waves', label: 'Surf lesson #2, breakfast, check-out' },
    ],
    ctaText: 'Book 3-Day Escape',
    waMessage: "Hi! I'd like to book the 3-Day Surf Escape at Lina House.",
  },
  {
    title: '5-Day Surf & Stay',
    slug: '5-day-surf-and-stay',
    badge: 'Most Popular',
    category: 'Most Popular',
    highlight: true,
    order: 2,
    price: 202.58,
    priceUnit: '/ person',
    duration: '5 days / 4 nights',
    pricingBasis: 'per-person',
    durationNights: 4,
    includedRoomMaxGuests: 1,
    includesBreakfast: true,
    includedGroupSurfLessons: 4,
    includedPrivateSurfLessons: 0,
    features: [
      { label: '4 nights in a private room' },
      { label: '4 surf lessons (2h each)' },
      { label: 'Daily homemade breakfast' },
      { label: 'One wood-fire BBQ dinner included' },
      { label: 'Board & wetsuit included' },
      { label: 'Free rooftop yoga session' },
    ],
    tagline: 'The sweet spot between escape and full immersion',
    description:
      "Five days of surf, sun, and slow mornings. Four lessons to really feel your progress on the wave, four sunsets from the rooftop, and enough time to fall in love with Imsouane's rhythm.",
    longDescription:
      "By day two you'll know the baristas at the café, by day three you'll be popping up on every wave, and by day five leaving will feel harder than it should. This is the package most guests come for — and the one they extend.",
    highlights: [
      { icon: 'waves', title: '4 surf lessons', desc: 'Real progress in one week' },
      { icon: 'utensils', title: 'BBQ night', desc: 'Fresh harbour fish on the fire' },
      { icon: 'sun', title: 'Rooftop yoga', desc: 'One free sunrise session' },
      { icon: 'heart', title: 'Community dinners', desc: 'Eat with surfers worldwide' },
    ],
    includes: [
      { item: '4 nights accommodation (private room)' },
      { item: '4 surf lessons (2h each)' },
      { item: 'Daily homemade breakfast' },
      { item: '1 wood-fire BBQ dinner' },
      { item: 'Board & wetsuit rental throughout' },
      { item: '1 rooftop yoga session' },
      { item: 'WiFi, rooftop access, secure lockers' },
    ],
    notIncludes: [
      { item: 'Airport transfer (optional add-on)' },
      { item: 'Lunches & other dinners' },
      { item: 'Travel insurance' },
    ],
    schedule: [
      { time: 'Day 1', icon: 'heart', label: 'Check-in, rooftop welcome' },
      { time: 'Day 2', icon: 'waves', label: 'Surf #1 + free afternoon' },
      { time: 'Day 3', icon: 'waves', label: 'Surf #2 + BBQ dinner' },
      { time: 'Day 4', icon: 'waves', label: 'Surf #3 + rooftop yoga' },
      { time: 'Day 5', icon: 'waves', label: 'Surf #4, breakfast, check-out' },
    ],
    ctaText: 'Book 5-Day Package',
    waMessage: "Hi! I'd like to book the 5-Day Surf & Stay package at Lina House.",
  },
  {
    title: '7-Day Surf Camp',
    slug: '7-day-surf-camp',
    badge: 'Best Value',
    category: 'Best Value',
    highlight: false,
    order: 3,
    price: 267.04,
    priceUnit: '/ person',
    duration: '7 days / 6 nights',
    pricingBasis: 'per-person',
    durationNights: 6,
    includedRoomMaxGuests: 1,
    includesBreakfast: true,
    includedGroupSurfLessons: 6,
    includedPrivateSurfLessons: 1,
    features: [
      { label: '6 nights in a private room' },
      { label: '6 surf lessons (2h each)' },
      { label: 'Daily homemade breakfast' },
      { label: '3 wood-fire BBQ dinners' },
      { label: 'Board & wetsuit included' },
      { label: '1 private coaching session' },
      { label: 'Free day trip to Taghazout' },
    ],
    tagline: 'A full week in your new favorite village',
    description:
      "The full Lina House experience — a whole week to sink into Imsouane's pace. Six surf lessons, one private coaching session to unlock your next level, three BBQ nights, and a day trip to neighboring Taghazout. Come as a guest, leave as family.",
    longDescription:
      "This is the package for travelers who want to really learn — not just try — surfing. By the end of the week you'll be paddling out on your own, reading the lineup, and catching waves that would have intimidated you on day one. Plus all the meals, stories, and rooftop sunsets in between.",
    highlights: [
      { icon: 'waves', title: '6 group + 1 private', desc: 'Serious progress guaranteed' },
      { icon: 'utensils', title: '3 BBQ nights', desc: 'The legendary house dinner' },
      { icon: 'map-pin', title: 'Taghazout day trip', desc: 'Explore the Atlantic coast' },
      { icon: 'heart', title: 'Full immersion', desc: 'Feel at home by day two' },
    ],
    includes: [
      { item: '6 nights accommodation (private room)' },
      { item: '6 group surf lessons + 1 private session' },
      { item: 'Daily homemade breakfast' },
      { item: '3 wood-fire BBQ dinners' },
      { item: 'Board & wetsuit rental throughout' },
      { item: 'Day trip to Taghazout' },
      { item: 'WiFi, rooftop access, secure lockers' },
    ],
    notIncludes: [
      { item: 'Airport transfer (optional add-on)' },
      { item: 'Lunches & other dinners' },
      { item: 'Travel insurance' },
    ],
    schedule: [
      { time: 'Day 1', icon: 'heart', label: 'Arrival + rooftop welcome' },
      { time: 'Day 2–3', icon: 'waves', label: '2 group surf lessons + BBQ night' },
      { time: 'Day 4', icon: 'map-pin', label: 'Day trip to Taghazout' },
      { time: 'Day 5–6', icon: 'waves', label: '3 group lessons + 1 private session' },
      { time: 'Day 7', icon: 'waves', label: 'Final surf, breakfast, farewell' },
    ],
    ctaText: 'Book 7-Day Camp',
    waMessage: "Hi! I'd like to book the 7-Day Surf Camp at Lina House.",
  },
]

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const existing = await payload.find({
      collection: 'packages',
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      return NextResponse.json({
        success: false,
        message: `Packages already seeded (${existing.totalDocs} found). Delete them first from /admin if you want to re-seed.`,
      })
    }

    const created: { id: string | number; title: string; slug: string }[] = []
    for (const pkg of packagesData) {
      const doc = await payload.create({
        collection: 'packages',
        data: pkg as any,
      })
      created.push({ id: doc.id, title: pkg.title, slug: pkg.slug })
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${created.length} packages`,
      packages: created,
      note: 'Images not included — add them from /admin/collections/packages for each package.',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    )
  }
}
