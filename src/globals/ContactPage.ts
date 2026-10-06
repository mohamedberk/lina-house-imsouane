import { GlobalConfig } from 'payload'
import { revalidateTag, revalidatePath } from 'next/cache'
import { seoFields } from '../fields/seo'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Contact Page',
  admin: {
    description: 'Edit the Contact page content - header, contact info, opening hours, form labels, and map section.',
    group: 'Pages',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async () => {
        revalidateTag('contact-page')
        revalidatePath('/', 'layout')
      },
    ],
  },
  fields: [
    // ===== ADMIN: AUTO-TRANSLATE BUTTON =====
    {
      name: 'translateActions',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/admin/TranslateButton',
        },
      },
    },
    // ===== SEO =====
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      admin: {
        description: 'Search engine and social share metadata for this page',
      },
      fields: seoFields({
        metaTitle: 'Contact | Lina House Imsouane',
        metaDescription: 'Contact Lina House — surf camp & hostel in Imsouane, Morocco. WhatsApp, phone, email, and booking enquiries welcome.',
        keywords: 'contact Lina House, Imsouane hostel contact, Morocco surf camp contact',
      }),
    },
    // ===== HEADER SECTION =====
    {
      name: 'headerSection',
      type: 'group',
      label: 'Header Section',
      admin: {
        description: 'The header at the top of the contact page',
      },
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Badge Text',
          defaultValue: 'Contact Us',
          localized: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Page Title',
          defaultValue: 'Get In Touch',
          localized: true,
          admin: {
            description: 'Use HTML styling like <span> for colored words',
          },
        },
      ],
    },

    // ===== CONTACT INFORMATION CARD =====
    {
      name: 'contactInfoCard',
      type: 'group',
      label: 'Contact Information Card',
      admin: {
        description: 'The contact details card',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Card Title',
          defaultValue: 'Contact Information',
          localized: true,
        },
        {
          name: 'whatsappLabel',
          type: 'text',
          label: 'WhatsApp Label',
          defaultValue: 'WhatsApp:',
          localized: true,
        },
        {
          name: 'whatsappNumber',
          type: 'text',
          label: 'WhatsApp Number',
          defaultValue: '+212 772-228120',
          localized: true,
        },
        {
          name: 'whatsappLink',
          type: 'text',
          label: 'WhatsApp Link Number',
          defaultValue: '212772228120',
          localized: true,
          admin: {
            description: 'Number without + for wa.me link',
          },
        },
        {
          name: 'emailLabel',
          type: 'text',
          label: 'Email Label',
          defaultValue: 'Email:',
          localized: true,
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
          defaultValue: 'contact@linahouse.com',
        },
        {
          name: 'locationLabel',
          type: 'text',
          label: 'Location Label',
          defaultValue: 'Location:',
          localized: true,
        },
        {
          name: 'location',
          type: 'textarea',
          label: 'Location Address',
          defaultValue: 'N0 Route Amadel, Imsouane\nLotissement Amadel, Morocco',
          localized: true,
        },
      ],
    },

    // ===== STAY CONNECTED CARD =====
    {
      name: 'stayConnectedCard',
      type: 'group',
      label: 'Stay Connected Card',
      admin: {
        description: 'Social media links card',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Card Title',
          defaultValue: 'Stay Connected',
          localized: true,
        },
        {
          name: 'whatsappText',
          type: 'text',
          label: 'WhatsApp Link Text',
          defaultValue: 'WhatsApp',
          localized: true,
        },
        {
          name: 'instagramText',
          type: 'text',
          label: 'Instagram Link Text',
          defaultValue: 'Instagram',
          localized: true,
        },
        {
          name: 'instagramUrl',
          type: 'text',
          label: 'Instagram URL',
          defaultValue: 'https://www.instagram.com/linahouserestaurant?utm_source=qr&igsh=YndheDV2em10emFy',
          localized: true,
        },
        {
          name: 'tiktokText',
          type: 'text',
          label: 'TikTok Link Text',
          defaultValue: 'TikTok',
          localized: true,
        },
        {
          name: 'tiktokUrl',
          type: 'text',
          label: 'TikTok URL',
          defaultValue: 'https://www.tiktok.com/@traveler_spin',
          localized: true,
        },
      ],
    },

    // ===== OPENING HOURS CARD =====
    {
      name: 'openingHoursCard',
      type: 'group',
      label: 'Opening Hours Card',
      admin: {
        description: 'Business hours card',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Card Title',
          defaultValue: 'Opening Hours',
          localized: true,
        },
        {
          name: 'mondayFridayLabel',
          type: 'text',
          label: 'Monday-Friday Label',
          defaultValue: 'Monday - Friday:',
          localized: true,
        },
        {
          name: 'mondayFridayHours',
          type: 'text',
          label: 'Monday-Friday Hours',
          defaultValue: '6:00 AM - 8:00 PM',
          localized: true,
        },
        {
          name: 'saturdayLabel',
          type: 'text',
          label: 'Saturday Label',
          defaultValue: 'Saturday:',
          localized: true,
        },
        {
          name: 'saturdayHours',
          type: 'text',
          label: 'Saturday Hours',
          defaultValue: '6:00 AM - 8:00 PM',
          localized: true,
        },
        {
          name: 'sundayLabel',
          type: 'text',
          label: 'Sunday Label',
          defaultValue: 'Sunday:',
          localized: true,
        },
        {
          name: 'sundayHours',
          type: 'text',
          label: 'Sunday Hours',
          defaultValue: '6:00 AM - 6:00 PM',
          localized: true,
        },
      ],
    },

    // ===== MAP SECTION =====
    {
      name: 'mapSection',
      type: 'group',
      label: 'Map Section',
      admin: {
        description: 'Location map section',
      },
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Badge Text',
          defaultValue: 'Our Location',
          localized: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          defaultValue: 'Find Us in Imsouane',
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          defaultValue: 'Lina House is right in the heart of Imsouane — a 7-minute walk from Magic Bay, the longest right-hand wave in Africa.',
          localized: true,
        },
        {
          name: 'mapEmbedUrl',
          type: 'textarea',
          label: 'Google Maps Embed URL',
          defaultValue: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217179.6046791475!2d-8.13385!3d31.6347485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafee8d96179e51%3A0x5950b6534f87adb8!2sMarrakech%2C%20Morocco!5e0!3m2!1sen!2sus!4v1702656000000!5m2!1sen!2sus',
          localized: true,
        },
        {
          name: 'mapLocationName',
          type: 'text',
          label: 'Map Location Name',
          defaultValue: 'Lina House — Imsouane',
          localized: true,
        },
        {
          name: 'mapLocationCity',
          type: 'text',
          label: 'Map Location City',
          defaultValue: 'Imsouane, Morocco',
          localized: true,
        },
        {
          name: 'getDirectionsText',
          type: 'text',
          label: 'Get Directions Button Text',
          defaultValue: 'Get Directions',
          localized: true,
        },
        {
          name: 'googleMapsUrl',
          type: 'text',
          label: 'Google Maps Link',
          defaultValue: 'https://www.google.com/maps?q=Lina+House+Imsouane',
          localized: true,
        },
      ],
    },

    // ===== CONTACT FORM SECTION =====
    {
      name: 'formSection',
      type: 'group',
      label: 'Contact Form Section',
      admin: {
        description: 'Form labels and messages',
      },
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Badge Text',
          defaultValue: 'Send Message',
          localized: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          defaultValue: 'Have a Question?',
          localized: true,
        },
        {
          name: 'description',
          type: 'text',
          label: 'Description',
          defaultValue: "Fill out the form below and we'll get back to you as soon as possible.",
          localized: true,
        },
        {
          name: 'nameLabel',
          type: 'text',
          label: 'Name Field Label',
          defaultValue: 'Full Name',
          localized: true,
        },
        {
          name: 'namePlaceholder',
          type: 'text',
          label: 'Name Placeholder',
          defaultValue: 'Enter your name',
          localized: true,
        },
        {
          name: 'emailLabel',
          type: 'text',
          label: 'Email Field Label',
          defaultValue: 'Email Address',
          localized: true,
        },
        {
          name: 'emailPlaceholder',
          type: 'text',
          label: 'Email Placeholder',
          defaultValue: 'your.email@example.com',
          localized: true,
        },
        {
          name: 'phoneLabel',
          type: 'text',
          label: 'Phone Field Label',
          defaultValue: 'Phone Number',
          localized: true,
        },
        {
          name: 'phonePlaceholder',
          type: 'text',
          label: 'Phone Placeholder',
          defaultValue: '+1 XXX XXX XXXX',
          localized: true,
        },
        {
          name: 'subjectLabel',
          type: 'text',
          label: 'Subject Field Label',
          defaultValue: 'Subject',
          localized: true,
        },
        {
          name: 'subjectPlaceholder',
          type: 'text',
          label: 'Subject Placeholder',
          defaultValue: "What's this about?",
          localized: true,
        },
        {
          name: 'messageLabel',
          type: 'text',
          label: 'Message Field Label',
          defaultValue: 'Message',
          localized: true,
        },
        {
          name: 'messagePlaceholder',
          type: 'text',
          label: 'Message Placeholder',
          defaultValue: 'Tell us your dates, room preference, or any questions about surf, food or transfers...',
          localized: true,
        },
        {
          name: 'submitButtonText',
          type: 'text',
          label: 'Submit Button Text',
          defaultValue: 'Send Message',
          localized: true,
        },
        {
          name: 'submittingText',
          type: 'text',
          label: 'Submitting Text',
          defaultValue: 'Sending...',
          localized: true,
        },
        {
          name: 'clearFormText',
          type: 'text',
          label: 'Clear Form Button Text',
          defaultValue: 'Clear Form',
          localized: true,
        },
        {
          name: 'successMessage',
          type: 'text',
          label: 'Success Message',
          defaultValue: "Message sent successfully! We'll get back to you soon.",
          localized: true,
        },
        {
          name: 'errorMessage',
          type: 'text',
          label: 'Error Message',
          defaultValue: 'Something went wrong. Please try again.',
          localized: true,
        },
        {
          name: 'quickContactText',
          type: 'text',
          label: 'Quick Contact Text',
          defaultValue: 'Or reach us directly:',
          localized: true,
        },
        {
          name: 'emailUsText',
          type: 'text',
          label: 'Email Us Button Text',
          defaultValue: 'Email Us',
          localized: true,
        },
      ],
    },

    // ===== FLOATING WHATSAPP =====
    {
      name: 'floatingWhatsapp',
      type: 'group',
      label: 'Floating WhatsApp Button',
      admin: {
        description: 'The floating WhatsApp button settings',
      },
      fields: [
        {
          name: 'message',
          type: 'text',
          label: 'Default Message',
          defaultValue: 'Hi! I’d like to book a stay at Lina House in Imsouane.',
          localized: true,
        },
      ],
    },
  ],
}
