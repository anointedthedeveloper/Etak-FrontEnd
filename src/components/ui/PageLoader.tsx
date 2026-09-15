export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#101B46]">
      <img src="/logo.png" alt="Etak Travels" className="h-20 w-20 object-contain mb-6 animate-pulse" />
      {/* Spinner */}
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-4 border-white/10" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#08A9E0] animate-spin" />
      </div>
      <p className="mt-5 text-white/60 text-sm tracking-widest uppercase font-medium">Loading…</p>
    </div>
  )
}
