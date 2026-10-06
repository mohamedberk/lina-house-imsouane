'use client'

import { motion } from 'framer-motion'
import type { ComponentType, SVGProps } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

type StripItem = {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  value: string
  label: string
}

type Props = {
  featureStripItems: StripItem[]
}

export default function WhySection({ featureStripItems }: Props) {
  return (
    <section className="py-10 bg-primary-dark">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-around items-center gap-8"
        >
          {featureStripItems.map((item) => {
            const Icon = item.icon
            return (
              <motion.div key={item.value} variants={fadeUp} className="flex flex-col items-center gap-2 w-[140px]">
                <Icon className="w-7 h-7 text-azure-light" />
                <span className="font-bold text-[22px] text-white">{item.value}</span>
                <span className="text-white/[0.53] text-xs">{item.label}</span>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
