import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const revalidate = 3600

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'en'

    const payload = await getPayload({ config })

    // Fetch site settings
    const siteSettings = await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
      locale: locale as 'en' | 'fr',
    })

    return NextResponse.json({
      // Header settings
      header: {
        navLinks: siteSettings.headerNavLinks || [],
        ctaText: siteSettings.headerCtaText || 'Book Now',
        ctaLink: siteSettings.headerCtaLink || '#rooms',
        whatsappNumber: siteSettings.headerWhatsappNumber || '212772228120',
        whatsappText: siteSettings.headerWhatsappText || 'WhatsApp Us',
      },
      // Footer settings
      footer: {
        brandDescription: siteSettings.footerBrandDescription || 'Surf camp & hostel in Imsouane, Morocco. 500m from the beach, rated 9.7/10 on Hostelworld.',
        copyrightText: siteSettings.footerCopyrightText || 'Lina House. All rights reserved.',
        phone: siteSettings.footerPhone || '+212 772-228120',
        email: siteSettings.footerEmail || 'contact@linahouse.com',
        whatsappNumber: siteSettings.footerWhatsappNumber || '212772228120',
        location: siteSettings.footerLocation || 'Imsouane, Morocco',
        instagramUrl: siteSettings.footerInstagramUrl || '',
        tiktokUrl: siteSettings.footerTiktokUrl || '',
        experiencesLinks: siteSettings.footerExperiencesLinks || [],
        aboutLinks: siteSettings.footerAboutLinks || [],
      },
      hasExperiences: false,
    })
  } catch (error) {
    console.error('Error fetching site settings:', error)
    // Return defaults on error
    return NextResponse.json({
      header: {
        navLinks: [
          { label: 'Rooms', href: '#rooms' },
          { label: 'Surf', href: '#surf' },
          { label: 'Packages', href: '#packages' },
          { label: 'Restaurant', href: '#restaurant' },
          { label: 'Contact', href: '#contact' },
        ],
        ctaText: 'Book Now',
        ctaLink: '#rooms',
        whatsappNumber: '212772228120',
        whatsappText: 'WhatsApp Us',
      },
      footer: {
        brandDescription: 'Surf camp & hostel in Imsouane, Morocco. 500m from the beach, rated 9.7/10 on Hostelworld.',
        copyrightText: 'Lina House. All rights reserved.',
        phone: '+212 772-228120',
        email: 'contact@linahouse.com',
        whatsappNumber: '212772228120',
        location: 'Imsouane, Morocco',
        instagramUrl: '',
        tiktokUrl: '',
        experiencesLinks: [
          { label: 'Rooms', href: '#rooms' },
          { label: 'Surf & Activities', href: '#surf' },
          { label: 'Packages', href: '#packages' },
          { label: 'Restaurant', href: '#restaurant' },
        ],
        aboutLinks: [
          { label: 'Contact', href: '#contact' },
          { label: 'Privacy Policy', href: '/privacy-policy' },
          { label: 'Terms of Use', href: '/terms-of-use' },
        ],
      },
      hasExperiences: false,
    })
  }
}
