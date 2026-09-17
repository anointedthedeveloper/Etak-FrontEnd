import { useLocation } from 'react-router-dom'
import { ArrowRight, BriefcaseBusiness, CalendarClock, MapPinned, Pencil, ShieldCheck, Star, UserCircle2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { StatusBadge } from '../components/ui/index'
import { useAuth } from '../context/AuthContext'

const mockRequests = [
  { id: 'ETK-1043', title: 'Dubai business trip', status: 'under_review', date: '21 Aug 2026' },
  { id: 'ETK-1055', title: 'Accra leisure package', status: 'confirmed', date: '1 Sep 2026' },
  { id: 'ETK-1071', title: 'London visa assistance', status: 'submitted', date: '11 Sep 2026' },
]

const quickActions = [
  { label: 'Flight booking', icon: MapPinned },
  { label: 'Hotel reservation', icon: BriefcaseBusiness },
  { label: 'Tour package', icon: CalendarClock },
  { label: 'Visa assistance', icon: ShieldCheck },
]

export default function Dashboard() {
  const { user } = useAuth()
  const location = useLocation()
  const isProfileView = location.pathname.endsWith('/profile')

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-28 pb-16">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#08A9E0]">Dashboard</p>
            <h1 className="font-display text-4xl font-bold text-[#101B46]">
              Welcome back, {user?.firstName ?? 'traveller'}
            </h1>
          </div>
          <Button variant="primary" size="md">Request a new service</Button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
          <div className="space-y-6">
            <section className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Upcoming requests', value: '03' },
                { label: 'Active enquiries', value: '08' },
                { label: 'Completed trips', value: '12' },
              ].map(item => (
                <div key={item.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-[#667085]">{item.label}</p>
                  <p className="mt-3 text-3xl font-bold text-[#101B46]">{item.value}</p>
                </div>
              ))}
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-[#101B46]">My travel requests</h2>
                <Button variant="outline" size="sm">View all</Button>
              </div>

              <div className="space-y-4">
                {mockRequests.map(request => (
                  <div key={request.id} className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-[#F8FAFC] p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#08A9E0]">{request.id}</p>
                      <p className="mt-1 font-semibold text-[#172033]">{request.title}</p>
                      <p className="text-sm text-[#667085]">{request.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={request.status} />
                      <button className="text-sm font-medium text-[#08A9E0]">View details</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-[#101B46]">Recent activity</h2>
              <div className="mt-5 space-y-4">
                {[
                  'Flight inquiry for Paris submitted successfully.',
                  'Hotel reservation confirmation for Dubai received.',
                  'Travel consultation note shared with your advisor.',
                ].map((activity, index) => (
                  <div key={activity} className="flex gap-3 rounded-xl bg-[#F8FAFC] p-3">
                    <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF8FD] text-[#08A9E0]">
                      <Star size={14} />
                    </div>
                    <div>
                      <p className="font-medium text-[#172033]">{activity}</p>
                      <p className="text-xs text-[#667085]">{index + 1} day{index === 0 ? '' : 's'} ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#08A9E0] text-lg font-bold text-white">
                  {user?.firstName?.[0] ?? 'E'}{user?.lastName?.[0] ?? 'T'}
                </div>
                <div>
                  <h3 className="font-semibold text-[#101B46]">{user?.firstName ?? 'Etak'} {user?.lastName ?? 'Traveller'}</h3>
                  <p className="text-sm text-[#667085]">{user?.email ?? 'traveller@example.com'}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-[#F8FAFC] p-3 text-sm">
                  <span className="text-[#667085]">Preferred contact</span>
                  <span className="font-medium text-[#172033]">Email</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[#F8FAFC] p-3 text-sm">
                  <span className="text-[#667085]">Phone</span>
                  <span className="font-medium text-[#172033]">{user?.phone ?? '+234 800 000 0000'}</span>
                </div>
              </div>

              <div className="mt-5">
                <Button variant="outline" className="w-full" onClick={() => window.location.assign('/dashboard/profile')}>
                  <Pencil size={15} /> Edit profile
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="font-display text-xl font-bold text-[#101B46]">Quick actions</h3>
              <div className="mt-5 grid gap-3">
                {quickActions.map(({ label, icon: Icon }) => (
                  <button key={label} className="flex items-center justify-between rounded-xl border border-gray-100 bg-[#F8FAFC] p-3 text-left transition hover:border-[#08A9E0] hover:bg-[#EAF8FD]">
                    <span className="flex items-center gap-3 text-sm font-medium text-[#172033]"><Icon size={16} className="text-[#08A9E0]" /> {label}</span>
                    <ArrowRight size={16} className="text-[#667085]" />
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {isProfileView && (
          <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <UserCircle2 className="text-[#08A9E0]" />
              <h2 className="font-display text-2xl font-bold text-[#101B46]">Profile settings</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                ['First name', user?.firstName ?? 'Etak'],
                ['Last name', user?.lastName ?? 'Traveller'],
                ['Email', user?.email ?? 'traveller@example.com'],
                ['Phone', user?.phone ?? '+234 800 000 0000'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-gray-100 bg-[#F8FAFC] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#667085]">{label}</p>
                  <p className="mt-2 text-sm font-medium text-[#172033]">{value}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
