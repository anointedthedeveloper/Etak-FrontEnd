import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Select } from '../ui/FormFields'
import { Button } from '../ui/Button'
import { LocationInput, DatePicker, TravellerSelector, type Travellers } from './FormWidgets'

interface Props { compact?: boolean }

export default function TourInquiryForm({ compact: _compact }: Props) {
  const navigate = useNavigate()
  const [destination, setDestination] = useState('')
  const [travelDate, setTravelDate]   = useState('')
  const [duration, setDuration]       = useState('')
  const [tourType, setTourType]       = useState('')
  const [travellers, setTravellers]   = useState<Travellers>({ adults: 1, children: 0, infants: 0, class: 'economy' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/contact', {
      state: {
        type: 'tour', destination, travelDate, duration, tourType,
        groupSize: `${travellers.adults + travellers.children} people`,
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <LocationInput label="Destination" value={destination} onChange={setDestination} placeholder="Where would you like to go?" mode="hotel" required />

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

      <Button type="submit" variant="primary" className="w-full mt-1">Request Tour Information</Button>
      <p className="text-xs text-[#667085] text-center">This submits a travel inquiry — not a live booking.</p>
    </form>
  )
}
