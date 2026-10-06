export type TransferRoute = {
  id: string
  label: string
  priceEur: number
}

export type TransferContent = {
  cardTitle: string
  cardDescription: string
  routes: TransferRoute[]
}

export const FALLBACK_TRANSFERS_EN: TransferContent = {
  cardTitle: 'Taxi & Airport Transfer',
  cardDescription:
    'We arrange comfortable transfers on all routes. Just let us know your arrival details.',
  routes: [
    { id: 'imsouane-taghazout', label: 'Imsouane ↔ Taghazout', priceEur: 25 },
    { id: 'imsouane-agadir', label: 'Imsouane ↔ Agadir', priceEur: 35 },
    { id: 'airport-imsouane', label: 'Airport ↔ Imsouane', priceEur: 45 },
    { id: 'airport-essaouira', label: 'Airport ↔ Essaouira', priceEur: 30 },
  ],
}

export const FALLBACK_TRANSFERS_FR: TransferContent = {
  cardTitle: 'Taxi & Transfert Aéroport',
  cardDescription:
    'Nous organisons des transferts confortables sur tous les trajets. Indiquez-nous vos détails d’arrivée.',
  routes: [
    { id: 'imsouane-taghazout', label: 'Imsouane ↔ Taghazout', priceEur: 25 },
    { id: 'imsouane-agadir', label: 'Imsouane ↔ Agadir', priceEur: 35 },
    { id: 'airport-imsouane', label: 'Aéroport ↔ Imsouane', priceEur: 45 },
    { id: 'airport-essaouira', label: 'Aéroport ↔ Essaouira', priceEur: 30 },
  ],
}

export function getTransferRoute(
  id: string | null | undefined,
  routes: TransferRoute[],
): TransferRoute | undefined {
  if (!id) return undefined
  return routes.find((r) => r.id === id)
}
