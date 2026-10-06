import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const activitiesData = [
  // ── 1. Surf Lessons (homepage summary card) ──
  {
    title: 'Surf Lessons',
    activityType: 'lesson' as const,
    slug: 'surf-lessons',
    badge: 'All Levels',
    order: 1,
    price: 27.62,
    priceUnit: '/ session',
    duration: '2h Session',
    features: [
      { label: 'Professional Certified Instructors' },
      { label: 'All Equipment Included' },
      { label: 'Photo & Video Souvenir' },
    ],
    bookingLink: '/booking?type=surf&slug=group',
    bookingText: 'Book Now',
    tagline: 'Learn to surf with certified instructors',
    description:
      'Professional surf lessons for all levels in Imsouane. Our certified instructors will guide you through the basics or help you refine your technique on the longest wave in Africa.',
    level: 'All levels',
    groupSize: '1–6 people',
    includes: [
      { item: 'Board & wetsuit included' },
      { item: 'Beach warm-up & theory' },
      { item: 'In-water coaching' },
      { item: 'Photo & video tips' },
      { item: 'Safety briefing' },
    ],
    notIncluded: [
      { item: 'Transport to the beach' },
      { item: 'Meals & drinks' },
      { item: 'Travel insurance' },
    ],
    waMessage: 'Hi! I would like to book a surf lesson at Lina House.',
  },
  // ── 2. Board & Wetsuit Rental ──
  {
    title: 'Board & Wetsuit Rental',
    activityType: 'rental' as const,
    slug: 'board-rental',
    badge: 'Daily & Weekly',
    order: 2,
    price: 3.68,
    priceUnit: '/ day',
    duration: 'Per Day',
    features: [
      { label: 'Surfboard — €5.52 / day' },
      { label: 'Wetsuit — €3.68 / day' },
      { label: 'Full Week Bundle — €32.23' },
    ],
    bookingLink: '/booking?type=surf&slug=rental',
    bookingText: 'Book Now',
    tagline: 'Quality boards and wetsuits for every level',
    description:
      'Rent quality surfboards and wetsuits by the day or week. We have foam, soft-top, and fiberglass boards for all levels. All equipment is sanitized daily.',
    level: 'All levels',
    groupSize: '',
    includes: [
      { item: 'Board of your choice' },
      { item: 'Wetsuit in your size' },
      { item: 'Wax & leash' },
    ],
    notIncluded: [
      { item: 'Instructor (book a lesson separately)' },
      { item: 'Transport to the beach' },
    ],
    waMessage: 'Hi! I would like to rent a surfboard and wetsuit at Lina House.',
  },
  // ── 3. Private Coaching ──
  {
    title: 'Private Coaching',
    activityType: 'lesson' as const,
    slug: 'private',
    badge: '',
    order: 3,
    price: 27.62,
    priceUnit: '/ session',
    duration: '2 hours',
    features: [
      { label: '1-on-1 with certified instructor' },
      { label: 'All equipment included' },
      { label: 'Personalized feedback' },
    ],
    bookingLink: '/booking?type=surf&slug=private',
    bookingText: 'Book Now',
    tagline: '1-on-1 with a certified instructor',
    description:
      "Get the full attention of an experienced surf instructor tailored to your exact level. Whether you're standing up for the first time or refining your bottom turn, private coaching accelerates your progress like nothing else.",
    level: 'All levels',
    groupSize: '1 person',
    includes: [
      { item: 'Board & wetsuit included' },
      { item: 'Beach warm-up & theory' },
      { item: 'In-water coaching' },
      { item: 'Photo & video tips' },
      { item: 'Personalized feedback' },
      { item: 'Safety briefing' },
    ],
    notIncluded: [
      { item: 'Transport to the beach' },
      { item: 'Meals & drinks' },
      { item: 'Travel insurance' },
    ],
    waMessage: 'Hi! I would like to book a private surf coaching session at Lina House.',
  },
  // ── 4. Small Group Lesson ──
  {
    title: 'Small Group Lesson',
    activityType: 'lesson' as const,
    slug: 'small-group',
    badge: 'Most Popular',
    order: 4,
    price: 23.02,
    priceUnit: '/ person',
    duration: '2 hours',
    features: [
      { label: 'Small group of 2–4 people' },
      { label: 'All equipment included' },
      { label: 'Similar level grouping' },
    ],
    bookingLink: '/booking?type=surf&slug=small-group',
    bookingText: 'Book Now',
    tagline: 'The perfect balance of fun & focus',
    description:
      'Our most popular option. Surf with 2–4 people of similar level while still getting plenty of personal attention from your instructor. The group energy pushes everyone to catch more waves.',
    level: 'Beginner–Intermediate',
    groupSize: '2–4 people',
    includes: [
      { item: 'Board & wetsuit included' },
      { item: 'Beach warm-up & theory' },
      { item: 'In-water coaching' },
      { item: 'Group of similar level' },
      { item: 'Safety briefing' },
      { item: 'Fun group atmosphere' },
    ],
    notIncluded: [
      { item: 'Transport to the beach' },
      { item: 'Meals & drinks' },
      { item: 'Travel insurance' },
    ],
    waMessage: 'Hi! I would like to book a small group surf lesson at Lina House.',
  },
  // ── 5. Group Lesson ──
  {
    title: 'Group Lesson',
    activityType: 'lesson' as const,
    slug: 'group',
    badge: 'Best Value',
    order: 5,
    price: 18.42,
    priceUnit: '/ person',
    duration: '2 hours',
    features: [
      { label: 'Large group experience' },
      { label: 'All equipment included' },
      { label: 'Fun group atmosphere' },
    ],
    bookingLink: '/booking?type=surf&slug=group',
    bookingText: 'Book Now',
    tagline: 'Beginner focused — the social surf experience',
    description:
      "The most affordable way to learn surfing in Imsouane. Join a group of fellow beginners, learn the fundamentals on Magic Bay's gentle whitewash, and share the excitement of catching your first waves together.",
    level: 'Beginner',
    groupSize: 'Large group',
    includes: [
      { item: 'Board & wetsuit included' },
      { item: 'Beach warm-up & theory' },
      { item: 'In-water coaching' },
      { item: 'Safety briefing' },
      { item: 'Group of 5+ surfers' },
      { item: 'Fun group atmosphere' },
    ],
    notIncluded: [
      { item: 'Transport to the beach' },
      { item: 'Meals & drinks' },
      { item: 'Travel insurance' },
    ],
    waMessage: 'Hi! I would like to book a group surf lesson at Lina House.',
  },
]

export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Check if activities already exist to avoid duplicates
    const existing = await payload.find({
      collection: 'activities',
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      return NextResponse.json({
        success: false,
        message: `Activities already seeded (${existing.totalDocs} found). Delete them first from /admin if you want to re-seed.`,
      })
    }

    const created = []
    for (const activity of activitiesData) {
      const doc = await payload.create({
        collection: 'activities',
        data: activity,
      })
      created.push({ id: doc.id, title: activity.title, slug: activity.slug })
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${created.length} activities`,
      activities: created,
      note: 'Images not included — add them from /admin/collections/activities for each activity.',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    )
  }
}
