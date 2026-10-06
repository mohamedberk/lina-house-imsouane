'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

type Route = { from: string; time: string }

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loc?: any
  routes: Route[]
}

export default function LocationSection({ loc, routes }: Props) {
  return (
    <section id="contact" className="py-20 bg-sand-light">
      <div className="max-w-[1340px] mx-auto px-6 sm:px-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row gap-[60px]"
        >
          {/* Map */}
          <motion.div variants={fadeUp} className="flex-1 rounded-2xl overflow-hidden min-h-[400px]">
            <iframe
              src={loc?.mapEmbedUrl ?? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3033.059454274444!2d-9.820146224932397!3d30.8426278745314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb25fc0d7ce8e69%3A0xcaee8427dd384dab!2sLina%20House%20Imsouane!5e1!3m2!1sfr!2sma!4v1772232140663!5m2!1sfr!2sma"}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 400 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lina House Location"
            />
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={fadeUp} className="flex-1 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl sm:text-[36px] text-[#222222] leading-tight">
                {loc?.title ?? 'Imsouane,'} <span className="font-display italic text-accent">{(loc as any)?.titleAccent ?? 'on Morocco\u2019s Atlantic coast'}</span>
              </h2>
              <p className="text-[#4A4A4A] text-base leading-[1.7]">
                {loc?.description ?? 'Located in the heart of Imsouane, just steps from the legendary surf breaks of Magic Bay and Cathedral.'}
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <a href={`tel:${(loc?.phone ?? '+212 772-228120').replace(/\s/g, '')}`} className="flex items-center gap-4 group">
                <div className="w-11 h-11 rounded-full bg-[#222222]/5 flex items-center justify-center group-hover:bg-[#222222]/10 transition-colors">
                  <Phone className="w-5 h-5 text-[#222222]" />
                </div>
                <div>
                  <p className="text-[#717171] text-xs font-medium">Phone / WhatsApp</p>
                  <p className="text-[#222222] font-semibold text-[15px]">{loc?.phone ?? '+212 772-228120'}</p>
                </div>
              </a>

              <a href={`mailto:${loc?.email ?? 'contact@linahouse.com'}`} className="flex items-center gap-4 group">
                <div className="w-11 h-11 rounded-full bg-[#222222]/5 flex items-center justify-center group-hover:bg-[#222222]/10 transition-colors">
                  <Mail className="w-5 h-5 text-[#222222]" />
                </div>
                <div>
                  <p className="text-[#717171] text-xs font-medium">Email</p>
                  <p className="text-[#222222] font-semibold text-[15px]">{loc?.email ?? 'contact@linahouse.com'}</p>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-[#222222]/5 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#222222]" />
                </div>
                <div>
                  <p className="text-[#717171] text-xs font-medium">Address</p>
                  <p className="text-[#222222] font-semibold text-[15px]">{loc?.address ?? 'N0 Route Amadel, Imsouane, Morocco'}</p>
                </div>
              </div>
            </div>

            {/* Getting Here */}
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-xl text-[#222222]">Getting Here</h3>
              <div className="flex flex-col gap-3">
                {routes.map((route, idx) => (
                  <div key={route.from}>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-[#4A4A4A] text-sm">{route.from}</span>
                      <span className="text-[#222222] text-sm font-semibold">{route.time}</span>
                    </div>
                    {idx < routes.length - 1 && <div className="h-px bg-sand-dark mt-3" />}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
