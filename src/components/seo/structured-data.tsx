import Script from 'next/script'

interface OrganizationSchemaProps {
  lastUpdated?: string
}

export function OrganizationSchema({ lastUpdated = new Date().toISOString() }: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": "https://linahouse-imsouane.com/#organization",
    "name": "Lina House",
    "alternateName": "Lina House Surf Camp & Hostel",
    "description": "Surf camp & hostel in Imsouane, Morocco. 500m from Magic Bay — the longest wave in Africa. Surf lessons, homemade restaurant, rooftop terrace with ocean views. Rated 9.7/10.",
    "url": "https://linahouse-imsouane.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "N0 Route Amadel, Lotissement Amadel",
      "addressLocality": "Imsouane",
      "addressRegion": "Souss-Massa",
      "addressCountry": "MA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 30.8425,
      "longitude": -9.8325
    },
    "telephone": "+212 772-228120",
    "email": "contact@linahouse.com",
    "priceRange": "€13-€50",
    "currenciesAccepted": "EUR, USD, MAD",
    "paymentAccepted": "Cash, Credit Card",
    "openingHours": "Mo-Su 00:00-23:59",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "9.7",
      "bestRating": "10",
      "worstRating": "1",
      "reviewCount": "256"
    },
    "amenityFeature": [
      { "@type": "LocationFeatureSpecification", "name": "Free WiFi", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Restaurant", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Rooftop Terrace", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Surf Lessons", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Board Rental", "value": true }
    ],
    "dateModified": lastUpdated
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface FAQSchemaProps {
  faqs: Array<{
    question: string
    answer: string
  }>
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface LocalBusinessSchemaProps {
  lastUpdated?: string
}

export function LocalBusinessSchema({ lastUpdated = new Date().toISOString() }: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Hostel",
    "@id": "https://linahouse-imsouane.com/#business",
    "name": "Lina House",
    "description": "Surf camp & hostel in Imsouane, Morocco. 500m from Magic Bay, surf lessons, homemade restaurant, and rooftop terrace with ocean views.",
    "url": "https://linahouse-imsouane.com",
    "telephone": "+212 772-228120",
    "email": "contact@linahouse.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "N0 Route Amadel, Lotissement Amadel",
      "addressLocality": "Imsouane",
      "addressRegion": "Souss-Massa",
      "addressCountry": "Morocco"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 30.8425,
      "longitude": -9.8325
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday",
          "Friday", "Saturday", "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    ],
    "priceRange": "€13-€50",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "9.7",
      "bestRating": "10",
      "reviewCount": "256"
    },
    "dateModified": lastUpdated
  }

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function RestaurantSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": "https://linahouse-imsouane.com/#restaurant",
    "name": "Lina House Restaurant",
    "description": "Homemade Moroccan and international cuisine served on the rooftop terrace overlooking the ocean. Open to guests and visitors.",
    "servesCuisine": ["Moroccan", "Mediterranean", "International"],
    "priceRange": "€",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "N0 Route Amadel, Lotissement Amadel",
      "addressLocality": "Imsouane",
      "addressRegion": "Souss-Massa",
      "addressCountry": "Morocco"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 30.8425,
      "longitude": -9.8325
    },
    "telephone": "+212 772-228120",
    "url": "https://linahouse-imsouane.com/en/restaurant",
    "acceptsReservations": true,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "9.7",
      "bestRating": "10",
      "reviewCount": "256"
    }
  }

  return (
    <Script
      id="restaurant-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function TouristAttractionSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "@id": "https://linahouse-imsouane.com/#magic-bay",
    "name": "Magic Bay (Imsouane)",
    "description": "Magic Bay in Imsouane, Morocco — known for one of the longest right-hand waves in Africa, suitable for beginners through advanced surfers. Lina House is a 500m walk from the break.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Imsouane",
      "addressRegion": "Souss-Massa",
      "addressCountry": "MA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 30.8425,
      "longitude": -9.8325
    },
    "touristType": ["Surfers", "Beach lovers", "Adventure travelers"],
    "isAccessibleForFree": true
  }

  return (
    <Script
      id="tourist-attraction-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function PackagesOfferCatalogSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": "https://linahouse-imsouane.com/#packages",
    "name": "Lina House Surf & Stay Packages",
    "url": "https://linahouse-imsouane.com/en/packages",
    "itemListElement": [
      {
        "@type": "Offer",
        "name": "Surf & Stay Package",
        "description": "Accommodation, daily breakfast, and group surf lessons.",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "url": "https://linahouse-imsouane.com/en/packages"
      },
      {
        "@type": "Offer",
        "name": "Surf Lessons",
        "description": "Group and private surf lessons at Magic Bay with certified local instructors.",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "url": "https://linahouse-imsouane.com/en/surf"
      },
      {
        "@type": "Offer",
        "name": "Yoga & Surf",
        "description": "Combined yoga and surf retreat experience.",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "url": "https://linahouse-imsouane.com/en/packages"
      }
    ]
  }

  return (
    <Script
      id="packages-offer-catalog-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
