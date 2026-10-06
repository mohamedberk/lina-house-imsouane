import { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import ContactClient from './contact-client'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const locale = lang as 'en' | 'fr'

  let cmsSeo
  try {
    const payload = await getPayload({ config })
    const data = await payload.findGlobal({ slug: 'contact-page', locale, depth: 1 })
    cmsSeo = (data as { seo?: typeof cmsSeo })?.seo
  } catch {}

  const isFr = locale === 'fr'
  return buildPageMetadata({
    cms: cmsSeo,
    fallbackTitle: 'Contact | Lina House - Surf Camp Imsouane',
    fallbackDescription: isFr
      ? 'Contactez Lina House pour réserver votre séjour à Imsouane, Maroc. WhatsApp, email ou formulaire de contact disponibles.'
      : 'Contact Lina House to book your stay in Imsouane, Morocco. WhatsApp, email, or contact form available.',
    path: '/contact',
    lang: locale,
  })
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as 'en' | 'fr'

  let data: any = null
  try {
    const payload = await getPayload({ config })
    data = await payload.findGlobal({
      slug: 'contact-page',
      locale,
      depth: 2,
    })
  } catch {
    // CMS data unavailable — fallbacks below will be used
  }

  const headerSection = data?.headerSection ?? {}
  const contactInfoCard = data?.contactInfoCard ?? {}
  const stayConnectedCard = data?.stayConnectedCard ?? {}
  const openingHoursCard = data?.openingHoursCard ?? {}
  const mapSection = data?.mapSection ?? {}
  const formSection = data?.formSection ?? {}
  const floatingWhatsapp = data?.floatingWhatsapp ?? {}

  const pageContent = {
    header: {
      badge: headerSection.badge ?? 'Get in Touch',
      title: headerSection.title ?? 'Contact Lina House',
    },
    contactInfoCard: {
      title: contactInfoCard.title ?? 'Contact Information',
      whatsappLabel: contactInfoCard.whatsappLabel ?? 'WhatsApp',
      whatsappNumber: contactInfoCard.whatsappNumber ?? '+212 772-228120',
      whatsappLink: contactInfoCard.whatsappLink ?? '212772228120',
      // TODO: add `phoneNumber` field to ContactPage global
      phoneNumber: contactInfoCard.phoneNumber ?? '+212 670-724689',
      emailLabel: contactInfoCard.emailLabel ?? 'Email',
      email: contactInfoCard.email ?? 'contact@linahouse-imsouane.com',
      locationLabel: contactInfoCard.locationLabel ?? 'Address',
      location: contactInfoCard.location ?? 'N0 Route Amadel\nImsouane, Lotissement Amadel\nMorocco',
    },
    stayConnectedCard: {
      title: stayConnectedCard.title ?? 'Stay Connected',
      whatsappText: stayConnectedCard.whatsappText ?? 'Chat on WhatsApp',
      instagramText: stayConnectedCard.instagramText ?? 'Follow on Instagram',
      instagramUrl: stayConnectedCard.instagramUrl ?? 'https://www.instagram.com/linahouserestaurant?utm_source=qr&igsh=YndheDV2em10emFy',
      tiktokText: stayConnectedCard.tiktokText ?? 'Follow on TikTok',
      tiktokUrl: stayConnectedCard.tiktokUrl ?? 'https://www.tiktok.com/@linahouse',
    },
    openingHoursCard: {
      title: openingHoursCard.title ?? 'Reception Hours',
      mondayFridayLabel: openingHoursCard.mondayFridayLabel ?? 'Check-in',
      mondayFridayHours: openingHoursCard.mondayFridayHours ?? '14:00 - 23:00',
      saturdayLabel: openingHoursCard.saturdayLabel ?? 'Check-out',
      saturdayHours: openingHoursCard.saturdayHours ?? 'Before 12:00',
      sundayLabel: openingHoursCard.sundayLabel ?? 'Reception',
      sundayHours: openingHoursCard.sundayHours ?? '24/7',
    },
    mapSection: {
      badge: mapSection.badge ?? 'Our Location',
      title: mapSection.title ?? 'Find Us in Imsouane',
      description: mapSection.description ?? 'Located in the heart of Imsouane, just 500m from Magic Bay — home to the longest wave in Africa.',
      mapEmbedUrl: mapSection.mapEmbedUrl ?? 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3033.059454274444!2d-9.820146224932397!3d30.8426278745314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb25fc0d7ce8e69%3A0xcaee8427dd384dab!2sLina%20House%20Imsouane!5e1!3m2!1sfr!2sma!4v1772232140663!5m2!1sfr!2sma',
      mapLocationName: mapSection.mapLocationName ?? 'Lina House',
      mapLocationCity: mapSection.mapLocationCity ?? 'Imsouane, Morocco',
      getDirectionsText: mapSection.getDirectionsText ?? 'Get Directions',
      googleMapsUrl: mapSection.googleMapsUrl ?? 'https://maps.google.com/?q=Lina+House+Imsouane',
    },
    formSection: {
      badge: formSection.badge ?? 'Send a Message',
      title: formSection.title ?? 'We\'d Love to Hear from You',
      description: formSection.description ?? 'Whether you have a question about rooms, surf lessons, packages, or anything else — we\'re here to help.',
      nameLabel: formSection.nameLabel ?? 'Full Name',
      namePlaceholder: formSection.namePlaceholder ?? 'Your name',
      emailLabel: formSection.emailLabel ?? 'Email',
      emailPlaceholder: formSection.emailPlaceholder ?? 'your@email.com',
      phoneLabel: formSection.phoneLabel ?? 'Phone (optional)',
      phonePlaceholder: formSection.phonePlaceholder ?? 'Your phone number',
      subjectLabel: formSection.subjectLabel ?? 'Subject',
      subjectPlaceholder: formSection.subjectPlaceholder ?? 'What is this about?',
      messageLabel: formSection.messageLabel ?? 'Message',
      messagePlaceholder: formSection.messagePlaceholder ?? 'Tell us about your plans — dates, number of guests, interests...',
      submitButtonText: formSection.submitButtonText ?? 'Send Message',
      submittingText: formSection.submittingText ?? 'Sending...',
      clearFormText: formSection.clearFormText ?? 'Clear',
      successMessage: formSection.successMessage ?? 'Message sent! We\'ll get back to you within 24 hours.',
      errorMessage: formSection.errorMessage ?? 'Something went wrong. Please try WhatsApp or email us directly.',
      quickContactText: formSection.quickContactText ?? 'Prefer a quicker response?',
      emailUsText: formSection.emailUsText ?? 'Email Us',
    },
    floatingWhatsapp: {
      message: floatingWhatsapp.message ?? 'Hi! I\'m interested in staying at Lina House in Imsouane.',
    },
  }

  return <ContactClient pageContent={pageContent} />
}
