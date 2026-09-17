import { useState } from 'react'
import { Bell, Shield, Globe, Moon, CheckCircle2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'

export default function DashboardSettings() {
  const [saved, setSaved] = useState(false)
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    twoFactor: false,
    language: 'en',
    darkMode: false,
  })

  const toggle = (key: keyof typeof prefs) =>
    setPrefs(p => ({ ...p, [key]: !p[key] }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const sections = [
    {
      icon: Bell,
      title: 'Notifications',
      items: [
        { key: 'emailNotifications', label: 'Email notifications', desc: 'Receive updates on your inquiries via email' },
        { key: 'smsNotifications',   label: 'SMS notifications',   desc: 'Receive SMS alerts for booking confirmations' },
        { key: 'marketingEmails',    label: 'Marketing emails',    desc: 'Receive travel deals and promotional offers' },
      ],
    },
    {
      icon: Shield,
      title: 'Security',
      items: [
        { key: 'twoFactor', label: 'Two-factor authentication', desc: 'Add an extra layer of security to your account' },
      ],
    },
    {
      icon: Globe,
      title: 'Preferences',
      items: [
        { key: 'darkMode', label: 'Dark mode', desc: 'Switch to a darker colour scheme' },
      ],
    },
  ] as const

  return (
    <div className="p-6 xl:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#101B46]">Settings</h1>
        <p className="text-sm text-[#667085] mt-0.5">Manage your account preferences</p>
      </div>

      <div className="space-y-5 max-w-2xl">
        {sections.map(({ icon: Icon, title, items }) => (
          <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <Icon size={16} className="text-[#08A9E0]" />
              <h2 className="font-semibold text-[#101B46] text-sm">{title}</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {items.map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-[#172033]">{label}</p>
                    <p className="text-xs text-[#667085] mt-0.5">{desc}</p>
                  </div>
                  <button
                    onClick={() => toggle(key as keyof typeof prefs)}
                    className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 focus:outline-none shrink-0 ${
                      prefs[key as keyof typeof prefs] ? 'bg-[#08A9E0]' : 'bg-gray-200'
                    }`}
                    style={{ height: '22px', width: '40px' }}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                        prefs[key as keyof typeof prefs] ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex items-center gap-3">
          <Button variant="primary" size="md" onClick={handleSave}>Save preferences</Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
              <CheckCircle2 size={15} /> Saved
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
