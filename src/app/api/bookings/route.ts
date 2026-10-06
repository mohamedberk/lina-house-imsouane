import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendBookingEmails } from '@/lib/emails/booking'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    const {
      customerName,
      customerEmail,
      customerPhone,
      flightType,
      flightTitle,
      date,
      numberOfAdults,
      numberOfChildren,
      totalPrice,
      specialRequests,
      bookingDetails,
      pickupLocation,
      packageId,
    } = body

    if (!customerName || !customerEmail || !customerPhone || !date || !numberOfAdults || !flightTitle || !flightType) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          missing: {
            customerName: !customerName,
            customerEmail: !customerEmail,
            customerPhone: !customerPhone,
            date: !date,
            numberOfAdults: !numberOfAdults,
            flightTitle: !flightTitle,
            flightType: !flightType,
          },
        },
        { status: 400 },
      )
    }

    const bookingDate = new Date(date).toISOString()

    // Deduplicate near-simultaneous submissions (same guest, same item, same date within 60s)
    const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString()
    const existing = await payload.find({
      collection: 'bookings',
      where: {
        and: [
          { customerEmail: { equals: customerEmail } },
          { date: { equals: bookingDate } },
          { flightType: { equals: flightType } },
          { createdAt: { greater_than: oneMinuteAgo } },
        ],
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json({
        success: true,
        doc: existing.docs[0],
        message: 'Booking already exists',
        duplicate: true,
      })
    }

    const booking = await payload.create({
      collection: 'bookings',
      data: {
        customerName,
        customerEmail,
        customerPhone,
        package: packageId || undefined,
        flightTitle,
        flightType,
        date: bookingDate,
        numberOfAdults,
        numberOfChildren: numberOfChildren || 0,
        totalPrice: totalPrice || 0,
        pickupLocation: pickupLocation || '',
        pickupLocationKnown: Boolean(pickupLocation),
        specialRequests: specialRequests || '',
        bookingSummary: bookingDetails || '',
        status: 'pending',
        paymentStatus: 'unpaid',
      } as any,
    })

    try {
      await sendBookingEmails({
        bookingId: String(booking.id),
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        itemTitle: booking.flightTitle,
        bookingDate: booking.date,
        adults: booking.numberOfAdults,
        children: booking.numberOfChildren || 0,
        totalPrice: booking.totalPrice,
        bookingDetails: bookingDetails || undefined,
        specialRequests: booking.specialRequests || undefined,
      })
      console.log(`✓ Booking emails sent for ${booking.id}`)
    } catch (emailErr) {
      console.error(`✗ Booking emails failed for ${booking.id}:`, emailErr)
    }

    return NextResponse.json({
      success: true,
      doc: booking,
      message: 'Booking created successfully',
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      {
        error: 'Failed to create booking',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)

    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    const bookings = await payload.find({
      collection: 'bookings',
      limit,
      page,
      sort: '-createdAt',
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}
