import { Resend } from 'resend'
import { shortBookingRef } from '@/lib/booking-reference'

const COMPANY = {
  name: 'Lina House',
  email: 'contact@linahouse-imsouane.com',
  phone: '+212 772-228120',
  whatsapp: '212772228120',
  website: 'https://linahouse-imsouane.com',
  location: 'Imsouane, Morocco',
}

const BRAND = {
  primary: '#1B4965',
  accent: '#E07A5F',
  sand: '#FAF8F5',
  text: '#111827',
  muted: '#737373',
  border: '#e5e5e5',
}

export interface BookingEmailInput {
  bookingId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  itemTitle: string
  bookingDate: string
  adults: number
  children?: number
  totalPrice?: number
  bookingDetails?: string
  specialRequests?: string
}

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const renderLines = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map(
      (line) =>
        `<div style="padding:6px 0;border-bottom:1px solid #f0f0f0;">${escapeHtml(line)}</div>`,
    )
    .join('')

const formatDate = (value: string) => {
  if (!value) return 'To be confirmed'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'To be confirmed'
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatGuests = (adults: number, children = 0) => {
  const parts: string[] = []
  if (adults > 0) parts.push(`${adults} ${adults === 1 ? 'adult' : 'adults'}`)
  if (children > 0) parts.push(`${children} ${children === 1 ? 'child' : 'children'}`)
  return parts.join(', ') || '1 adult'
}

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:10px 0;color:${BRAND.muted};font-size:14px;">${label}</td>
    <td style="padding:10px 0;color:${BRAND.text};font-size:14px;font-weight:500;text-align:right;">${value}</td>
  </tr>
`

const customerTemplate = (b: BookingEmailInput) => `
<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:${BRAND.sand};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:${BRAND.text};">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;">
    <div style="background:${BRAND.primary};color:#fff;padding:32px;text-align:center;">
      <div style="font-size:24px;font-weight:600;margin-bottom:8px;">🏄 ${COMPANY.name}</div>
      <div style="font-size:13px;opacity:0.85;">${COMPANY.location}</div>
    </div>
    <div style="padding:32px;">
      <p style="font-size:18px;margin:0 0 12px;">Hi ${b.customerName},</p>
      <p style="font-size:14px;color:#525252;line-height:1.7;margin:0 0 24px;">
        Thanks for your booking request! We've received your details and will reach out shortly to confirm availability and next steps.
      </p>

      <div style="background:${BRAND.sand};border-radius:8px;padding:20px;margin-bottom:24px;">
        <div style="font-size:12px;font-weight:600;color:${BRAND.muted};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">Your request</div>
        <table style="width:100%;border-collapse:collapse;">
          ${row('Reference', shortBookingRef(b.bookingId))}
          ${row('Booking', b.itemTitle)}
          ${row('Date', formatDate(b.bookingDate))}
          ${row('Guests', formatGuests(b.adults, b.children))}
          ${b.totalPrice ? row('Estimated total', `€${b.totalPrice}`) : ''}
        </table>
      </div>

      ${b.bookingDetails ? `
      <div style="margin-bottom:24px;">
        <div style="font-size:12px;font-weight:600;color:${BRAND.muted};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Booking details</div>
        <div style="background:${BRAND.sand};border-left:4px solid ${BRAND.primary};padding:14px 16px;border-radius:4px;font-size:14px;color:#374151;line-height:1.6;">${renderLines(b.bookingDetails)}</div>
      </div>
      ` : ''}

      ${b.specialRequests ? `
      <div style="margin-bottom:24px;">
        <div style="font-size:12px;font-weight:600;color:${BRAND.muted};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Special requests</div>
        <div style="background:${BRAND.sand};border-left:4px solid ${BRAND.accent};padding:14px;border-radius:4px;font-size:14px;color:#374151;white-space:pre-wrap;">${escapeHtml(b.specialRequests)}</div>
      </div>
      ` : ''}

      <div style="background:#fafafa;border-radius:8px;padding:20px;text-align:center;">
        <div style="font-size:14px;font-weight:600;margin-bottom:12px;">Need us sooner?</div>
        <div style="font-size:14px;color:${BRAND.muted};margin-bottom:6px;">
          <a href="tel:${COMPANY.phone}" style="color:${BRAND.accent};text-decoration:none;">${COMPANY.phone}</a>
        </div>
        <div style="font-size:14px;color:${BRAND.muted};margin-bottom:14px;">
          <a href="mailto:${COMPANY.email}" style="color:${BRAND.accent};text-decoration:none;">${COMPANY.email}</a>
        </div>
        <a href="https://wa.me/${COMPANY.whatsapp}" style="display:inline-block;background:#25d366;color:#fff;text-decoration:none;padding:10px 22px;border-radius:8px;font-weight:600;font-size:14px;">Chat on WhatsApp</a>
      </div>
    </div>
    <div style="padding:20px 32px;border-top:1px solid ${BRAND.border};text-align:center;font-size:12px;color:#a3a3a3;">
      ${COMPANY.name} • ${COMPANY.location}
    </div>
  </div>
</body></html>
`

const ownerTemplate = (b: BookingEmailInput) => `
<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:${BRAND.text};">
  <div style="max-width:600px;margin:20px auto;background:#fff;border-radius:8px;overflow:hidden;">
    <div style="background:${BRAND.accent};color:#fff;padding:20px 24px;">
      <div style="font-size:20px;font-weight:600;">New Booking Request</div>
      <div style="font-size:13px;opacity:0.9;margin-top:4px;">${b.itemTitle} • ${formatDate(b.bookingDate)}</div>
    </div>
    <div style="padding:24px;">
      <div style="background:#ecfdf5;border:1px solid #a7f3d0;padding:14px 16px;border-radius:8px;margin-bottom:20px;">
        <div style="display:flex;justify-content:space-between;">
          <span style="color:#065f46;font-size:13px;">Booking ID</span>
          <span style="color:#065f46;font-size:13px;font-weight:600;">${shortBookingRef(b.bookingId)}</span>
        </div>
        ${b.totalPrice ? `
        <div style="display:flex;justify-content:space-between;margin-top:6px;">
          <span style="color:#065f46;font-size:13px;">Estimated total</span>
          <span style="color:#065f46;font-size:16px;font-weight:600;">€${b.totalPrice}</span>
        </div>
        ` : ''}
      </div>

      <div style="font-size:12px;font-weight:600;color:${BRAND.muted};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;border-bottom:1px solid #e5e7eb;padding-bottom:6px;">Customer</div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        ${row('Name', b.customerName)}
        ${row('Email', `<a href="mailto:${b.customerEmail}" style="color:${BRAND.accent};text-decoration:none;">${b.customerEmail}</a>`)}
        ${b.customerPhone ? row('Phone', `<a href="tel:${b.customerPhone}" style="color:${BRAND.accent};text-decoration:none;">${b.customerPhone}</a>`) : ''}
      </table>

      <div style="font-size:12px;font-weight:600;color:${BRAND.muted};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;border-bottom:1px solid #e5e7eb;padding-bottom:6px;">Booking details</div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        ${row('Item', b.itemTitle)}
        ${row('Date', formatDate(b.bookingDate))}
        ${row('Guests', formatGuests(b.adults, b.children))}
      </table>

      ${b.bookingDetails ? `
      <div style="font-size:12px;font-weight:600;color:${BRAND.muted};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;border-bottom:1px solid #e5e7eb;padding-bottom:6px;">Booking details</div>
      <div style="background:#f9fafb;border-left:4px solid ${BRAND.primary};padding:14px 16px;border-radius:4px;font-size:14px;color:#374151;line-height:1.6;margin-bottom:20px;">${renderLines(b.bookingDetails)}</div>
      ` : ''}

      ${b.specialRequests ? `
      <div style="font-size:12px;font-weight:600;color:${BRAND.muted};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;border-bottom:1px solid #e5e7eb;padding-bottom:6px;">Special requests</div>
      <div style="background:#f9fafb;border-left:4px solid ${BRAND.accent};padding:14px;border-radius:4px;font-size:14px;color:#374151;margin-bottom:20px;white-space:pre-wrap;">${escapeHtml(b.specialRequests)}</div>
      ` : ''}

      <div style="text-align:center;margin-top:8px;">
        <a href="mailto:${b.customerEmail}" style="display:inline-block;background:${BRAND.accent};color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-weight:600;font-size:14px;margin-right:8px;">Reply to customer</a>
        ${b.customerPhone ? `<a href="https://wa.me/${b.customerPhone.replace(/[^0-9]/g, '')}" style="display:inline-block;background:#25d366;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-weight:600;font-size:14px;">WhatsApp</a>` : ''}
      </div>
    </div>
    <div style="background:#f9fafb;padding:14px 24px;text-align:center;font-size:12px;color:${BRAND.muted};">
      ${COMPANY.name} • Received ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Casablanca' })}
    </div>
  </div>
</body></html>
`

export async function sendBookingEmails(booking: BookingEmailInput) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY is not set')

  const ownerEmail = process.env.OWNER_EMAIL
  if (!ownerEmail) throw new Error('OWNER_EMAIL is not set')

  const resend = new Resend(apiKey)

  await Promise.all([
    resend.emails.send({
      from: `${COMPANY.name} <${COMPANY.email}>`,
      replyTo: COMPANY.email,
      to: booking.customerEmail,
      subject: `Booking received — ${shortBookingRef(booking.bookingId)} | ${COMPANY.name}`,
      html: customerTemplate(booking),
    }),
    resend.emails.send({
      from: `${COMPANY.name} Bookings <${COMPANY.email}>`,
      replyTo: booking.customerEmail,
      to: ownerEmail,
      subject: `New booking: ${booking.itemTitle} — ${booking.customerName} (${shortBookingRef(booking.bookingId)})`,
      html: ownerTemplate(booking),
    }),
  ])
}
