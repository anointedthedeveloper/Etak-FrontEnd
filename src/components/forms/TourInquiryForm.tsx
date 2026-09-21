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
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!destination.trim()) e.destination = 'Required'
    if (!isAuthenticated) {
      if (!name.trim())  e.name  = 'Required'
      if (!email.trim()) e.email = 'Required'
      if (!phone.trim()) e.phone = 'Required'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
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
      <LocationInput label="Destination" value={destination} onChange={v => { setDestination(v); setErrors(p => ({ ...p, destination: '' })) }} placeholder="Where would you like to go?" required error={errors.destination} />

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
        <>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Your Name" placeholder="Full name" value={name} onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }} required error={errors.name} />
            <Input label="Email" type="email" placeholder="your@email.com" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }} required error={errors.email} />
          </div>
          <Input label="Phone" type="tel" placeholder="+234 xxx xxx xxxx" value={phone} onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: '' })) }} required error={errors.phone} />
        </>
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
