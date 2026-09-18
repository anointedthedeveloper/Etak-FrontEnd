import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { Select, Input } from '../ui/FormFields'
import { Button } from '../ui/Button'
import { LocationInput, DatePicker, TravellerSelector, type Travellers } from './FormWidgets'
import { apiService } from '../../services/api'
import SubmitSuccess from './SubmitSuccess'
import { useAuth } from '../../context/AuthContext'

interface Props { compact?: boolean }

export default function TourInquiryForm({ compact: _compact }: Props) {
  const { user, isAuthenticated } = useAuth()
  const [destination, setDestination] = useState('')
  const [travelDate, setTravelDate]   = useState('')
  const [duration, setDuration]       = useState('')
  const [tourType, setTourType]       = useState('')
  const [travellers, setTravellers]   = useState<Travellers>({ adults: 1, children: 0, infants: 0, class: 'economy' })
  const [name, setName]   = useState(isAuthenticated ? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() : '')
  const [email, setEmail] = useState(isAuthenticated ? (user?.email ?? '') : '')
  const [phone, setPhone] = useState(isAuthenticated ? (user?.phone ?? '') : '')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [submittedId, setSubmittedId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const { id } = await apiService.submitInquiry({
        type: 'tour',
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined,
        details: { destination, travelDate, duration, tourType, travellers },
        message: `Tour inquiry: ${destination}, ${travelDate}, ${duration}, ${tourType}, ${travellers.adults + travellers.children} people`,
      })
      setSubmittedId(id)
    } catch {
      setStatus('error')
    }
  }

  if (submittedId) {
    return <SubmitSuccess inquiryId={submittedId} type="tour" onReset={() => { setSubmittedId(null); setStatus('idle') }} />
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <LocationInput label="Destination" value={destination} onChange={setDestination} placeholder="Where would you like to go?" required />

      <div className="grid grid-cols-2 gap-3">
        <DatePicker label="Travel Date" value={travelDate} onChange={setTravelDate} />
        <Select label="Duration" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Select duration"
          options={['3-4 days', '5-7 days', '8-10 days', '11-14 days', '2+ weeks'].map(d => ({ value: d, label: d }))} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <TravellerSelector value={travellers} onChange={setTravellers} showClass={false} />
        <Select label="Tour Type" value={tourType} onChange={e => setTourType(e.target.value)} placeholder="Select type"
          options={[{ value: 'leisure', label: 'Leisure' }, { value: 'educational', label: 'Educational' }, { value: 'business', label: 'Business' }, { value: 'holiday', label: 'Holiday' }]} />
      </div>

      {!isAuthenticated && (
        <div className="grid grid-cols-2 gap-3">
          <Input label="Your Name" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
          <Input label="Email" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
      )}
      {!isAuthenticated && (
        <Input label="Phone (optional)" type="tel" placeholder="+234 xxx xxx xxxx" value={phone} onChange={e => setPhone(e.target.value)} />
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle size={14} className="text-red-500 shrink-0" />
          <p className="text-xs text-red-600">Something went wrong. Please try again.</p>
        </div>
      )}

      <Button type="submit" variant="primary" className="w-full mt-1" loading={status === 'loading'}>
        Request Tour Information
      </Button>
      <p className="text-xs text-[#667085] text-center">This submits a travel inquiry — not a live booking.</p>
    </form>
  )
}
