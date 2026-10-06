'use client'

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Instagram, Globe, Send, User, MessageSquare, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { Footer } from '@/components/footer'

// ─── Animation Helpers ───────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
}

// CMS content types
interface ContactPageContent {
  header: {
    badge: string
    title: string
  }
  contactInfoCard: {
    title: string
    whatsappLabel: string
    whatsappNumber: string
    whatsappLink: string
    phoneNumber?: string
    emailLabel: string
    email: string
    locationLabel: string
    location: string
  }
  stayConnectedCard: {
    title: string
    whatsappText: string
    instagramText: string
    instagramUrl: string
    tiktokText: string
    tiktokUrl: string
  }
  openingHoursCard: {
    title: string
    mondayFridayLabel: string
    mondayFridayHours: string
    saturdayLabel: string
    saturdayHours: string
    sundayLabel: string
    sundayHours: string
  }
  mapSection: {
    badge: string
    title: string
    description: string
    mapEmbedUrl: string
    mapLocationName: string
    mapLocationCity: string
    getDirectionsText: string
    googleMapsUrl: string
  }
  formSection: {
    badge: string
    title: string
    description: string
    nameLabel: string
    namePlaceholder: string
    emailLabel: string
    emailPlaceholder: string
    phoneLabel: string
    phonePlaceholder: string
    subjectLabel: string
    subjectPlaceholder: string
    messageLabel: string
    messagePlaceholder: string
    submitButtonText: string
    submittingText: string
    clearFormText: string
    successMessage: string
    errorMessage: string
    quickContactText: string
    emailUsText: string
  }
  floatingWhatsapp: {
    message: string
  }
}

interface ContactClientProps {
  pageContent: ContactPageContent
}

export default function ContactClient({ pageContent }: ContactClientProps) {
  const cms = pageContent

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setFormData(prev => ({ ...prev, phone: value }))
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send message')
      }

      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setSubmitStatus('success')
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }, [formData])

  // Parse location for line breaks
  const locationLines = cms.contactInfoCard.location.split('\n')

  return (
    <main className="bg-sand-light overflow-x-hidden min-h-screen">
      {/* Header */}
      {(cms.header.badge || cms.header.title) && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="max-w-[1280px] mx-auto px-6 sm:px-20 py-8"
        >
          <div className="text-center mb-1">
            {cms.header.badge && (
              <p className="text-accent text-sm font-medium mb-2">
                {cms.header.badge}
              </p>
            )}

            {cms.header.title && (
              <h1 className="text-2xl sm:text-[32px] text-[#222222] mb-2">
                {cms.header.title}
              </h1>
            )}
          </div>
        </motion.div>
      )}

      {/* Contact Cards Section */}
      <section className="py-0 pb-3 lg:pb-4">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
          >

            {/* Contact Information Card */}
            {(cms.contactInfoCard.title || cms.contactInfoCard.whatsappNumber || cms.contactInfoCard.email || cms.contactInfoCard.location) && (
              <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-[#EBEBEB] p-4 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#222222]/5 mb-2.5">
                  <Phone className="w-4 h-4 text-accent" />
                </div>

                {cms.contactInfoCard.title && (
                  <h3 className="text-base text-[#222222] mb-2.5">{cms.contactInfoCard.title}</h3>
                )}

                <div className="space-y-2.5">
                  {(cms.contactInfoCard.whatsappNumber || cms.contactInfoCard.phoneNumber) && (
                    <div className="flex items-start gap-2.5">
                      <Phone className="w-4 h-4 text-[#717171] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-[#8A8A8A] mb-0.5">{cms.contactInfoCard.whatsappLabel || 'Phone'}</p>
                        {cms.contactInfoCard.whatsappNumber && (
                          <a
                            href={`https://wa.me/${cms.contactInfoCard.whatsappLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-[#222222] hover:text-accent transition-colors font-medium"
                          >
                            {cms.contactInfoCard.whatsappNumber}
                          </a>
                        )}
                        {cms.contactInfoCard.phoneNumber && (
                          <a
                            href={`tel:${cms.contactInfoCard.phoneNumber.replace(/[\s-]/g, '')}`}
                            className="block text-sm text-[#222222] hover:text-accent transition-colors font-medium"
                          >
                            {cms.contactInfoCard.phoneNumber}
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {cms.contactInfoCard.email && (
                    <div className="flex items-start gap-2.5">
                      <Mail className="w-4 h-4 text-[#717171] mt-0.5 flex-shrink-0" />
                      <div>
                        {cms.contactInfoCard.emailLabel && (
                          <p className="text-xs text-[#8A8A8A] mb-0.5">{cms.contactInfoCard.emailLabel}</p>
                        )}
                        <a
                          href={`mailto:${cms.contactInfoCard.email}`}
                          className="text-sm text-[#222222] hover:text-accent transition-colors font-medium break-all"
                        >
                          {cms.contactInfoCard.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {cms.contactInfoCard.location && (
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#717171] mt-0.5 flex-shrink-0" />
                      <div>
                        {cms.contactInfoCard.locationLabel && (
                          <p className="text-xs text-[#8A8A8A] mb-0.5">{cms.contactInfoCard.locationLabel}</p>
                        )}
                        <p className="text-sm text-[#222222] font-medium">
                          {locationLines.map((line, i) => (
                            <span key={i}>
                              {line}
                              {i < locationLines.length - 1 && <br />}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Stay Connected Card */}
            {(cms.stayConnectedCard.title || cms.stayConnectedCard.whatsappText || cms.stayConnectedCard.instagramText) && (
              <motion.div variants={fadeUp} className="bg-primary-dark rounded-2xl p-4 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 mb-2.5">
                  <Globe className="w-4 h-4 text-azure-light" />
                </div>

                {cms.stayConnectedCard.title && (
                  <h3 className="text-base text-white mb-2.5">{cms.stayConnectedCard.title}</h3>
                )}

                <div className="space-y-2.5">
                  {(cms.stayConnectedCard.whatsappText && cms.contactInfoCard.whatsappLink) && (
                    <a
                      href={`https://wa.me/${cms.contactInfoCard.whatsappLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center group-hover:bg-white/20 group-hover:border-white/20 transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium text-sm">{cms.stayConnectedCard.whatsappText}</span>
                    </a>
                  )}

                  {(cms.stayConnectedCard.instagramText && cms.stayConnectedCard.instagramUrl) && (
                    <a
                      href={cms.stayConnectedCard.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center group-hover:bg-white/20 group-hover:border-white/20 transition-colors">
                        <Instagram className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium text-sm">{cms.stayConnectedCard.instagramText}</span>
                    </a>
                  )}

                  {(cms.stayConnectedCard.tiktokText && cms.stayConnectedCard.tiktokUrl) && (
                    <a
                      href={cms.stayConnectedCard.tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center group-hover:bg-white/20 group-hover:border-white/20 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                      </div>
                      <span className="font-medium text-sm">{cms.stayConnectedCard.tiktokText}</span>
                    </a>
                  )}
                </div>
              </motion.div>
            )}

            {/* Opening Times Card */}
            {(cms.openingHoursCard.title || cms.openingHoursCard.mondayFridayHours || cms.openingHoursCard.saturdayHours || cms.openingHoursCard.sundayHours) && (
              <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-[#EBEBEB] p-4 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#222222]/5 mb-2.5">
                  <Clock className="w-4 h-4 text-accent" />
                </div>

                {cms.openingHoursCard.title && (
                  <h3 className="text-base text-[#222222] mb-2.5">{cms.openingHoursCard.title}</h3>
                )}

                <div className="space-y-2">
                  {(cms.openingHoursCard.mondayFridayLabel || cms.openingHoursCard.mondayFridayHours) && (
                    <div className="flex justify-between items-center py-1.5 border-b border-sand-dark">
                      {cms.openingHoursCard.mondayFridayLabel && (
                        <span className="text-[#717171] font-medium text-sm">{cms.openingHoursCard.mondayFridayLabel}</span>
                      )}
                      {cms.openingHoursCard.mondayFridayHours && (
                        <span className="text-[#222222] font-semibold text-sm">{cms.openingHoursCard.mondayFridayHours}</span>
                      )}
                    </div>
                  )}

                  {(cms.openingHoursCard.saturdayLabel || cms.openingHoursCard.saturdayHours) && (
                    <div className="flex justify-between items-center py-1.5 border-b border-sand-dark">
                      {cms.openingHoursCard.saturdayLabel && (
                        <span className="text-[#717171] font-medium text-sm">{cms.openingHoursCard.saturdayLabel}</span>
                      )}
                      {cms.openingHoursCard.saturdayHours && (
                        <span className="text-[#222222] font-semibold text-sm">{cms.openingHoursCard.saturdayHours}</span>
                      )}
                    </div>
                  )}

                  {(cms.openingHoursCard.sundayLabel || cms.openingHoursCard.sundayHours) && (
                    <div className="flex justify-between items-center py-1.5">
                      {cms.openingHoursCard.sundayLabel && (
                        <span className="text-[#717171] font-medium text-sm">{cms.openingHoursCard.sundayLabel}</span>
                      )}
                      {cms.openingHoursCard.sundayHours && (
                        <span className="text-[#222222] font-semibold text-sm">{cms.openingHoursCard.sundayHours}</span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Map & Form Section - Two Columns */}
      <section className="py-12 sm:py-16">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >

            {/* Left Column - Map */}
            <div className="flex flex-col">
              {(cms.mapSection.badge || cms.mapSection.title || cms.mapSection.description) && (
                <div className="text-center lg:text-left mb-4">
                  {cms.mapSection.badge && (
                    <p className="text-accent font-medium mb-2 text-sm">
                      {cms.mapSection.badge}
                    </p>
                  )}

                  {cms.mapSection.title && (
                    <h2 className="text-xl lg:text-2xl xl:text-3xl text-[#222222] mb-2">
                      {cms.mapSection.title}
                    </h2>
                  )}

                  {cms.mapSection.description && (
                    <p className="text-sm text-[#717171]">
                      {cms.mapSection.description}
                    </p>
                  )}
                </div>
              )}

              {/* Map Container */}
              {cms.mapSection.mapEmbedUrl && (
                <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden flex-1 flex flex-col">
                  <div className="relative w-full flex-1 min-h-[300px]">
                    <iframe
                      src={cms.mapSection.mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Lina House Location - Imsouane"
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>

                  {/* Map Info Overlay */}
                  {(cms.mapSection.mapLocationName || cms.mapSection.mapLocationCity || cms.mapSection.getDirectionsText) && (
                    <div className="bg-primary-dark p-3 lg:p-4">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        {(cms.mapSection.mapLocationName || cms.mapSection.mapLocationCity) && (
                          <div className="flex items-center gap-2.5 text-white">
                            <MapPin className="w-5 h-5 text-white" />
                            <div>
                              {cms.mapSection.mapLocationName && (
                                <p className="font-semibold text-sm">{cms.mapSection.mapLocationName}</p>
                              )}
                              {cms.mapSection.mapLocationCity && (
                                <p className="text-xs text-white/80">{cms.mapSection.mapLocationCity}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {(cms.mapSection.getDirectionsText && cms.mapSection.googleMapsUrl) && (
                          <a
                            href={cms.mapSection.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-sand-light text-[#222222] rounded-[10px] font-semibold transition-colors text-sm"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{cms.mapSection.getDirectionsText}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Form */}
            <div className="flex flex-col">
              {(cms.formSection.badge || cms.formSection.title || cms.formSection.description) && (
                <div className="text-center lg:text-left mb-4">
                  {cms.formSection.badge && (
                    <p className="text-accent font-medium mb-2 text-sm">
                      {cms.formSection.badge}
                    </p>
                  )}

                  {cms.formSection.title && (
                    <h2 className="text-xl lg:text-2xl xl:text-3xl text-[#222222] mb-2">
                      {cms.formSection.title}
                    </h2>
                  )}

                  {cms.formSection.description && (
                    <p className="text-sm text-[#717171]">
                      {cms.formSection.description}
                    </p>
                  )}
                </div>
              )}

              {/* Form Card */}
              <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4 sm:p-5 flex-1 flex flex-col">
                <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name Input */}
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="block text-sm font-semibold text-[#222222]">
                        {cms.formSection.nameLabel} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-[#8A8A8A]" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="block w-full pl-9 pr-3 py-2.5 text-sm border border-[#DDDDDD] rounded-xl focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-white text-[#222222] placeholder-[#8A8A8A]"
                          placeholder={cms.formSection.namePlaceholder}
                        />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="block text-sm font-semibold text-[#222222]">
                        {cms.formSection.emailLabel} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-[#8A8A8A]" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="block w-full pl-9 pr-3 py-2.5 text-sm border border-[#DDDDDD] rounded-xl focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-white text-[#222222] placeholder-[#8A8A8A]"
                          placeholder={cms.formSection.emailPlaceholder}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone and Subject Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone Input */}
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="block text-sm font-semibold text-[#222222]">
                        {cms.formSection.phoneLabel}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-[#8A8A8A]" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          className="block w-full pl-9 pr-3 py-2.5 text-sm border border-[#DDDDDD] rounded-xl focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-white text-[#222222] placeholder-[#8A8A8A]"
                          placeholder={cms.formSection.phonePlaceholder}
                        />
                      </div>
                    </div>

                    {/* Subject Input */}
                    <div className="space-y-1.5">
                      <label htmlFor="subject" className="block text-sm font-semibold text-[#222222]">
                        {cms.formSection.subjectLabel} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MessageSquare className="h-4 w-4 text-[#8A8A8A]" />
                        </div>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="block w-full pl-9 pr-3 py-2.5 text-sm border border-[#DDDDDD] rounded-xl focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-white text-[#222222] placeholder-[#8A8A8A]"
                          placeholder={cms.formSection.subjectPlaceholder}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Message Textarea */}
                  <div className="space-y-1.5 flex-1 flex flex-col">
                    <label htmlFor="message" className="block text-sm font-semibold text-[#222222]">
                      {cms.formSection.messageLabel} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex-1">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="block w-full h-full min-h-[120px] px-3 py-2.5 text-sm border border-[#DDDDDD] rounded-xl focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-white text-[#222222] placeholder-[#8A8A8A] resize-none"
                        placeholder={cms.formSection.messagePlaceholder}
                      />
                    </div>
                  </div>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="p-3 rounded-lg bg-[#E8F5E9] border border-[#C8E6C9]">
                      <p className="text-[#2E7D32] text-sm font-medium">
                        {cms.formSection.successMessage}
                      </p>
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                      <p className="text-red-700 text-sm font-medium">
                        {cms.formSection.errorMessage}
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-accent hover:bg-accent-dark text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>{cms.formSection.submittingText}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{cms.formSection.submitButtonText}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ name: '', email: '', phone: '', subject: '', message: '' })}
                      className="sm:w-auto px-5 py-3 border border-[#DDDDDD] text-[#4A4A4A] hover:bg-[#F7F7F7] rounded-xl font-semibold transition-colors text-sm"
                    >
                      {cms.formSection.clearFormText}
                    </button>
                  </div>

                  {/* Quick Contact Options */}
                  {(cms.formSection.quickContactText || cms.stayConnectedCard.whatsappText || cms.formSection.emailUsText) && (
                    <div className="pt-4 border-t border-sand-dark">
                      {cms.formSection.quickContactText && (
                        <p className="text-xs text-[#8A8A8A] text-center mb-3">{cms.formSection.quickContactText}</p>
                      )}
                      <div className="flex flex-wrap justify-center gap-3">
                        {(cms.stayConnectedCard.whatsappText && cms.contactInfoCard.whatsappLink) && (
                          <a
                            href={`https://wa.me/${cms.contactInfoCard.whatsappLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 bg-sand-light hover:bg-sand-light border border-[#EBEBEB] text-[#222222] rounded-lg font-medium transition-colors text-xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-accent" />
                            <span>{cms.stayConnectedCard.whatsappText}</span>
                          </a>
                        )}
                        {(cms.formSection.emailUsText && cms.contactInfoCard.email) && (
                          <a
                            href={`mailto:${cms.contactInfoCard.email}`}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-sand-light hover:bg-sand-light border border-[#EBEBEB] text-[#222222] rounded-lg font-medium transition-colors text-xs"
                          >
                            <Mail className="w-3.5 h-3.5 text-accent" />
                            <span>{cms.formSection.emailUsText}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      <Footer />

      {/* ===== FLOATING WHATSAPP BUTTON ===== */}
      {cms.contactInfoCard.whatsappLink && (
        <a
          href={`https://wa.me/${cms.contactInfoCard.whatsappLink}${cms.floatingWhatsapp.message ? `?text=${encodeURIComponent(cms.floatingWhatsapp.message)}` : ''}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          aria-label="Chat on WhatsApp"
        >
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </a>
      )}
    </main>
  )
}
