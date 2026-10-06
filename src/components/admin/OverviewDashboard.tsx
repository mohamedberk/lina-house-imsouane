'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const CORAL = '#E07A5F'
const OCEAN = '#1B4965'
const AZURE = '#7EC8E3'

type Booking = {
  id: string
  customerName: string
  customerEmail: string
  room?: {
    id: string
    title: string
  } | string | null
  package?: {
    id: string
    title: string
  } | string | null
  bookingType?: string
  roomTitle?: string
  packageTitle?: string
  date: string
  checkIn?: string
  checkOut?: string
  numberOfAdults: number
  numberOfChildren: number
  status: string
  totalPrice: number
  paymentStatus: string
  createdAt: string
}

type Stats = {
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
  completedBookings: number
  totalRevenue: number
  totalRooms: number
  totalPackages: number
}

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#FDECE6', text: CORAL },
  confirmed: { bg: '#E8F4FA', text: OCEAN },
  completed: { bg: '#E8F4FA', text: AZURE },
  cancelled: { bg: '#f5f5f5', text: '#999' },
}

export const OverviewDashboard: React.FC = () => {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    totalRooms: 0,
    totalPackages: 0,
  })
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [bookingsRes, roomsRes, packagesRes] = await Promise.all([
          fetch('/api/bookings?limit=100&depth=1'),
          fetch('/api/rooms?limit=1'),
          fetch('/api/packages?limit=1'),
        ])
        const bookingsData = await bookingsRes.json()
        const roomsData = await roomsRes.json()
        const packagesData = await packagesRes.json()
        const bookings = bookingsData.docs || []

        const pending = bookings.filter((b: Booking) => b.status === 'pending').length
        const confirmed = bookings.filter((b: Booking) => b.status === 'confirmed').length
        const completed = bookings.filter((b: Booking) => b.status === 'completed').length
        const revenue = bookings
          .filter((b: Booking) => b.status !== 'cancelled')
          .reduce((sum: number, b: Booking) => sum + (b.totalPrice || 0), 0)

        setStats({
          totalBookings: bookings.length,
          pendingBookings: pending,
          confirmedBookings: confirmed,
          completedBookings: completed,
          totalRevenue: revenue,
          totalRooms: roomsData.totalDocs || 0,
          totalPackages: packagesData.totalDocs || 0,
        })

        const sorted = [...bookings].sort(
          (a: Booking, b: Booking) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setRecentBookings(sorted.slice(0, 5))
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getBookingLabel = (b: Booking) => {
    if (b.roomTitle) return b.roomTitle
    if (b.packageTitle) return b.packageTitle
    if (typeof b.room === 'object' && b.room?.title) return b.room.title
    if (typeof b.package === 'object' && b.package?.title) return b.package.title
    if (b.bookingType) return b.bookingType
    return 'Booking'
  }

  if (loading) {
    return (
      <div style={{
        padding: '48px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '16px',
        minHeight: '400px',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: `3px solid ${AZURE}`,
          borderTopColor: CORAL,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <p style={{ color: '#666', fontSize: '13px' }}>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="lina-admin-page" style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1a1a1a',
          margin: 0,
        }}>
          Dashboard
        </h1>
        <p style={{
          fontSize: '13px',
          color: '#666',
          margin: '4px 0 0 0',
        }}>
          Overview of your surf camp & hostel
        </p>
      </div>

      {/* Stats Cards - responsive */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        marginBottom: '20px',
      }}>
        {/* Total Bookings */}
        <div style={{
          background: '#fff',
          borderRadius: '10px',
          padding: '16px',
          border: '1px solid #e8e8e8',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '12px',
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: CORAL,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>
            </div>
            <span style={{ fontSize: '12px', color: '#666' }}>Total Bookings</span>
          </div>
          <p style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
            {stats.totalBookings}
          </p>
        </div>

        {/* Revenue */}
        <div style={{
          background: '#fff',
          borderRadius: '10px',
          padding: '16px',
          border: '1px solid #e8e8e8',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '12px',
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: OCEAN,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v12M9 9h6M9 15h6" />
              </svg>
            </div>
            <span style={{ fontSize: '12px', color: '#666' }}>Revenue</span>
          </div>
          <p style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
            {formatCurrency(stats.totalRevenue)}
          </p>
        </div>

        {/* Pending */}
        <div style={{
          background: '#fff',
          borderRadius: '10px',
          padding: '16px',
          border: '1px solid #e8e8e8',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '12px',
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#FDECE6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={CORAL} strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <span style={{ fontSize: '12px', color: '#666' }}>Pending</span>
          </div>
          <p style={{ fontSize: '28px', fontWeight: '700', color: CORAL, margin: 0 }}>
            {stats.pendingBookings}
          </p>
        </div>

        {/* Confirmed */}
        <div style={{
          background: '#fff',
          borderRadius: '10px',
          padding: '16px',
          border: '1px solid #e8e8e8',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '12px',
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#E8F4FA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={OCEAN} strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <span style={{ fontSize: '12px', color: '#666' }}>Confirmed</span>
          </div>
          <p style={{ fontSize: '28px', fontWeight: '700', color: OCEAN, margin: 0 }}>
            {stats.confirmedBookings}
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="lina-dash-cols" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '12px',
      }}>
        {/* Quick Actions */}
        <div style={{
          background: '#fff',
          borderRadius: '10px',
          padding: '16px',
          border: '1px solid #e8e8e8',
        }}>
          <h2 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#1a1a1a',
            margin: '0 0 12px 0',
          }}>
            Quick Actions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              onClick={() => router.push('/admin/collections/bookings/create')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                background: CORAL,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Booking
            </button>
            <button
              onClick={() => router.push('/admin/collections/bookings')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                background: '#E8F4FA',
                color: OCEAN,
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>
              All Bookings
            </button>
            <button
              onClick={() => router.push('/admin/collections/rooms')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                background: '#fafafa',
                color: '#666',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6" />
              </svg>
              Rooms
            </button>
            <button
              onClick={() => router.push('/admin/collections/packages')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                background: '#fafafa',
                color: '#666',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              Packages
            </button>
          </div>
        </div>

        {/* Recent Bookings */}
        <div style={{
          background: '#fff',
          borderRadius: '10px',
          padding: '16px',
          border: '1px solid #e8e8e8',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}>
            <h2 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1a1a1a',
              margin: 0,
            }}>
              Recent Bookings
            </h2>
            <button
              onClick={() => router.push('/admin/collections/bookings')}
              style={{
                padding: '4px 8px',
                background: 'transparent',
                color: CORAL,
                border: 'none',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              View all →
            </button>
          </div>

          {recentBookings.length === 0 ? (
            <div style={{
              padding: '24px',
              textAlign: 'center',
              background: '#fafafa',
              borderRadius: '8px',
              border: `1px dashed ${AZURE}`,
            }}>
              <p style={{ color: '#888', margin: 0, fontSize: '12px' }}>No bookings yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {recentBookings.map((booking) => {
                const statusStyle = statusColors[booking.status] || { bg: '#f5f5f5', text: '#666' }
                const label = getBookingLabel(booking)
                const displayDate = booking.checkIn || booking.date

                return (
                  <div
                    key={booking.id}
                    onClick={() => router.push(`/admin/collections/bookings/${booking.id}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      background: '#fafafa',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      border: '1px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = CORAL
                      e.currentTarget.style.background = '#fff'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'transparent'
                      e.currentTarget.style.background = '#fafafa'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: CORAL,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}>
                        {booking.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          margin: 0,
                          lineHeight: 1.2,
                        }}>
                          {booking.customerName}
                        </p>
                        <p style={{
                          fontSize: '10px',
                          color: '#888',
                          margin: 0,
                          lineHeight: 1.2,
                        }}>
                          {label.length > 18 ? label.slice(0, 18) + '...' : label} • {formatDate(displayDate)}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '3px 6px',
                        background: statusStyle.bg,
                        color: statusStyle.text,
                        borderRadius: '10px',
                        fontSize: '9px',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                      }}>
                        {booking.status}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                      }}>
                        {formatCurrency(booking.totalPrice)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        marginTop: '12px',
      }}>
        {/* Total Rooms */}
        <div style={{
          background: '#fff',
          borderRadius: '10px',
          padding: '14px 16px',
          border: '1px solid #e8e8e8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#E8F4FA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={OCEAN} strokeWidth="2">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6" />
              </svg>
            </div>
            <span style={{ fontSize: '12px', color: '#666' }}>Total Rooms</span>
          </div>
          <span style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>
            {stats.totalRooms}
          </span>
        </div>

        {/* Total Packages */}
        <div style={{
          background: '#fff',
          borderRadius: '10px',
          padding: '14px 16px',
          border: '1px solid #e8e8e8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#FDECE6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={CORAL} strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <span style={{ fontSize: '12px', color: '#666' }}>Total Packages</span>
          </div>
          <span style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>
            {stats.totalPackages}
          </span>
        </div>

        {/* Avg per Booking */}
        <div style={{
          background: '#fff',
          borderRadius: '10px',
          padding: '14px 16px',
          border: '1px solid #e8e8e8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#E8F4FA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={AZURE} strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
            <span style={{ fontSize: '12px', color: '#666' }}>Avg. per Booking</span>
          </div>
          <span style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>
            {stats.totalBookings > 0 ? formatCurrency(stats.totalRevenue / stats.totalBookings) : '€0'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default OverviewDashboard
