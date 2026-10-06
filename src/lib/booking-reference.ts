export function shortBookingRef(id: string | number): string {
  const clean = String(id).replace(/-/g, '').toUpperCase()
  return `LH-${clean.slice(0, 8)}`
}
