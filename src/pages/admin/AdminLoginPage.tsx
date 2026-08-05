import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/context/LanguageContext'
import { useAdmin } from '@/context/AdminContext'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Lock, Mail, ArrowLeft, ArrowRight, Globe, CircleAlert as AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const { t } = useTranslation()
  const { lang, toggle, dir } = useLanguage()
  const { user, login } = useAdmin()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  if (user) return <Navigate to="/admin" replace />

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(email, password)) {
      navigate('/admin')
    } else {
      setError(true)
    }
  }

  const Arrow = dir === 'rtl' ? ArrowRight : ArrowLeft
  const inputClass = 'w-full pl-11 pr-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm'

  return (
    <div className="min-h-screen flex" dir={dir}>
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-700 via-primary-600 to-accent-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative flex flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg">{t('brand.name')}</div>
              <div className="text-xs text-white/80">{t('brand.tagline')}</div>
            </div>
          </Link>

          <div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              {lang === 'ar' ? 'لوحة تحكم العقارات' : 'Real Estate Dashboard'}
            </h1>
            <p className="text-lg text-white/90 max-w-md">
              {lang === 'ar'
                ? 'أدر الوحدات والمشاريع والسلايدر من مكان واحد بسهولة تامة.'
                : 'Manage units, projects, and the carousel from one place with ease.'}
            </p>
          </div>

          <div className="text-sm text-white/70">
            © {new Date().getFullYear()} {t('brand.name')}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 lg:p-6">
          <Link to="/" className="flex items-center gap-2 text-sm text-neutral-600 hover:text-primary-600">
            <Arrow className="w-4 h-4" />
            {lang === 'ar' ? 'العودة للموقع' : 'Back to site'}
          </Link>
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            <Globe className="w-4 h-4" />
            {lang === 'ar' ? 'EN' : 'ع'}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 lg:p-6">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center mx-auto mb-3">
                <LayoutDashboard className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900">{t('admin.title')}</h2>
            </div>

            <h2 className="text-2xl font-bold text-neutral-900 mb-2">{t('admin.login')}</h2>
            <p className="text-sm text-neutral-500 mb-8">
              {lang === 'ar' ? 'سجل دخولك للوصول إلى لوحة التحكم' : 'Sign in to access the dashboard'}
            </p>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t('admin.email')}</label>
                <div className="relative">
                  <Mail className="absolute top-1/2 -translate-y-1/2 ltr:left-3.5 rtl:right-3.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(false) }}
                    className={inputClass}
                    
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t('admin.password')}</label>
                <div className="relative">
                  <Lock className="absolute top-1/2 -translate-y-1/2 ltr:left-3.5 rtl:right-3.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(false) }}
                    className={inputClass}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-error-500/10 text-error-600 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {t('admin.loginError')}
                </div>
              )}

              <button
                type="submit"
                className="w-full px-4 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors"
              >
                {t('admin.loginBtn')}
              </button>
            </form>


          </div>
        </div>
      </div>
    </div>
  )
}
