import { useState } from 'react'
import { Bell, Shield, Globe, CheckCircle2, Lock, Mail, MessageSquare, Tag, Moon, Smartphone } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#08A9E0]/40 shrink-0 ${on ? 'bg-[#08A9E0]' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${on ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

function SettingRow({ icon: Icon, label, desc, on, onToggle }: {
  icon: typeof Bell; label: string; desc: string; on: boolean; onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-gray-50 last:border-0">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-[#EAF8FD] flex items-center justify-center shrink-0 mt-0.5">
          <Icon size={14} className="text-[#08A9E0]" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#172033]">{label}</p>
          <p className="text-xs text-[#667085] mt-0.5 leading-relaxed">{desc}</p>
        </div>
      </div>
      <Toggle on={on} onToggle={onToggle} />
    </div>
  )
}

export default function DashboardSettings() {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    inquiryUpdates: true,
    twoFactor: false,
    darkMode: false,
  })

  const toggle = (key: keyof typeof prefs) => setPrefs(p => ({ ...p, [key]: !p[key] }))

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500) }, 600)
  }

  return (
    <div className="p-4 sm:p-5 xl:p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#101B46]">Settings</h1>
        <p className="text-sm text-[#667085] mt-0.5">Manage your account preferences and notifications</p>
      </div>

      {/* Account summary */}
      <div className="card-surface p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#101B46] to-[#08A9E0] flex items-center justify-center text-white font-bold text-lg shrink-0">
          {(user?.firstName?.[0] ?? '?').toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[#101B46] truncate">{user?.firstName} {user?.lastName}</p>
          <p className="text-sm text-[#667085] truncate">{user?.email}</p>
        </div>
        <Link to="/dashboard/profile">
          <Button variant="outline" size="sm">Edit Profile</Button>
        </Link>
      </div>

      {/* Notifications */}
      <div className="card-surface overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
          <Bell size={15} className="text-[#08A9E0]" />
          <h2 className="font-semibold text-[#101B46] text-sm">Notifications</h2>
        </div>
        <div className="px-5">
          <SettingRow icon={Mail}          label="Email notifications"  desc="Receive updates on your inquiries via email"        on={prefs.emailNotifications} onToggle={() => toggle('emailNotifications')} />
          <SettingRow icon={MessageSquare} label="Inquiry updates"       desc="Get notified when Etak replies to your inquiry"     on={prefs.inquiryUpdates}     onToggle={() => toggle('inquiryUpdates')} />
          <SettingRow icon={Smartphone}    label="SMS notifications"     desc="Receive SMS alerts for booking confirmations"       on={prefs.smsNotifications}   onToggle={() => toggle('smsNotifications')} />
          <SettingRow icon={Tag}           label="Deals & promotions"    desc="Receive travel deals and promotional offers"        on={prefs.marketingEmails}    onToggle={() => toggle('marketingEmails')} />
        </div>
      </div>

      {/* Security */}
      <div className="card-surface overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
          <Shield size={15} className="text-[#08A9E0]" />
          <h2 className="font-semibold text-[#101B46] text-sm">Security</h2>
        </div>
        <div className="px-5">
          <SettingRow icon={Lock} label="Two-factor authentication" desc="Add an extra layer of security to your account" on={prefs.twoFactor} onToggle={() => toggle('twoFactor')} />
        </div>
        <div className="px-5 py-4 border-t border-gray-50">
          <Link to="/dashboard/profile">
            <button className="text-sm text-[#08A9E0] font-medium hover:underline">Change password →</button>
          </Link>
        </div>
      </div>

      {/* Preferences */}
      <div className="card-surface overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
          <Globe size={15} className="text-[#08A9E0]" />
          <h2 className="font-semibold text-[#101B46] text-sm">Preferences</h2>
        </div>
        <div className="px-5">
          <SettingRow icon={Moon} label="Dark mode" desc="Switch to a darker colour scheme (coming soon)" on={prefs.darkMode} onToggle={() => toggle('darkMode')} />
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <Button variant="primary" size="md" onClick={handleSave} loading={saving}>Save preferences</Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium animate-fade-in">
            <CheckCircle2 size={15} /> Saved
          </span>
        )}
      </div>
    </div>
  )
}
