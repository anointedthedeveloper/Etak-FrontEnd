import { useState } from 'react'
import { MessageSquare, CheckCircle, Clock, Reply, Search, Filter } from 'lucide-react'
import { Input } from '../../components/ui/FormFields'
import { Button } from '../../components/ui/Button'
import { Textarea } from '../../components/ui/FormFields'

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+234 803 206 2242', subject: 'Flight Booking', message: 'I would like to book a flight from Abuja to London for next month. Please provide available options and pricing.', date: '2 hours ago', status: 'pending', response: '' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+234 817 358 8783', subject: 'Tour Package', message: 'Interested in the Dubai tour package. How many days is it and what does it include?', date: '5 hours ago', status: 'pending', response: '' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+234 803 206 2242', subject: 'Visa Assistance', message: 'Need help with visa application for Canada travel. What documents are required?', date: '1 day ago', status: 'responded', response: 'Thank you for your inquiry. For Canada visa, you will need: valid passport, completed application form, photos, proof of funds, travel itinerary, and employment letter.' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', phone: '+234 817 358 8783', subject: 'Hotel Reservation', message: 'Looking for hotel accommodation in Lagos for 3 nights, checking in next week.', date: '2 days ago', status: 'responded', response: 'We have several excellent hotels available in Lagos. I will send you a detailed list with pricing shortly.' },
  ])

  const [selectedEnquiry, setSelectedEnquiry] = useState<typeof enquiries[0] | null>(null)
  const [responseText, setResponseText] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'responded'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesFilter = filter === 'all' || enquiry.status === filter
    const matchesSearch = enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enquiry.subject.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleRespond = () => {
    if (!selectedEnquiry || !responseText.trim()) return

    setEnquiries(prev => prev.map(enquiry =>
      enquiry.id === selectedEnquiry.id
        ? { ...enquiry, status: 'responded' as const, response: responseText }
        : enquiry
    ))

    setResponseText('')
    setSelectedEnquiry(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#101B46]">Enquiries</h1>
          <p className="text-sm text-[#667085] mt-0.5">View and respond to customer inquiries</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
            <input
              type="text"
              placeholder="Search enquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#08A9E0]"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'responded')}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#08A9E0]"
          >
            <option value="all">All Enquiries</option>
            <option value="pending">Pending</option>
            <option value="responded">Responded</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Enquiries List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-[#101B46]">All Enquiries ({filteredEnquiries.length})</h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {filteredEnquiries.length === 0 ? (
              <div className="p-8 text-center text-[#667085]">
                <MessageSquare size={32} className="mx-auto mb-2 text-gray-300" />
                <p>No enquiries found</p>
              </div>
            ) : (
              filteredEnquiries.map((enquiry) => (
                <div
                  key={enquiry.id}
                  onClick={() => setSelectedEnquiry(enquiry)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedEnquiry?.id === enquiry.id ? 'bg-[#EAF8FD] border-l-4 border-[#08A9E0]' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-[#101B46] truncate">{enquiry.name}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                          enquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {enquiry.status === 'pending' ? (
                            <span className="flex items-center gap-1"><Clock size={10} /> Pending</span>
                          ) : (
                            <span className="flex items-center gap-1"><CheckCircle size={10} /> Responded</span>
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-[#667085] truncate">{enquiry.subject}</p>
                      <p className="text-xs text-[#667085] mt-1">{enquiry.date}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Enquiry Details & Response */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          {selectedEnquiry ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-[#101B46]">Enquiry Details</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#667085] uppercase tracking-wide">From</label>
                  <p className="text-sm font-medium text-[#101B46] mt-1">{selectedEnquiry.name}</p>
                  <p className="text-sm text-[#667085]">{selectedEnquiry.email}</p>
                  <p className="text-sm text-[#667085]">{selectedEnquiry.phone}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#667085] uppercase tracking-wide">Subject</label>
                  <p className="text-sm font-medium text-[#101B46] mt-1">{selectedEnquiry.subject}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#667085] uppercase tracking-wide">Message</label>
                  <p className="text-sm text-[#667085] mt-1 leading-relaxed">{selectedEnquiry.message}</p>
                </div>
                {selectedEnquiry.response && (
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <label className="text-xs font-semibold text-green-700 uppercase tracking-wide">Your Response</label>
                    <p className="text-sm text-green-800 mt-1 leading-relaxed">{selectedEnquiry.response}</p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-gray-100">
                <label className="text-xs font-semibold text-[#667085] uppercase tracking-wide mb-2 block">Your Response</label>
                <Textarea
                  placeholder="Type your response here..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                  disabled={selectedEnquiry.status === 'responded'}
                />
                {selectedEnquiry.status === 'pending' && (
                  <Button
                    onClick={handleRespond}
                    variant="primary"
                    size="lg"
                    className="w-full mt-3"
                    disabled={!responseText.trim()}
                  >
                    <Reply size={16} className="mr-2" />
                    Send Response
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-center">
              <div>
                <MessageSquare size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-[#667085]">Select an enquiry to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
