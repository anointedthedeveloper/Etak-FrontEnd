import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { MapPin, Mail, Phone, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { Input, Textarea, Select } from '../components/ui/FormFields'
import { DatePicker } from '../components/forms/FormWidgets'
import { Button } from '../components/ui/Button'
import SEO from '../components/ui/SEO'
import { apiService } from '../services/api'
import PageHeader from '../components/ui/PageHeader'

interface FormState {
  name: string; email: string; phone: string; service: string
  preferredContact: string; travelDates: string; message: string
}

const initialForm: FormState = { name: '', email: '', phone: '', service: '', preferredContact: '', travelDates: '', message: '' }

export default function Contact() {
  const location = useLocation()
  const prefill = location.state as Record<string, string> | null

  const [form, setForm] = useState<FormState>({
    ...initialForm,
    service: prefill?.service ?? prefill?.type ?? '',
    message: prefill?.destination ? `I'm interested in travelling to ${prefill.destination}.` : '',
  })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const set = (k: keyof FormState, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const e: Partial<FormState> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.message.trim()) e.message = 'Please describe your travel needs'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStatus('loading')
    try {
      await apiService.submitContactForm(form as unknown as Record<string, unknown>)
      setStatus('success')
      setForm(initialForm)
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <SEO
        title="Contact Us"
        description="Contact Etak Travels & Tours Expert Limited for flight bookings, hotel reservations, tour packages and visa assistance. Based in Abuja, Nigeria. Call +234 803 206 2242."
        keywords="contact Etak Travels, Etak Abuja phone number, travel inquiry Nigeria, book flight Abuja"
        url="/contact"
      />
      {/* Header */}
      <PageHeader
        eyebrow="Contact Us"
        title="Let's Plan Your Journey"
        subtitle="Reach out to our team with your travel inquiry and we'll get back to you with a personalised plan."
        image="/images/headers/contact.jpg"
        centered
      />

      <section className="py-12 sm:py-16 lg:py-20 bg-[#F8FAFC]">
        <div className="site-gutter w-full">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Contact info */}
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-display font-bold text-[#101B46] text-xl mb-5">Get in Touch</h3>
                <div className="flex flex-col gap-5">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF8FD] flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-[#08A9E0]" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#101B46] mb-1">Office Address</div>
                      <p className="text-sm text-[#667085] leading-relaxed">
                        Block C2, 2014, ACCI Ultra Modern Shopping Centre, Airport Road, Piwoyi, Abuja, FCT, Nigeria.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF8FD] flex items-center justify-center shrink-0">
                      <Mail size={18} className="text-[#08A9E0]" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#101B46] mb-1">Email</div>
                      <a href="mailto:etaktravels15@gmail.com" className="text-sm text-[#08A9E0] hover:underline">etaktravels15@gmail.com</a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF8FD] flex items-center justify-center shrink-0">
                      <Phone size={18} className="text-[#08A9E0]" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#101B46] mb-1">Phone</div>
                      <a href="tel:+2348032062242" className="text-sm text-[#08A9E0] hover:underline block">+234 803 206 2242</a>
                      <a href="tel:+2348173588783" className="text-sm text-[#08A9E0] hover:underline block">+234 817 358 8783</a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center shrink-0">
                      <FaWhatsapp size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#101B46] mb-1">WhatsApp</div>
                      <a href="https://wa.me/2348032062242" target="_blank" rel="noopener noreferrer" className="text-sm text-[#25D366] hover:underline block">
                        Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF8FD] flex items-center justify-center shrink-0">
                      <Clock size={18} className="text-[#08A9E0]" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#101B46] mb-1">Business Hours</div>
                      <p className="text-sm text-[#667085]">Monday – Friday: 8am – 6pm</p>
                      <p className="text-sm text-[#667085]">Saturday: 9am – 3pm</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <iframe
                  title="Etak Travels location map"
                  src="https://www.google.com/maps?q=ACCI+Ultra+Modern+Shopping+Centre+Piwoyi+Abuja+Nigeria&output=embed"
                  className="w-full h-52 border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="p-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-[#101B46]">Piwoyi, Abuja, FCT, Nigeria</p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=ACCI+Ultra+Modern+Shopping+Centre+Piwoyi+Abuja+Nigeria"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm text-[#08A9E0] hover:underline"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-8">
              <h3 className="font-display font-bold text-[#101B46] text-2xl mb-2">Send Us a Message</h3>
              <p className="text-[#667085] text-sm mb-6">Fill in the form below and our team will respond within 24 hours.</p>

              {status === 'success' ? (
                <div className="flex flex-col items-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} className="text-green-600" />
                  </div>
                  <h4 className="font-display font-bold text-[#101B46] text-xl mb-2">Message Received</h4>
                  <p className="text-[#667085] text-sm max-w-sm">
                    Thank you for reaching out. Our team will review your inquiry and get back to you within 24 hours.
                  </p>
                  <button onClick={() => setStatus('idle')} className="mt-6 text-[#08A9E0] font-medium text-sm hover:underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Full Name" placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} error={errors.name} required />
                    <Input label="Email Address" type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} error={errors.email} required />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Phone Number" type="tel" placeholder="+234 xxx xxx xxxx" value={form.phone} onChange={e => set('phone', e.target.value)} />
                    <Select
                      label="Service Required"
                      value={form.service}
                      onChange={e => set('service', e.target.value)}
                      placeholder="Select a service"
                      options={[
                        { value: 'flight', label: 'Flight Booking & Ticketing' },
                        { value: 'hotel', label: 'Hotel Reservations' },
                        { value: 'tour', label: 'Tour Package' },
                        { value: 'visa', label: 'Visa Assistance' },
                        { value: 'insurance', label: 'Travel Insurance' },
                        { value: 'consulting', label: 'Travel Consulting' },
                        { value: 'corporate', label: 'Corporate Travel' },
                        { value: 'other', label: 'Other' },
                      ]}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Select
                      label="Preferred Contact Method"
                      value={form.preferredContact}
                      onChange={e => set('preferredContact', e.target.value)}
                      placeholder="Select preference"
                      options={[
                        { value: 'email', label: 'Email' },
                        { value: 'phone', label: 'Phone Call' },
                        { value: 'whatsapp', label: 'WhatsApp' },
                      ]}
                    />
                    <DatePicker label="Preferred Travel Date" value={form.travelDates} onChange={v => set('travelDates', v)} />
                  </div>
                  <Textarea
                    label="Your Travel Inquiry"
                    placeholder="Tell us about your travel plans, destination, number of travellers, and any specific requirements..."
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    error={errors.message}
                    rows={5}
                    required
                  />

                  {status === 'error' && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                      <AlertCircle size={16} className="text-red-500 shrink-0" />
                      <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
                    </div>
                  )}

                  <Button type="submit" variant="primary" size="lg" loading={status === 'loading'} className="w-full sm:w-auto">
                    Send Inquiry
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
