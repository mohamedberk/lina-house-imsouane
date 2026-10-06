import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Collect current IDs for rooms/packages/activities so we can wire up the
    // featuredRooms / featuredPackages / featuredActivities relationships.
    const [rooms, packages, activities] = await Promise.all([
      payload.find({ collection: 'rooms', limit: 100, sort: 'order', depth: 0 }),
      payload.find({ collection: 'packages', limit: 100, sort: 'order', depth: 0 }),
      payload.find({ collection: 'activities', limit: 100, sort: 'order', depth: 0 }),
    ])

    const roomIds = rooms.docs.map((d: any) => d.id)
    const packageIds = packages.docs.map((d: any) => d.id)
    const activityIds = activities.docs.map((d: any) => d.id)

    const homepageData = {
      roomsSection: {
        title: 'Our rooms,',
        titleAccent: 'for every kind of stay',
        featuredRooms: roomIds,
      },
      surfSection: {
        title: 'Our wave,',
        titleAccent: 'the longest in Africa',
        description:
          'Certified instructors, premium equipment, and the perfect wave — everything you need for an unforgettable surf experience',
        featuredActivities: activityIds,
      },
      packagesSection: {
        title: 'Our packages,',
        titleAccent: 'stay longer, save more',
        description:
          'Bundle your stay and save — each package is crafted for the ultimate Imsouane experience',
        featuredPackages: packageIds,
      },
      rentalsSection: {
        title: 'Rentals,',
        titleAccent: 'paddle out today',
        description: 'Quality boards and wetsuits, ready on-site — book by the day.',
        fromPriceBadge: 'From 6€ / day',
        soloNote: 'Solo: 7€ / day',
        groupNote: 'Group (2+): 6€ / day per person',
        cardTitle: 'Surfboard + Wetsuit Rental',
        cardDescription:
          'Freshly maintained gear, swapped every season. Perfect for every level and every Imsouane wave.',
        features: [
          { label: 'Boards for every level (softtop & fiber)', icon: 'waves' },
          { label: 'Wetsuits 3/2 & 4/3 — all sizes', icon: 'shield' },
          { label: 'Leash, wax & local tips included', icon: 'check' },
        ],
        displayPrice: 6,
        perDayLabel: '/ day',
        soloPricePerDay: 7,
        groupPricePerDay: 6,
        bookNowText: 'Book Now',
        form: {
          equipment: 'Equipment',
          boardOnly: 'Board',
          wetsuitOnly: 'Wetsuit',
          both: 'Both',
          startDate: 'Start date',
          endDate: 'End date',
          quantity: 'People',
          fullName: 'Full name',
          email: 'Email',
          phone: 'Phone',
          days: 'days',
          day: 'day',
          perPerson: 'per person / day',
          submit: 'Confirm booking',
          submitting: 'Sending…',
          successTitle: 'Thanks!',
          successMessage: "Thanks — we'll confirm by email.",
          errorGeneric: 'Something went wrong. Please try again.',
          errorDateOrder: 'End date must be after start date.',
        },
      },
      restaurantSection: {
        title: 'Our kitchen,',
        titleAccent: 'fresh fish and a wood fire',
        description:
          'Fresh catches from the harbour, traditional Moroccan flavors, and wood-fire BBQ every evening',
        meals: [
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
        philosophy: [
          { title: 'From the Harbour', description: 'Daily fresh catch' },
          { title: '100% Fresh', description: 'Local ingredients' },
          { title: 'Wood-Fire Grill', description: 'Traditional cooking' },
          { title: 'Made with Love', description: 'Home-cooked meals' },
        ],
      },
    }

    const result = await payload.updateGlobal({
      slug: 'homepage',
      data: homepageData as any,
    })

    // Seed French locale for the rentals section (numeric fields are not localized
    // and are already set by the EN update above).
    const homepageDataFr = {
      rentalsSection: {
        title: 'Location,',
        titleAccent: 'glissez dès aujourd\u2019hui',
        description:
          'Planches et combinaisons de qualité, disponibles sur place — réservez à la journée.',
        fromPriceBadge: 'À partir de 6€ / jour',
        soloNote: 'Solo : 7€ / jour',
        groupNote: 'Groupe (2+) : 6€ / jour par pers.',
        cardTitle: 'Location Planche + Combinaison',
        cardDescription:
          'Matériel soigné, changé chaque saison. Idéal pour tous niveaux et toutes les vagues d\u2019Imsouane.',
        features: [
          { label: 'Planches tous niveaux (softtop & fiber)', icon: 'waves' },
          { label: 'Combinaisons 3/2 & 4/3 toutes tailles', icon: 'shield' },
          { label: 'Leash, wax & conseils inclus', icon: 'check' },
        ],
        perDayLabel: '/ jour',
        bookNowText: 'Réserver',
        form: {
          equipment: 'Équipement',
          boardOnly: 'Planche',
          wetsuitOnly: 'Combinaison',
          both: 'Les deux',
          startDate: 'Date de début',
          endDate: 'Date de fin',
          quantity: 'Personnes',
          fullName: 'Nom complet',
          email: 'Email',
          phone: 'Téléphone',
          days: 'jours',
          day: 'jour',
          perPerson: 'par personne / jour',
          submit: 'Confirmer la réservation',
          submitting: 'Envoi\u2026',
          successTitle: 'Merci !',
          successMessage: 'Merci — nous confirmerons par email.',
          errorGeneric: 'Une erreur est survenue. Veuillez réessayer.',
          errorDateOrder: 'La date de fin doit être après la date de début.',
        },
      },
    }

    await payload.updateGlobal({
      slug: 'homepage',
      data: homepageDataFr as any,
      locale: 'fr',
    })

    return NextResponse.json({
      success: true,
      message: 'Homepage sections seeded successfully',
      sections: ['roomsSection', 'surfSection', 'packagesSection', 'rentalsSection', 'restaurantSection'],
      linked: {
        rooms: roomIds.length,
        packages: packageIds.length,
        activities: activityIds.length,
      },
      id: result.id,
      note:
        'If rooms/packages/activities counts are 0, run /api/seed/rooms, /api/seed/packages, and /api/seed/activities first, then re-run this endpoint to link them.',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    )
  }
}
