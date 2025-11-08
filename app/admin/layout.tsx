'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icons } from '@/components/icons'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Icons.ChartLine },
  { name: 'Kullanıcılar', href: '/admin/users', icon: Icons.User },
  { name: 'İşlemler', href: '/admin/trades', icon: Icons.TrendingUp },
  { name: 'Ödemeler', href: '/admin/payments', icon: Icons.Billing },
  { name: 'Ayarlar', href: '/admin/settings', icon: Icons.Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-accent">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-accent-foreground/10">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <Icons.Logo className="h-8 w-8" />
              <span className="text-xl font-bold">Admin Panel</span>
            </Link>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-accent-foreground/10 text-foreground'
                      : 'text-muted-foreground hover:bg-accent-foreground/5 hover:text-foreground'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}