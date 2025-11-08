'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  Coins, 
  User, 
  Wallet, 
  Settings, 
  Menu,
  X,
  TrendingUp
} from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Markets', href: '/markets', icon: TrendingUp },
  { name: 'Trade', href: '/trade', icon: BarChart3 },
  { name: 'Wallet', href: '/wallet', icon: Wallet },
  { name: 'KK99 Token', href: '/token', icon: Coins },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-background border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">KK</span>
                </div>
                <span className="text-xl font-bold">Exchange</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const IconComponent = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center space-x-1 px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${
                      isActive
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {/* KK99 Balance */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-lg border border-blue-200">
              <Coins className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">5,000 KK99</span>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-1" />
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">
                  Register
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 pb-3 pt-2">
            {navigation.map((item) => {
              const IconComponent = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600'
                      : 'text-muted-foreground hover:bg-gray-50 hover:text-foreground'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            
            <div className="px-4 py-2">
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                <Coins className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">5,000 KK99</span>
              </div>
            </div>
            
            <div className="px-4 py-2 space-y-2">
              <Link href="/auth/login" className="block">
                <Button variant="outline" size="sm" className="w-full">
                  <User className="h-4 w-4 mr-1" />
                  Login
                </Button>
              </Link>
              <Link href="/auth/register" className="block">
                <Button size="sm" className="w-full">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}