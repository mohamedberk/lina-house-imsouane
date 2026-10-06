'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Waves, Shield, Check, ChevronDown, Loader2, Star } from 'lucide-react'
import { DatePopover } from '../booking/steps/DatePopover'
import { useCurrency } from '@/components/currency-switcher'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

type Props = {
  lang: 'en' | 'fr'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rentalsSection?: any
}

type Equipment = 'board' | 'wetsuit' | 'both'

const inputClass =
  'w-full h-[52px] px-4 text-sm rounded-xl border border-[#DDDDDD] bg-white text-[#222222] placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#1B4965] focus:ring-1 focus:ring-[#1B4965] transition-all'

const t = (lang: 'en' | 'fr') => ({
  sectionTitle: lang === 'fr' ? 'Location, ' : 'Rentals, ',
  sectionTitleAccent: lang === 'fr' ? 'glissez dès aujourd’hui' : 'paddle out today',
  sectionDesc:
    lang === 'fr'
      ? 'Planches et combinaisons de qualité, disponibles sur place — réservez à la journée.'
      : 'Quality boards and wetsuits, ready on-site — book by the day.',
  cardTitle: lang === 'fr' ? 'Location Planche + Combinaison' : 'Surfboard + Wetsuit Rental',
  cardCopy:
    lang === 'fr'
      ? 'Matériel soigné, changé chaque saison. Idéal pour tous niveaux et toutes les vagues d’Imsouane.'
      : 'Freshly maintained gear, swapped every season. Perfect for every level and every Imsouane wave.',
  feat1: lang === 'fr' ? 'Planches tous niveaux (softtop & fiber)' : 'Boards for every level (softtop & fiber)',
  feat2: lang === 'fr' ? 'Combinaisons 3/2 & 4/3 toutes tailles' : 'Wetsuits 3/2 & 4/3 — all sizes',
  feat3: lang === 'fr' ? 'Leash, wax & conseils inclus' : 'Leash, wax & local tips included',
  fromPrice: lang === 'fr' ? 'À partir de 6€ / jour' : 'From 6€ / day',
  bookNow: lang === 'fr' ? 'Réserver' : 'Book Now',
  equipment: lang === 'fr' ? 'Équipement' : 'Equipment',
  boardOnly: lang === 'fr' ? 'Planche' : 'Board',
  wetsuitOnly: lang === 'fr' ? 'Combinaison' : 'Wetsuit',
  both: lang === 'fr' ? 'Les deux' : 'Both',
  startDate: lang === 'fr' ? 'Date de début' : 'Start date',
  endDate: lang === 'fr' ? 'Date de fin' : 'End date',
  quantity: lang === 'fr' ? 'Personnes' : 'People',
  fullName: lang === 'fr' ? 'Nom complet' : 'Full name',
  email: lang === 'fr' ? 'Email' : 'Email',
  phone: lang === 'fr' ? 'Téléphone' : 'Phone',
  days: lang === 'fr' ? 'jours' : 'days',
  day: lang === 'fr' ? 'jour' : 'day',
  perPerson: lang === 'fr' ? 'par personne / jour' : 'per person / day',
  soloNote: lang === 'fr' ? 'Solo : 7€ / jour' : 'Solo: 7€ / day',
  groupNote: lang === 'fr' ? 'Groupe (2+) : 6€ / jour par pers.' : 'Group (2+): 6€ / day per person',
  submit: lang === 'fr' ? 'Confirmer la réservation' : 'Confirm booking',
  submitting: lang === 'fr' ? 'Envoi…' : 'Sending…',
  successTitle: lang === 'fr' ? 'Merci !' : 'Thanks!',
  success: lang === 'fr' ? 'Merci — nous confirmerons par email.' : "Thanks — we'll confirm by email.",
  errorGeneric:
    lang === 'fr' ? 'Une erreur est survenue. Veuillez réessayer.' : 'Something went wrong. Please try again.',
  errorDateOrder: lang === 'fr' ? 'La date de fin doit être après la date de début.' : 'End date must be after start date.',
  perDay: lang === 'fr' ? '/ jour' : '/ day',
})

const FEATURE_ICON_MAP = { waves: Waves, shield: Shield, check: Check, star: Star } as const

export default function RentalsSection({ lang, rentalsSection }: Props) {
  const { formatPrice } = useCurrency()
  const fallback = t(lang)
  const cms = rentalsSection ?? {}
  const form = cms.form ?? {}
  const tr = {
    sectionTitle: cms.title || fallback.sectionTitle,
    sectionTitleAccent: cms.titleAccent || fallback.sectionTitleAccent,
    sectionDesc: cms.description || fallback.sectionDesc,
    cardTitle: cms.cardTitle || fallback.cardTitle,
    cardCopy: cms.cardDescription || fallback.cardCopy,
    fromPrice: cms.fromPriceBadge || fallback.fromPrice,
    bookNow: cms.bookNowText || fallback.bookNow,
    soloNote: cms.soloNote || fallback.soloNote,
    groupNote: cms.groupNote || fallback.groupNote,
    perDay: cms.perDayLabel || fallback.perDay,
    equipment: form.equipment || fallback.equipment,
    boardOnly: form.boardOnly || fallback.boardOnly,
    wetsuitOnly: form.wetsuitOnly || fallback.wetsuitOnly,
    both: form.both || fallback.both,
    startDate: form.startDate || fallback.startDate,
    endDate: form.endDate || fallback.endDate,
    quantity: form.quantity || fallback.quantity,
    fullName: form.fullName || fallback.fullName,
    email: form.email || fallback.email,
    phone: form.phone || fallback.phone,
    days: form.days || fallback.days,
    day: form.day || fallback.day,
    perPerson: form.perPerson || fallback.perPerson,
    submit: form.submit || fallback.submit,
    submitting: form.submitting || fallback.submitting,
    successTitle: form.successTitle || fallback.successTitle,
    success: form.successMessage || fallback.success,
    errorGeneric: form.errorGeneric || fallback.errorGeneric,
    errorDateOrder: form.errorDateOrder || fallback.errorDateOrder,
  }

  const soloPrice = rentalsSection?.soloPricePerDay ?? 7
  const groupPrice = rentalsSection?.groupPricePerDay ?? 6
  const displayPrice = rentalsSection?.displayPrice ?? 6

  const cmsFeatures: { label: string; icon?: keyof typeof FEATURE_ICON_MAP }[] =
    Array.isArray(rentalsSection?.features) && rentalsSection.features.length > 0
      ? rentalsSection.features
      : [
          { label: fallback.feat1, icon: 'waves' },
          { label: fallback.feat2, icon: 'shield' },
          { label: fallback.feat3, icon: 'check' },
        ]

  const [open, setOpen] = useState(false)

  // form state
  const [equipment, setEquipment] = useState<Equipment>('both')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [openCal, setOpenCal] = useState<'start' | 'end' | null>(null)
  const [qty, setQty] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { days, unitPrice, total, dateOrderOk } = useMemo(() => {
    if (!startDate || !endDate) return { days: 0, unitPrice: 0, total: 0, dateOrderOk: true }
    const s = new Date(startDate).getTime()
    const e = new Date(endDate).getTime()
    if (Number.isNaN(s) || Number.isNaN(e)) return { days: 0, unitPrice: 0, total: 0, dateOrderOk: true }
    if (e < s) return { days: 0, unitPrice: 0, total: 0, dateOrderOk: false }
    const d = Math.max(1, Math.ceil((e - s) / 86_400_000) + 1)
    const up = qty === 1 ? soloPrice : groupPrice
    return { days: d, unitPrice: up, total: d * qty * up, dateOrderOk: true }
  }, [startDate, endDate, qty, soloPrice, groupPrice])

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const phoneValid = phone.trim().length >= 6
  const nameValid = name.trim().length >= 2
  const formValid =
    nameValid &&
    emailValid &&
    phoneValid &&
    !!startDate &&
    !!endDate &&
    dateOrderOk &&
    qty >= 1 &&
    qty <= 8 &&
    days >= 1 &&
    !submitting

  const resetForm = () => {
    setEquipment('both')
    setStartDate('')
    setEndDate('')
    setQty(1)
    setName('')
    setEmail('')
    setPhone('')
    setError(null)
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formValid) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/rentals-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name.trim(),
          customerEmail: email.trim(),
          customerPhone: phone.trim(),
          equipment,
          startDate,
          endDate,
          qty,
        }),
      })
      const data = await res.json().catch(() => ({ ok: false, error: 'Invalid response' }))
      if (!res.ok || !data?.ok) {
        setError(typeof data?.error === 'string' ? data.error : tr.errorGeneric)
        setSubmitting(false)
        return
      }
      setSuccess(true)
    } catch {
      setError(tr.errorGeneric)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="rentals" className="py-20 bg-sand-light">
      <div className="max-w-[1340px] mx-auto px-6 sm:px-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="flex flex-col items-center gap-12"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center flex flex-col items-center gap-3">
            <h2 className="text-2xl sm:text-[42px] text-[#222222] leading-tight">
              {tr.sectionTitle}
              <span className="font-display italic text-accent">{tr.sectionTitleAccent}</span>
            </h2>
            <p className="text-[#717171] text-[15px] max-w-[650px]">{tr.sectionDesc}</p>
          </motion.div>

          {/* Info card */}
          <motion.div variants={fadeUp} className="w-full">
            <div className="relative rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row">
              {/* Left: icon panel */}
              <div className="relative md:w-[280px] shrink-0 bg-gradient-to-br from-[#1B4965] to-[#3A8FB7] p-8 flex flex-col items-center justify-center gap-5 text-white">
                <span className="absolute top-4 left-4 bg-accent text-white text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md">
                  {tr.fromPrice}
                </span>
                <div className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                  <Waves className="w-10 h-10 text-white" />
                </div>
                <div className="text-center space-y-1">
                  <div className="text-[13px] text-white/90">{tr.soloNote}</div>
                  <div className="text-[13px] text-white/90">{tr.groupNote}</div>
                </div>
              </div>

              {/* Right: info content */}
              <div className="p-6 sm:p-8 flex flex-col gap-4 flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-[#222222]">{tr.cardTitle}</h3>
                <p className="text-[#4A4A4A] text-sm leading-[1.6]">{tr.cardCopy}</p>

                <div className="flex flex-col">
                  {cmsFeatures.map((f, i, arr) => {
                    const Icon = FEATURE_ICON_MAP[f.icon || 'waves'] || Waves
                    return (
                      <div key={`${f.label}-${i}`}>
                        <div className="flex items-center gap-3 py-2">
                          <Icon className="w-4.5 h-4.5 text-[#1B4965] flex-shrink-0" />
                          <span className="text-[#4A4A4A] text-sm">{f.label}</span>
                        </div>
                        {i < arr.length - 1 && <div className="h-px bg-[#EBEBEB]" />}
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div>
                    <span className="text-lg font-bold text-[#222222]">{formatPrice(displayPrice)}</span>
                    <span className="text-[#717171] text-sm ml-1">{tr.perDay}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (open) {
                        setOpen(false)
                      } else {
                        resetForm()
                        setOpen(true)
                      }
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-dark text-white text-sm font-semibold rounded-lg transition-all"
                    aria-expanded={open}
                  >
                    {tr.bookNow}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Booking dropdown */}
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="rentals-form"
                  initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
                  animate={{
                    height: 'auto',
                    opacity: 1,
                    transitionEnd: { overflow: 'visible' },
                  }}
                  exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <div className="mt-4 rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)] p-6 sm:p-8">
                    {success ? (
                      <div className="flex items-center gap-3 rounded-xl bg-accent/10 border border-accent/20 p-4">
                        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <div className="font-semibold text-[#222222]">{tr.successTitle}</div>
                          <div className="text-sm text-[#4A4A4A]">{tr.success}</div>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Equipment pills */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-medium text-[#717171] mr-1">{tr.equipment}:</span>
                          {([
                            { v: 'board', label: tr.boardOnly },
                            { v: 'wetsuit', label: tr.wetsuitOnly },
                            { v: 'both', label: tr.both },
                          ] as { v: Equipment; label: string }[]).map((opt) => {
                            const active = equipment === opt.v
                            return (
                              <button
                                key={opt.v}
                                type="button"
                                onClick={() => setEquipment(opt.v)}
                                className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition-all ${
                                  active
                                    ? 'bg-[#1B4965] text-white border-[#1B4965]'
                                    : 'bg-white text-[#4A4A4A] border-[#E5E5E5] hover:border-[#1B4965]'
                                }`}
                              >
                                {opt.label}
                              </button>
                            )
                          })}
                        </div>

                        {/* Dates + Qty */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <DatePopover
                            label={tr.startDate}
                            value={startDate}
                            open={openCal === 'start'}
                            onOpenChange={(o) => setOpenCal(o ? 'start' : null)}
                            onChange={(v) => {
                              setStartDate(v)
                              if (endDate && new Date(endDate) < new Date(v)) setEndDate('')
                            }}
                          />
                          <DatePopover
                            label={tr.endDate}
                            value={endDate}
                            minDate={startDate ? new Date(startDate) : undefined}
                            open={openCal === 'end'}
                            onOpenChange={(o) => setOpenCal(o ? 'end' : null)}
                            onChange={(v) => setEndDate(v)}
                          />
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-[#717171]">{tr.quantity}</label>
                            <input
                              type="number"
                              min={1}
                              max={8}
                              value={qty}
                              onChange={(e) => {
                                const n = parseInt(e.target.value || '1', 10)
                                if (Number.isNaN(n)) return setQty(1)
                                setQty(Math.min(8, Math.max(1, n)))
                              }}
                              className={inputClass}
                            />
                          </div>
                        </div>

                        {!dateOrderOk && (
                          <div className="text-xs text-red-600">{tr.errorDateOrder}</div>
                        )}

                        {/* Contact */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-[#717171]">{tr.fullName}</label>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                              className={inputClass}
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-[#717171]">{tr.email}</label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              className={inputClass}
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-[#717171]">{tr.phone}</label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              required
                              className={inputClass}
                            />
                          </div>
                        </div>

                        {error && (
                          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            {error}
                          </div>
                        )}

                        {/* Total + Submit */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between pt-3 border-t border-[#EBEBEB]">
                          <div className="flex flex-col">
                            <span className="text-xs text-[#717171]">
                              {days > 0
                                ? `${days} ${days === 1 ? tr.day : tr.days} × ${qty} × ${formatPrice(unitPrice)}`
                                : tr.perPerson}
                            </span>
                            <span className="text-2xl font-bold text-[#1B4965]">{formatPrice(total)}</span>
                          </div>
                          <button
                            type="submit"
                            disabled={!formValid}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent-dark disabled:bg-[#CFCFCF] disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all text-[15px] whitespace-nowrap"
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {tr.submitting}
                              </>
                            ) : (
                              tr.submit
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
