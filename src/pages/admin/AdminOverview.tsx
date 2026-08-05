import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/context/LanguageContext'
import { Chrome as Home, Building2, MessageSquare, Star, ArrowRight, ArrowLeft, TrendingUp } from 'lucide-react'
import { getPrimaryUnits, getResaleProjects, getResaleUnits, getInquiries } from '@/lib/storage'

export default function AdminOverview() {
  const { t } = useTranslation()
  const { lang, dir } = useLanguage()
  const [stats, setStats] = useState({
    primary: 0,
    projects: 0,
    resaleUnits: 0,
    inquiries: 0,
    newInquiries: 0,
    featured: 0,
  })

  useEffect(() => {
    const load = () => {
      const primary = getPrimaryUnits()
      const projects = getResaleProjects()
      const resale = getResaleUnits()
      const inq = getInquiries()
      setStats({
        primary: primary.length,
        projects: projects.length,
        resaleUnits: resale.length,
        inquiries: inq.length,
        newInquiries: inq.filter((i) => !i.is_read).length,
        featured: primary.filter((u) => u.is_featured).length,
      })
    }
    load()
    window.addEventListener('cre-data-changed', load)
    return () => window.removeEventListener('cre-data-changed', load)
  }, [])

  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  const cards = [
    { to: '/admin/primary', label: t('admin.primaryUnits'), value: stats.primary, icon: Home, color: 'from-primary-500 to-primary-600' },
    { to: '/admin/resale-projects', label: t('admin.resaleProjects'), value: stats.projects, icon: Building2, color: 'from-accent-500 to-accent-600' },
    { to: '/admin/resale-units', label: t('admin.resaleUnits'), value: stats.resaleUnits, icon: Building2, color: 'from-primary-400 to-accent-500' },
    { to: '/admin/inquiries', label: t('admin.inquiries'), value: stats.inquiries, icon: MessageSquare, color: 'from-success-500 to-success-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">{t('admin.overview')}</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {lang === 'ar' ? 'نظرة عامة على بيانات الموقع' : 'Site data overview'}
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon
          return (
            <Link
              key={i}
              to={c.to}
              className="group bg-white rounded-2xl p-5 card-shadow card-shadow-hover transition-all hover:-translate-y-0.5"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-neutral-900">{c.value}</div>
              <div className="text-sm text-neutral-500 mt-0.5 flex items-center justify-between">
                {c.label}
                <Arrow className="w-4 h-4 text-neutral-300 group-hover:text-primary-500 transition-colors" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Highlight stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 card-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-warning-500/15 flex items-center justify-center">
            <Star className="w-6 h-6 text-warning-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-900">{stats.featured}</div>
            <div className="text-sm text-neutral-500">{t('admin.featuredUnits')}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 card-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-error-500/15 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-error-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-900">{stats.newInquiries}</div>
            <div className="text-sm text-neutral-500">{t('admin.newInquiries')}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 card-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-success-500/15 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-success-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-900">{stats.primary + stats.resaleUnits}</div>
            <div className="text-sm text-neutral-500">{t('admin.totalUnits')}</div>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-2xl p-6 card-shadow">
        <h2 className="font-bold text-lg text-neutral-900 mb-4">
          {lang === 'ar' ? 'روابط سريعة' : 'Quick actions'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/admin/primary', label: t('admin.addUnit') },
            { to: '/admin/resale-projects', label: t('admin.addProject') },
            { to: '/admin/carousel', label: t('admin.addSlide') },
            { to: '/admin/inquiries', label: t('admin.inquiries') },
          ].map((l, i) => (
            <Link
              key={i}
              to={l.to}
              className="px-4 py-3 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-700 text-sm font-medium text-center transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
