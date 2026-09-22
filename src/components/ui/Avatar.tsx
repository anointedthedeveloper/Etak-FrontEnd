interface AvatarProps {
  avatarUrl?: string
  firstName?: string
  lastName?: string
  size?: number
  className?: string
}

export default function Avatar({ avatarUrl, firstName, lastName, size = 28, className = '' }: AvatarProps) {
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || '?'

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={initials}
        referrerPolicy="no-referrer"
        style={{ width: size, height: size }}
        className={`rounded-full object-cover shrink-0 ${className}`}
      />
    )
  }

  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={`rounded-full bg-[#08A9E0] flex items-center justify-center text-white font-bold shrink-0 ${className}`}
    >
      {initials}
    </div>
  )
}
