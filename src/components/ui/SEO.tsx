import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  noIndex?: boolean
}

const SITE_NAME = 'Etak Travels & Tours Expert Limited'
const BASE_URL  = 'https://etaktravels.com'
const DEFAULT_IMG = `${BASE_URL}/brand/logo.png`

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
  url,
  type = 'website',
  noIndex = false,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Travel Management in Abuja`
  const fullDescription = description ??
    'Etak Travels & Tours Expert Limited — Abuja\'s trusted travel management company. Flight booking, hotel reservations, tour packages, visa assistance, and corporate travel support across Nigeria and beyond.'
  const fullUrl   = url ? `${BASE_URL}${url}` : BASE_URL
  const fullImage = image.startsWith('http') ? image : `${BASE_URL}${image}`
  const fullKeywords = keywords ? `${DEFAULT_KEYWORDS}, ${keywords}` : DEFAULT_KEYWORDS

  useEffect(() => {
    // Title
    document.title = fullTitle

    // Helpers
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

    // Structured data (JSON-LD)
    const existingLD = document.getElementById('ld-json')
    if (existingLD) existingLD.remove()
    const script = document.createElement('script')
    script.id   = 'ld-json'
    script.type = 'application/ld+json'
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'TravelAgency',
      name: SITE_NAME,
      url: BASE_URL,
      logo: `${BASE_URL}/brand/logo.png`,
      description: fullDescription,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Block C2, 2014, ACCI Ultra Modern Shopping Centre, Airport Road, Piwoyi',
        addressLocality: 'Abuja',
        addressRegion: 'FCT',
        addressCountry: 'NG',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+234-803-206-2242',
        contactType: 'customer service',
      },
      sameAs: [
        'https://www.facebook.com/etaktravelsandtours',
        'https://www.instagram.com/etaktravelsandtours',
      ],
    })
    document.head.appendChild(script)
  }, [fullTitle, fullDescription, fullKeywords, fullImage, fullUrl, type, noIndex])

  return null
}
