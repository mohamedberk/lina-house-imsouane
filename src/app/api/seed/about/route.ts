import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const aboutData = {
  heroSection: {
    eyebrow: 'About Us',
    title: 'Your Home by the Ocean',
    description:
      'A surf camp, hostel & restaurant in the heart of Imsouane — where the waves meet Moroccan hospitality.',
    ratingValue: '9.7/10',
    ratingLabel: 'on Booking.com',
    location: 'Imsouane, Morocco',
  },
  storySection: {
    eyebrow: 'Our Story',
    title: 'A Place You Can Trust',
    ratingText: '9.7/10 on Booking.com',
    description:
      "Nestled in the charming fishing village of Imsouane, Lina House is more than a hostel — it's a gateway to Morocco's most magical coastline. Whether you're here to surf the legendary Magic Bay, explore the village, or simply unwind on our rooftop terrace, our doors are always open.",
    features: [
      { label: '24/7 reception & security on site' },
      { label: 'Secure luggage and board storage' },
      { label: 'Safe, quiet neighborhood 500m from Magic Bay' },
      { label: 'Trusted by 22+ Booking.com reviewers (9.7/10)' },
      { label: 'Friendly, multilingual local team led by host Abdou' },
    ],
  },
  experienceSection: {
    eyebrow: 'Our Experience',
    title: 'More Than Just a Place to Sleep',
    ratingText: 'Loved by guests worldwide',
    description1:
      'What started as a small guesthouse has grown into a vibrant community hub where travelers from around the world share waves, stories, and wood-fire dinners under the stars.',
    description2:
      'Our team — led by host Abdou — goes above and beyond to make every guest feel like family. From homemade breakfasts to organizing surf sessions, every detail is crafted for you.',
    features: [
      { label: 'Ocean-view rooftop terrace with sunset vibes' },
      { label: 'On-site restaurant with fresh local cuisine' },
      { label: 'Wood-fire BBQ dinner every evening' },
      { label: 'Free fiber optic WiFi throughout' },
      { label: 'Homemade Moroccan breakfast included' },
    ],
  },
  featureStrip: {
    items: [
      { icon: 'map-pin', value: '500m', label: 'From Beach' },
      { icon: 'star', value: '9.7/10', label: 'Guest Rating' },
      { icon: 'utensils', value: 'Restaurant', label: 'On-site' },
      { icon: 'sun', value: 'Rooftop', label: 'Terrace' },
      { icon: 'wifi', value: 'Free WiFi', label: 'Fiber Optic' },
      { icon: 'shield', value: '24/7', label: 'Security' },
    ],
  },
  experienceCards: {
    eyebrow: 'The Experience',
    title: 'Surf, Eat & Feel at Home',
    subtitle:
      'Three pillars that make Lina House more than just another place to sleep',
    cards: [
      {
        icon: 'waves',
        title: 'World-Class Surf',
        description:
          "Magic Bay's gentle, incredibly long waves are perfect for beginners. Advanced surfers can tackle Cathedral's powerful point break just around the corner.",
        features: [
          { label: 'Certified instructors' },
          { label: 'All levels welcome' },
          { label: 'Equipment provided' },
        ],
      },
      {
        icon: 'utensils',
        title: 'From Ocean to Table',
        description:
          'Fresh fish from the harbour, traditional tagines, and legendary wood-fire BBQ every evening. Every meal is made with love from local ingredients.',
        features: [
          { label: 'Fresh daily breakfast' },
          { label: 'Wood-fire BBQ dinner' },
          { label: 'Rooftop dining' },
        ],
      },
      {
        icon: 'heart',
        title: 'A Place Called Home',
        description:
          'Cozy rooms, ocean-view rooftop terrace, and a warm community of travelers. Arrive as a guest, leave as family.',
        features: [
          { label: 'Ocean-view terrace' },
          { label: 'Fiber optic WiFi' },
          { label: 'Communal dinners' },
        ],
      },
    ],
  },
  gallerySection: {
    eyebrow: 'Gallery',
    title: 'Life at Lina House',
    subtitle:
      'Surf sessions, rooftop sunsets, communal dinners, and everything in between',
  },
  faqSection: {
    eyebrow: 'FAQ',
    title: 'Frequently Asked Questions',
    contactText: 'Still have questions?',
    whatsappUrl: 'https://wa.me/212772228120',
    whatsappLabel: 'Chat with us on WhatsApp',
    faqs: [
      {
        question: 'What is the best time to visit Imsouane for surfing?',
        answer:
          'Imsouane has waves year-round! The best surf season is from September to April when the Atlantic swells are most consistent. Beginners will find Magic Bay gentle and welcoming any time of year, while advanced surfers prefer the bigger winter swells at Cathedral.',
      },
      {
        question: 'Do I need to bring my own surf equipment?',
        answer:
          'No, we provide surfboards and wetsuits for rent. Our collection includes foamies for beginners, longboards, and shortboards for experienced surfers. If you prefer your own gear, we have secure board storage available.',
      },
      {
        question: 'What is included with my stay at Lina House?',
        answer:
          'Every stay includes a homemade breakfast, free WiFi, access to our rooftop terrace with ocean views, and use of common areas. Packages that include meals and surf lessons are also available for the best value.',
      },
      {
        question: 'How do I get to Imsouane from the airport?',
        answer:
          "The nearest airport is Agadir Al Massira (AGA), about a 2-hour drive. We can arrange private transfers for you. Alternatively, you can take a grand taxi or rent a car. From Essaouira it's 2.5 hours, and from Marrakech about 4 hours.",
      },
      {
        question: 'Can I book surf lessons without staying at Lina House?',
        answer:
          'Absolutely! Our Surf Only package is perfect for day visitors. Join a 2-hour group session with a certified instructor — board and wetsuit included. Just €18.42 per session.',
      },
      {
        question: 'Is Lina House suitable for solo travelers?',
        answer:
          "Definitely! Many of our guests travel solo. The communal dinners, shared dorms, and rooftop terrace make it incredibly easy to meet people. You'll arrive alone and leave with friends from around the world.",
      },
    ],
  },
  ctaSection: {
    title: 'Ready to Experience Imsouane?',
    subtitle:
      "Book your stay at Lina House and discover the magic of Morocco's most beautiful coastline",
    primaryButtonText: 'View Rooms',
    primaryButtonLink: '/en/rooms',
    secondaryButtonText: 'View Packages',
    secondaryButtonLink: '/en/packages',
  },
}

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const result = await payload.updateGlobal({
      slug: 'about-page',
      data: aboutData as any,
    })

    return NextResponse.json({
      success: true,
      message: 'About page global seeded successfully',
      id: result.id,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    )
  }
}
