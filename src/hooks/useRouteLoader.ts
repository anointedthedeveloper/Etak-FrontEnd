import { useEffect, useState } from 'react'

/**
 * Shows the PageLoader ONLY on the very first app mount.
 * Navigation between routes is instant — no overlay that kills entrance animations.
 */
export function useRouteLoader() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Give React one tick to paint the initial page, then remove the loader
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, []) // empty dep array — fires once on mount only

  return loading
}
