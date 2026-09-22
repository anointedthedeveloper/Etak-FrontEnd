import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  images?: { url: string; alt: string }[]  // extra images for ImageObject schema
  url?: string
  type?: 'website' | 'article'
  noIndex?: boolean
  schema?: object  // page-specific JSON-LD to merge/replace
}

const SITE_NAME = 'Etak Travels & Tours Expert Limited'
const BASE_URL  = 'https://etaktravels.com'
const DEFAULT_IMG = `${BASE_URL}/brand/logo.png`

const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  '@id': `${BASE_URL}/#organization`,
  name: SITE_NAME,
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/brand/logo.png`,
    width: 512,
    height: 512,
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Block C2, 2014, ACCI Ultra Modern Shopping Centre, Airport Road, Piwoyi',
    addressLocality: 'Abuja',
    addressRegion: 'FCT',
    addressCountry: 'NG',
  },
  telephone: '+234-803-206-2242',
  email: 'etaktravels15@gmail.com',
  foundingDate: '2010',
  contactPoint: [
    { '@type': 'ContactPoint', telephone: '+234-803-206-2242', contactType: 'customer service', availableLanguage: 'English', hoursAvailable: 'Mo-Su 00:00-23:59' },
    { '@type': 'ContactPoint', telephone: '+234-817-358-8783', contactType: 'customer service', availableLanguage: 'English' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Travel Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Flight Booking & Ticketing' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Hotel Reservations' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Tour Packages' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Visa Assistance' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Medical Travel Insurance' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Corporate & Conference Travel' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Airport Logistics Assistance' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Holiday Packages' } },
    ],
  },
  sameAs: [
    'https://www.facebook.com/etaktravelsandtours',
    'https://www.instagram.com/etaktravelsandtours',
  ],
}

const DEFAULT_KEYWORDS = [
  'Etak', 'Etak Travels', 'Etak Tours', 'Etak Limited', 'Etak travel',
  'Etak Abuja', 'Etak Nigeria', 'Etak Travels and Tours',
  'Etak Travels & Tours Expert Limited', 'Etak travel agency',
  'Etak flight booking', 'Etak hotel reservations', 'Etak visa assistance',
  'Etak tour packages', 'Etak corporate travel', 'Etak airport logistics',
  'Etak travel insurance', 'Etak RC 898792', 'Etak IATA',
  'Abuja travel agency', 'Nigeria travel company', 'flight booking Nigeria',
  'hotel reservations Abuja', 'visa assistance Nigeria', 'tour packages Nigeria',
  'travel management company Nigeria', 'business travel Nigeria',
  'international flights from Abuja', 'Dubai visa Nigeria',
  'London travel Nigeria', 'Istanbul tour Nigeria', 'Paris travel Nigeria',
  'cheap flights Abuja', 'travel agency near me Abuja', 'RC 898792',
  'IATA accredited Nigeria', 'CAC registered travel agency Nigeria',
].join(', ')

export default function SEO({
  title,
  description,
  keywords,
  image = DEFAULT_IMG,
  images = [],
  url,
  type = 'website',
  noIndex = false,
  schema,
}: SEOProps) {
  const fullTitle       = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Travel Management in Abuja`
  const fullDescription = description ??
    "Etak Travels & Tours Expert Limited — Abuja's trusted travel management company. Flight booking, hotel reservations, tour packages, visa assistance, and corporate travel support across Nigeria and beyond."
  const fullUrl      = url ? `${BASE_URL}${url}` : BASE_URL
  const fullImage    = image.startsWith('http') ? image : `${BASE_URL}${image}`
  const fullKeywords = keywords ? `${DEFAULT_KEYWORDS}, ${keywords}` : DEFAULT_KEYWORDS

  useEffect(() => {
    document.title = fullTitle

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        const [attrName, attrVal] = selector.replace('meta[', '').replace(']', '').split('=')
        el.setAttribute(attrName.trim(), attrVal.replace(/"/g, ''))
        document.head.appendChild(el)
      }
      el.setAttribute(attr, value)
    }

    setMeta('meta[name="description"]',        'content', fullDescription)
    setMeta('meta[name="keywords"]',           'content', fullKeywords)
    setMeta('meta[name="robots"]',             'content', noIndex ? 'noindex, nofollow' : 'index, follow')

    setMeta('meta[property="og:title"]',       'content', fullTitle)
    setMeta('meta[property="og:description"]', 'content', fullDescription)
    setMeta('meta[property="og:image"]',       'content', fullImage)
    setMeta('meta[property="og:url"]',         'content', fullUrl)
    setMeta('meta[property="og:type"]',        'content', type)
    setMeta('meta[property="og:site_name"]',   'content', SITE_NAME)

    setMeta('meta[name="twitter:title"]',       'content', fullTitle)
    setMeta('meta[name="twitter:description"]', 'content', fullDescription)
    setMeta('meta[name="twitter:image"]',       'content', fullImage)
    setMeta('meta[name="twitter:card"]',        'content', 'summary_large_image')

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = fullUrl

    // ── JSON-LD: always emit the org schema + a page-level WebPage node
    // plus any page-specific schema passed via the `schema` prop.
    // Extra images are emitted as ImageObject nodes so Google Image Search
    // can index them independently of the page.
    document.querySelectorAll('script[data-ld]').forEach(s => s.remove())

    const graphs: object[] = [
      ORG_SCHEMA,
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${fullUrl}#webpage`,
        url: fullUrl,
        name: fullTitle,
        description: fullDescription,
        isPartOf: { '@id': `${BASE_URL}/#organization` },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: fullImage,
          contentUrl: fullImage,
        },
      },
    ]

    // Extra images as standalone ImageObject nodes
    images.forEach(img => {
      const absUrl = img.url.startsWith('http') ? img.url : `${BASE_URL}${img.url}`
      graphs.push({
        '@context': 'https://schema.org',
        '@type': 'ImageObject',
        url: absUrl,
        contentUrl: absUrl,
        name: img.alt,
        description: img.alt,
        representativeOfPage: false,
      })
    })

    if (schema) graphs.push(schema)

    graphs.forEach((graph, i) => {
      const s = document.createElement('script')
      s.setAttribute('data-ld', String(i))
      s.type = 'application/ld+json'
      s.text = JSON.stringify(graph)
      document.head.appendChild(s)
    })
  }, [fullTitle, fullDescription, fullKeywords, fullImage, fullUrl, type, noIndex, images, schema])

  return null
}
