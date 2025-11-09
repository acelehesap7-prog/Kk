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
  User,
  UserPlus,
  Coins,
  Gift,
  Star,
  CheckCircle
} from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Şifreler eşleşmiyor!')
      return
    }
    if (!acceptTerms) {
      alert('Kullanım şartlarını kabul etmelisiniz!')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Kayıt ol
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            acceptedTerms: acceptTerms
          }
        }
      })

      if (signUpError) {
        throw signUpError
      }

      // Profil oluştur
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email,
            name,
            role: 'user'
          })

        if (profileError) {
          throw profileError
        }

        // Başlangıç tokenleri ver
        const { error: tokenError } = await supabase
          .from('assets')
          .insert({
            user_id: user.id,
            symbol: 'KK99',
            name: 'KK99 Token',
            balance: 1000,
            current_price: 0.5,
            price_change_24h: 0,
            icon: '🪙'
          })

        if (tokenError) {
          throw tokenError
        }

        alert('Hesabınız oluşturuldu! E-posta adresinizi doğrulayın.')
        router.push('/auth/login')
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Registration Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto mb-4 h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">KK</span>
              </div>
              <CardTitle className="text-2xl font-bold">Hesap Oluşturun</CardTitle>
              <CardDescription className="text-base">
                KK Exchange'de trading hesabınızı hemen oluşturun
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Ad Soyad
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Adınızı ve soyadınızı girin"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

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
                      placeholder="Güçlü bir şifre oluşturun"
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

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Şifre Tekrarı
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Şifrenizi tekrar girin"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox" 
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 rounded border-gray-300" 
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    <Link href="/terms" className="text-blue-600 hover:underline">Kullanım Şartları</Link> ve{' '}
                    <Link href="/privacy" className="text-blue-600 hover:underline">Gizlilik Politikası</Link>'nı okudum ve kabul ediyorum.
                  </label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-11 text-base"
                  disabled={isLoading || !acceptTerms}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Hesap oluşturuluyor...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <UserPlus className="h-4 w-4" />
                      <span>Hesap Oluştur</span>
                    </div>
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Zaten hesabınız var mı?{' '}
                  <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                    Giriş yapın
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Side - Benefits */}
        <div className="hidden lg:block">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Ücretsiz Hesap Açın
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Dakikalar içinde hesabınızı oluşturun ve trading'e başlayın
              </p>
            </div>
            
            {/* Welcome Bonus */}
            <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Gift className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">Hoş Geldin Bonusu</h3>
                  <Badge className="bg-green-600 mt-1">Yeni Üyeler İçin</Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">1.000 KK99 Token (500$ değerinde)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">İlk 30 gün komisyon indirimi</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Özel piyasa analizleri</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-white/50 backdrop-blur-sm border">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Coins className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">KK99 Token Sistemi</h3>
                  <p className="text-sm text-muted-foreground">
                    Her işlemde token kazanın, komisyonlarda indirim alın
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-white/50 backdrop-blur-sm border">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Premium Özellikler</h3>
                  <p className="text-sm text-muted-foreground">
                    Gelişmiş analiz araçları ve özel market verileri
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-medium mb-3">Hesap Açma Süreci:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <span>Bilgilerinizi girin (2 dakika)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <span>E-posta doğrulaması yapın</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <span>Trading'e başlayın!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}