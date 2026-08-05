import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/context/LanguageContext'
import { useAdmin } from '@/context/AdminContext'
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { LayoutDashboard, Chrome as Home, Building2, Images, MessageSquare, LogOut, Menu, X, ArrowLeft, ArrowRight, Globe } from 'lucide-react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const { lang, toggle, dir } = useLanguage()
  const { user, logout, loading } = useAdmin()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  const menu = [
    { to: '/admin', label: t('admin.overview'), icon: LayoutDashboard },
    { to: '/admin/primary', label: t('admin.primaryUnits'), icon: Home },
    { to: '/admin/resale-projects', label: t('admin.resaleProjects'), icon: Building2 },
    { to: '/admin/resale-units', label: t('admin.resaleUnits'), icon: Building2 },
    { to: '/admin/carousel', label: t('admin.carousel'), icon: Images },
    { to: '/admin/inquiries', label: t('admin.inquiries'), icon: MessageSquare },
  ]

  const isActive = (path: string) => (path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path))
  const Arrow = dir === 'rtl' ? ArrowRight : ArrowLeft

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex" dir={dir}>
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen w-64 bg-neutral-900 text-neutral-300 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : dir === 'rtl' ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 border-b border-neutral-800">
          <Link to="/admin" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{t('admin.title')}</div>
              <div className="text-xs text-neutral-500">{t('brand.name')}</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          <ul className="space-y-1">
            {menu.map((m) => {
              const Icon = m.icon
              return (
                <li key={m.to}>
                  <Link
                    to={m.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(m.to)
                        ? 'bg-primary-600 text-white'
                        : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {m.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-3 border-t border-neutral-800 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <Arrow className="w-5 h-5" />
            {lang === 'ar' ? 'العودة للموقع' : 'Back to site'}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-error-400 hover:bg-error-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {t('admin.logout')}
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-neutral-100 sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 lg:px-6 h-14">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="text-sm text-neutral-500">
                {t('admin.welcome')}, <span className="font-semibold text-neutral-900">{user.name}</span>
              </div>
            </div>
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              <Globe className="w-4 h-4" />
              {lang === 'ar' ? 'EN' : 'ع'}
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
