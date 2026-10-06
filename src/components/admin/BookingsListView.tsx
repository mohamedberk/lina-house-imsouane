'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// Brand colors only
const ORANGE = '#FF5A00'
const BLUE = '#86ceeb'

type Booking = {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  flight?: {
    id: string
    title: string
    type: string
    price: number
    childPrice: number
  } | string | null
  flightTitle: string
  flightType: string
  date: string
  numberOfAdults: number
  numberOfChildren: number
  status: string
  totalPrice: number
  paymentStatus: string
  pickupLocation?: string
  createdAt: string
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled'] as const

type PaginatedResponse = {
  docs: Booking[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

// Using only orange and blue
const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#FFF4E8', text: ORANGE },
  confirmed: { bg: '#E8F6FC', text: '#5BA3C0' },
  completed: { bg: '#E8F6FC', text: BLUE },
  cancelled: { bg: '#f5f5f5', text: '#999' },
}

const paymentColors: Record<string, { bg: string; text: string }> = {
  unpaid: { bg: '#FFF4E8', text: ORANGE },
  partial: { bg: '#FFF4E8', text: ORANGE },
  paid: { bg: '#E8F6FC', text: '#5BA3C0' },
  refunded: { bg: '#f5f5f5', text: '#999' },
}

const typeLabels: Record<string, string> = {
  shared: 'Shared Flight',
  quad: 'Balloon + Quad',
  safari: 'Safari Package',
  ground: 'Ground Experience',
  experience: 'Other Experience',
}

export const BookingsListView: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [data, setData] = useState<PaginatedResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; booking: Booking | null }>({ open: false, booking: null })
  const [deleteAllModal, setDeleteAllModal] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [deleteAllLoading, setDeleteAllLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '12', 10)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true)
      try {
        let url = `/api/bookings?page=${currentPage}&limit=${limit}&depth=1&sort=-createdAt`
        if (filter !== 'all') {
          url += `&where[status][equals]=${filter}`
        }
        const response = await fetch(url)
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Failed to fetch bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [currentPage, limit, filter])

  const formatDate = (dateString: string) => {
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

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const then = new Date(dateString)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    return formatDate(dateString)
  }

  const handleClick = (id: string) => {
    router.push(`/admin/collections/bookings/${id}`)
  }

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    setActionLoading(bookingId)
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        // Update local state
        setData((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            docs: prev.docs.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)),
          }
        })
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setActionLoading(null)
      setOpenDropdown(null)
    }
  }

  const handleDelete = async (booking: Booking) => {
    setActionLoading(booking.id)
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        // Remove from local state
        setData((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            docs: prev.docs.filter((b) => b.id !== booking.id),
            totalDocs: prev.totalDocs - 1,
          }
        })
      }
    } catch (error) {
      console.error('Failed to delete booking:', error)
    } finally {
      setActionLoading(null)
      setDeleteModal({ open: false, booking: null })
    }
  }

  const handleDeleteAll = async () => {
    if (!data || data.docs.length === 0) return
    setDeleteAllLoading(true)
    try {
      // Delete all bookings one by one
      const deletePromises = data.docs.map((booking) =>
        fetch(`/api/bookings/${booking.id}`, { method: 'DELETE' })
      )
      await Promise.all(deletePromises)
      // Refresh the data
      setData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          docs: [],
          totalDocs: 0,
        }
      })
    } catch (error) {
      console.error('Failed to delete all bookings:', error)
    } finally {
      setDeleteAllLoading(false)
      setDeleteAllModal(false)
    }
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
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: `3px solid ${BLUE}`,
          borderTopColor: ORANGE,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <p style={{ color: '#666', fontSize: '13px' }}>Loading bookings...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <p style={{ color: ORANGE }}>Failed to load bookings</p>
      </div>
    )
  }

  const { docs: bookings } = data

  return (
    <div className="lina-admin-page" style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1a1a1a',
            margin: 0,
          }}>
            Bookings
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#666',
            margin: '2px 0 0 0',
          }}>
            {data.totalDocs} total
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => router.push('/admin/collections/bookings/create')}
            style={{
              padding: '10px 20px',
              background: ORANGE,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            + New Booking
          </button>
          {data.totalDocs > 0 && (
            <button
              onClick={() => setDeleteAllModal(true)}
              style={{
                padding: '10px 20px',
                background: '#fff',
                color: '#ef4444',
                border: '1px solid #ef4444',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ef4444'
                e.currentTarget.style.color = '#fff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff'
                e.currentTarget.style.color = '#ef4444'
              }}
            >
              Remove All Bookings
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '6px',
        marginBottom: '20px',
        flexWrap: 'wrap',
      }}>
        {[
          { value: 'all', label: 'All' },
          { value: 'pending', label: 'Pending' },
          { value: 'confirmed', label: 'Confirmed' },
          { value: 'completed', label: 'Completed' },
          { value: 'cancelled', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            style={{
              padding: '8px 16px',
              background: filter === tab.value ? ORANGE : '#fff',
              color: filter === tab.value ? '#fff' : '#666',
              border: `1px solid ${filter === tab.value ? ORANGE : '#e0e0e0'}`,
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Booking Cards - 3 columns */}
      {bookings.length === 0 ? (
        <div style={{
          padding: '48px',
          textAlign: 'center',
          background: '#fafafa',
          borderRadius: '12px',
          border: `2px dashed ${BLUE}`,
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.5" style={{ margin: '0 auto 12px' }}>
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          </svg>
          <h3 style={{ color: '#333', margin: '0 0 4px 0', fontSize: '15px' }}>No bookings found</h3>
          <p style={{ color: '#888', margin: 0, fontSize: '13px' }}>
            {filter !== 'all' ? `No ${filter} bookings.` : 'Create your first booking'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '12px',
        }}>
          {bookings.map((booking) => {
            const statusStyle = statusColors[booking.status] || { bg: '#f5f5f5', text: '#666' }
            const paymentStyle = paymentColors[booking.paymentStatus] || { bg: '#f5f5f5', text: '#666' }
            const flightTitle = booking.flightTitle || (typeof booking.flight === 'object' && booking.flight?.title) || 'Unknown Flight'
            const flightType = booking.flightType || (typeof booking.flight === 'object' && booking.flight?.type) || 'unknown'
            const isDropdownOpen = openDropdown === booking.id
            const isLoading = actionLoading === booking.id

            return (
              <div
                key={booking.id}
                style={{
                  background: '#fff',
                  borderRadius: '10px',
                  border: '1px solid #e8e8e8',
                  overflow: 'hidden',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = `0 4px 12px rgba(243, 152, 77, 0.15)`
                  e.currentTarget.style.borderColor = ORANGE
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = '#e8e8e8'
                }}
              >
                {/* Loading Overlay */}
                {isLoading && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(255,255,255,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      border: `2px solid ${BLUE}`,
                      borderTopColor: ORANGE,
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }} />
                  </div>
                )}

                {/* Card Header */}
                <div style={{
                  padding: '12px 14px',
                  borderBottom: '1px solid #f0f0f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1 }}
                    onClick={() => handleClick(booking.id)}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: ORANGE,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '13px',
                    }}>
                      {booking.customerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: 0,
                        lineHeight: 1.2,
                      }}>
                        {booking.customerName}
                      </p>
                      <p style={{
                        fontSize: '11px',
                        color: '#888',
                        margin: 0,
                        lineHeight: 1.2,
                      }}>
                        {booking.customerEmail.length > 20
                          ? booking.customerEmail.slice(0, 20) + '...'
                          : booking.customerEmail}
                      </p>
                    </div>
                  </div>
                  {/* Status Dropdown */}
                  <div style={{ position: 'relative' }} ref={isDropdownOpen ? dropdownRef : null}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenDropdown(isDropdownOpen ? null : booking.id)
                      }}
                      style={{
                        padding: '4px 10px',
                        background: statusStyle.bg,
                        color: statusStyle.text,
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {booking.status}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {isDropdownOpen && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '4px',
                        background: '#fff',
                        border: '1px solid #e8e8e8',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        zIndex: 20,
                        minWidth: '120px',
                        overflow: 'hidden',
                      }}>
                        {STATUS_OPTIONS.map((status) => {
                          const style = statusColors[status]
                          return (
                            <button
                              key={status}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStatusChange(booking.id, status)
                              }}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                background: booking.status === status ? style.bg : '#fff',
                                border: 'none',
                                borderBottom: '1px solid #f0f0f0',
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontSize: '11px',
                                fontWeight: booking.status === status ? '600' : '400',
                                color: style.text,
                                textTransform: 'capitalize',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                              }}
                            >
                              <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: style.text,
                              }} />
                              {status}
                              {booking.status === status && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={style.text} strokeWidth="3" style={{ marginLeft: 'auto' }}>
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div
                  style={{ padding: '12px 14px', cursor: 'pointer' }}
                  onClick={() => handleClick(booking.id)}
                >
                  {/* Flight Info */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '10px',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#1a1a1a',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {flightTitle}
                      </p>
                      <p style={{
                        fontSize: '10px',
                        color: BLUE,
                        margin: 0,
                      }}>
                        {typeLabels[flightType] || flightType}
                      </p>
                    </div>
                  </div>

                  {/* Details Row */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    color: '#666',
                    marginBottom: '8px',
                  }}>
                    <span>{formatDate(booking.date)}</span>
                    <span>{booking.numberOfAdults}A{booking.numberOfChildren > 0 ? ` ${booking.numberOfChildren}C` : ''}</span>
                    <span>{getTimeAgo(booking.createdAt)}</span>
                  </div>

                  {/* Pickup Location */}
                  {booking.pickupLocation && (
                    <div style={{
                      fontSize: '10px',
                      color: '#888',
                      padding: '6px 8px',
                      background: '#f8f8f8',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      📍 {booking.pickupLocation}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div style={{
                  padding: '10px 14px',
                  background: '#fafafa',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      padding: '3px 8px',
                      background: paymentStyle.bg,
                      color: paymentStyle.text,
                      borderRadius: '10px',
                      fontSize: '10px',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                    }}>
                      {booking.paymentStatus}
                    </span>
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteModal({ open: true, booking })
                      }}
                      style={{
                        padding: '4px 8px',
                        background: '#fff',
                        border: '1px solid #e8e8e8',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '10px',
                        color: '#888',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fee2e2'
                        e.currentTarget.style.borderColor = '#ef4444'
                        e.currentTarget.style.color = '#ef4444'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff'
                        e.currentTarget.style.borderColor = '#e8e8e8'
                        e.currentTarget.style.color = '#888'
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      Remove
                    </button>
                  </div>
                  <span style={{
                    fontSize: '14px',
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

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginTop: '24px',
        }}>
          <button
            disabled={!data.hasPrevPage}
            onClick={() => router.push(`/admin/collections/bookings?page=${data.prevPage}&limit=${limit}`)}
            style={{
              padding: '8px 14px',
              background: data.hasPrevPage ? '#fff' : '#f5f5f5',
              border: `1px solid ${data.hasPrevPage ? BLUE : '#e0e0e0'}`,
              borderRadius: '6px',
              cursor: data.hasPrevPage ? 'pointer' : 'not-allowed',
              color: data.hasPrevPage ? BLUE : '#ccc',
              fontSize: '12px',
              fontWeight: '500',
            }}
          >
            ← Prev
          </button>

          <span style={{
            padding: '8px 12px',
            fontSize: '12px',
            color: '#666',
          }}>
            {data.page} / {data.totalPages}
          </span>

          <button
            disabled={!data.hasNextPage}
            onClick={() => router.push(`/admin/collections/bookings?page=${data.nextPage}&limit=${limit}`)}
            style={{
              padding: '8px 14px',
              background: data.hasNextPage ? '#fff' : '#f5f5f5',
              border: `1px solid ${data.hasNextPage ? BLUE : '#e0e0e0'}`,
              borderRadius: '6px',
              cursor: data.hasNextPage ? 'pointer' : 'not-allowed',
              color: data.hasNextPage ? BLUE : '#ccc',
              fontSize: '12px',
              fontWeight: '500',
            }}
          >
            Next →
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && deleteModal.booking && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={() => setDeleteModal({ open: false, booking: null })}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>
                Delete Booking?
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: 1.5 }}>
                Are you sure you want to delete the booking for <strong>{deleteModal.booking.customerName}</strong>?
                This action cannot be undone.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setDeleteModal({ open: false, booking: null })}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f5f5f5',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#666',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal.booking!)}
                disabled={actionLoading === deleteModal.booking.id}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#ef4444',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#fff',
                  cursor: 'pointer',
                  opacity: actionLoading === deleteModal.booking.id ? 0.7 : 1,
                }}
              >
                {actionLoading === deleteModal.booking.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Confirmation Modal */}
      {deleteAllModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={() => setDeleteAllModal(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>
                Delete All Bookings?
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: 1.5 }}>
                Are you sure you want to delete <strong>all {data?.totalDocs} bookings</strong>?
                This action cannot be undone.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setDeleteAllModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f5f5f5',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#666',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={deleteAllLoading}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#ef4444',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#fff',
                  cursor: 'pointer',
                  opacity: deleteAllLoading ? 0.7 : 1,
                }}
              >
                {deleteAllLoading ? 'Deleting...' : 'Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingsListView
