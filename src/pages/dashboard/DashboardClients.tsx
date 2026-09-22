import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/States'

export default function DashboardClients() {
  return (
    <div className="p-4 sm:p-5 xl:p-6 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#101B46]">Clients</h1>
        <p className="text-sm text-[#667085] mt-0.5">View and manage your travel clients</p>
      </div>

      <div className="card-surface p-4 sm:p-5 xl:p-12">
        <EmptyState
          icon={Users}
          title="No clients yet"
          description="Client records will appear here as you submit inquiries and Etak processes your bookings."
          action={<Link to="/contact"><Button variant="primary" size="sm">Submit an inquiry</Button></Link>}
        />
      </div>
    </div>
  )
}

