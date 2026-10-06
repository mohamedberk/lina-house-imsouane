'use client'

import React from 'react'

export const Icon: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/lina_house_logoo-removebg-preview.png"
        alt="Lina House"
        style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
      />
    </div>
  )
}

export default Icon
