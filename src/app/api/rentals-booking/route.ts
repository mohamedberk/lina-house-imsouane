import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

type Equipment = 'board' | 'wetsuit' | 'both'

const EQUIPMENT_LABEL: Record<Equipment, string> = {
  board: 'Board only',
  wetsuit: 'Wetsuit only',
  both: 'Board + Wetsuit',
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function parseDate(value: unknown): Date | null {
  if (typeof value !== 'string' || !value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

function computeDays(start: Date, end: Date): number {
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86_400_000) + 1)
}

function computeTotal(days: number, qty: number): number {
  const unit = qty === 1 ? 7 : 6
  return days * qty * unit
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
    }

    const {
      customerName,
      customerEmail,
      customerPhone,
      equipment,
      startDate,
      endDate,
      qty,
    } = body as Record<string, unknown>

    // Validate strings
    if (typeof customerName !== 'string' || customerName.trim().length < 2) {
      return NextResponse.json({ ok: false, error: 'Invalid name' }, { status: 400 })
    }
    if (typeof customerEmail !== 'string' || !EMAIL_REGEX.test(customerEmail.trim())) {
      return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 })
    }
    if (typeof customerPhone !== 'string' || customerPhone.trim().length < 6) {
      return NextResponse.json({ ok: false, error: 'Invalid phone' }, { status: 400 })
    }

    // Equipment
    const eq = equipment as Equipment
    if (eq !== 'board' && eq !== 'wetsuit' && eq !== 'both') {
      return NextResponse.json({ ok: false, error: 'Invalid equipment selection' }, { status: 400 })
    }

    // Dates
    const start = parseDate(startDate)
    const end = parseDate(endDate)
    if (!start || !end) {
      return NextResponse.json({ ok: false, error: 'Invalid dates' }, { status: 400 })
    }
    if (end.getTime() < start.getTime()) {
      return NextResponse.json({ ok: false, error: 'End date must be after start date' }, { status: 400 })
    }

    // Quantity
    const q = typeof qty === 'number' ? qty : parseInt(String(qty ?? ''), 10)
    if (!Number.isFinite(q) || q < 1 || q > 8) {
      return NextResponse.json({ ok: false, error: 'Invalid quantity (must be 1–8)' }, { status: 400 })
    }

    const days = computeDays(start, end)
    const totalPrice = computeTotal(days, q)

    const payload = await getPayload({ config })

    const specialRequests =
      `Equipment: ${EQUIPMENT_LABEL[eq]}\n` +
      `Rental period: ${start.toISOString().slice(0, 10)} → ${end.toISOString().slice(0, 10)} (${days} ${days === 1 ? 'day' : 'days'})\n` +
      `People: ${q}`

    const booking = await payload.create({
      collection: 'bookings',
      data: {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        flightTitle: 'Surfboard + Wetsuit Rental',
        flightType: 'rental',
        date: start.toISOString(),
        numberOfAdults: q,
        numberOfChildren: 0,
        totalPrice,
        pickupLocationKnown: true,
        specialRequests,
        status: 'pending',
        paymentStatus: 'unpaid',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    })

    return NextResponse.json({ ok: true, id: booking.id })
  } catch (error) {
    console.error('Error creating rental booking:', error)
    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to create booking',
      },
      { status: 500 },
    )
  }
}
