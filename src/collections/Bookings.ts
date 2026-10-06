import type { CollectionConfig } from 'payload'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'customerName',
    defaultColumns: ['customerName', 'flightTitle', 'date', 'status', 'totalPrice', 'paymentStatus', 'promoCode', 'affiliateCode'],
    group: 'Orders',
    components: {
      views: {
        list: {
          Component: '/components/admin/BookingsListView',
        },
      },
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    // Customer Information
    {
      name: 'customerName',
      type: 'text',
      required: true,
      label: 'Customer Name',
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
      label: 'Email Address',
    },
    {
      name: 'customerPhone',
      type: 'text',
      required: true,
      label: 'Phone Number',
    },
    // Booking Details
    {
      name: 'package',
      type: 'relationship',
      relationTo: 'packages',
      required: false,
      label: 'Package (DB)',
      admin: {
        description: 'Link to package in database (if exists)',
      },
    },
    {
      name: 'flightTitle',
      type: 'text',
      required: true,
      label: 'Booking Name',
      admin: {
        description: 'Name of the booked package or activity',
      },
    },
    {
      name: 'flightType',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Package', value: 'package' },
        { label: 'Stay & Eat', value: 'stay-eat' },
        { label: 'Full Surf Pack', value: 'full-surf' },
        { label: 'Surf Only', value: 'surf-only' },
        { label: 'Room Only', value: 'room' },
        { label: 'Surf Lesson', value: 'surf-lesson' },
        { label: 'Equipment Rental', value: 'rental' },
        { label: 'Other', value: 'other' },
      ],
      label: 'Booking Type',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      index: true,
      label: 'Booking Date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'numberOfAdults',
          type: 'number',
          required: true,
          min: 1,
          defaultValue: 1,
          label: 'Adults',
        },
        {
          name: 'numberOfChildren',
          type: 'number',
          required: true,
          min: 0,
          defaultValue: 0,
          label: 'Children (4-11)',
        },
      ],
    },
    // Status & Payment
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      index: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'totalPrice',
      type: 'number',
      required: true,
      min: 0,
      label: 'Total Price (EUR)',
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'unpaid',
      index: true,
      options: [
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Partial', value: 'partial' },
        { label: 'Paid', value: 'paid' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    // Additional Info
    {
      name: 'pickupLocation',
      type: 'text',
      label: 'Hotel / Pickup Location',
    },
    {
      name: 'pickupLocationKnown',
      type: 'checkbox',
      label: 'Pickup Location Known',
      defaultValue: true,
      admin: {
        description: 'Whether customer provided pickup location at booking time',
      },
    },
    {
      name: 'bookingSummary',
      type: 'textarea',
      label: 'Booking Details',
      admin: {
        description: 'Auto-generated breakdown of what the customer booked (rooms, activities, transfer…). Editable — update if the customer requests changes after booking.',
        rows: 8,
      },
    },
    {
      name: 'specialRequests',
      type: 'textarea',
      label: 'Special Requests / Notes',
      admin: {
        description: 'Customer-provided notes (allergies, arrival time, etc.)',
      },
    },
  ],
  timestamps: true,
}
