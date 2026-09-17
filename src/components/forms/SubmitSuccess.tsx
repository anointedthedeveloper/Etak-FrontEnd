import { CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface Props {
  inquiryId: string
  type: string
  onReset: () => void
}

export default function SubmitSuccess({ inquiryId, type, onReset }: Props) {
  const { isAuthenticated } = useAuth()
  const shortId = `ETK-${inquiryId.slice(0, 6).toUpperCase()}`

  return (
    <div className="flex flex-col items-center text-center py-8 px-4 gap-4">
      <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle2 size={28} className="text-green-600" />
      </div>

      <div>
        <p className="text-xs font-mono text-[#08A9E0] font-semibold mb-1">{shortId}</p>
        <h4 className="font-display font-bold text-[#101B46] text-lg mb-1">Inquiry Submitted!</h4>
        <p className="text-sm text-[#667085] max-w-xs">
          Your {type} inquiry has been received. Our team will respond within 24 hours via email.
        </p>
      </div>

      {!isAuthenticated && (
        <div className="w-full max-w-xs bg-[#EAF8FD] rounded-xl p-4 border border-[#08A9E0]/20">
          <p className="text-sm font-semibold text-[#101B46] mb-1">Track your inquiry</p>
          <p className="text-xs text-[#667085] mb-3">
            Create a free account to view responses, track status, and manage all your inquiries in one place.
          </p>
          <div className="flex gap-2">
            <Link
              to="/signup"
              className="flex-1 text-center text-xs font-semibold bg-[#08A9E0] text-white py-2 rounded-lg hover:bg-[#0798c9] transition-colors"
            >
              Sign Up Free
            </Link>
            <Link
              to="/login"
              className="flex-1 text-center text-xs font-semibold border border-[#08A9E0] text-[#08A9E0] py-2 rounded-lg hover:bg-[#EAF8FD] transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      )}

      {isAuthenticated && (
        <Link
          to="/dashboard/inquiries"
          className="text-sm text-[#08A9E0] font-medium hover:underline"
        >
          View in dashboard →
        </Link>
      )}

      <button onClick={onReset} className="text-xs text-[#667085] hover:text-[#101B46] transition-colors">
        Submit another inquiry
      </button>
    </div>
  )
}
