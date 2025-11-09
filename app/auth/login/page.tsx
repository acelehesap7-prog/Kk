'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn,
  Coins,
  Shield,
  TrendingUp,
  Users
} from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw error
      }

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto mb-4 h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">KK</span>
              </div>
              <CardTitle className="text-2xl font-bold">Hoş Geldiniz</CardTitle>
              <CardDescription className="text-base">
                KK Exchange hesabınıza giriş yapın
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    E-posta Adresi
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="E-posta adresinizi girin"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Şifre
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Şifrenizi girin"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Beni hatırla</span>
                  </label>
                  <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                    Şifremi unuttum
                  </Link>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-11 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Giriş yapılıyor...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <LogIn className="h-4 w-4" />
                      <span>Giriş Yap</span>
                    </div>
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Hesabınız yok mu?{' '}
                  <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
                    Ücretsiz kayıt olun
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Side - Features */}
        <div className="hidden lg:block">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Güvenle İşlem Yapın
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                7 farklı piyasaya erişin ve her işlemde KK99 token kazanın
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-white/50 backdrop-blur-sm border">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Coins className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">KK99 Token Ödülleri</h3>
                  <p className="text-sm text-muted-foreground">
                    Her işlemde KK99 token kazanın ve komisyonlarda %75'e varan indirim alın
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-white/50 backdrop-blur-sm border">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">7 Piyasa Türü</h3>
                  <p className="text-sm text-muted-foreground">
                    Spot, Vadeli, Opsiyon, Forex, Hisse, Emtia ve Endeks piyasaları
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-white/50 backdrop-blur-sm border">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Güvenli ve Güvenilir</h3>
                  <p className="text-sm text-muted-foreground">
                    Banka seviyesinde güvenlik, 7/24 izleme ve sigorta kapsamı
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-white/50 backdrop-blur-sm border">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Topluluk Odaklı</h3>
                  <p className="text-sm text-muted-foreground">
                    Binlerce trader'a katılın ve özel piyasa analizlerine erişin
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-blue-900">Yeni Üye Bonusu</h3>
                <Badge className="bg-blue-600">Sınırlı Süre</Badge>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                İlk işleminizi tamamladığınızda 1.000 KK99 token kazanın!
              </p>
              <div className="flex items-center space-x-2 text-xs text-blue-600">
                <Coins className="h-3 w-3" />
                <span>500$ değerinde işlem avantajı</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}