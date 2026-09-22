import { Outlet } from 'react-router-dom'
import Navbar from '../navigation/Navbar'
import Footer from './Footer'
import FloatingActions from '../ui/FloatingActions'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-[68px] xl:pt-[72px] 2xl:pt-20">
        <Outlet />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  )
}
