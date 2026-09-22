/** Invisible until focused — lets keyboard users jump past the fixed nav straight to page content. */
export default function SkipLink({ targetId = 'main-content' }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:rounded-control focus:bg-[#08A9E0] focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-float"
    >
      Skip to content
    </a>
  )
}
