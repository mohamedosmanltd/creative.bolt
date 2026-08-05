import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/context/LanguageContext'
import { Search, SlidersHorizontal, Chrome as Home } from 'lucide-react'
import PropertyCard from '@/components/PropertyCard'
import { getPrimaryUnits } from '@/lib/storage'
import type { PrimaryUnit } from '@/types'

export default function PrimaryPage() {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const [units, setUnits] = useState<PrimaryUnit[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [bedsFilter, setBedsFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const load = () => setUnits(getPrimaryUnits())
    load()
    window.addEventListener('cre-data-changed', load)
    return () => window.removeEventListener('cre-data-changed', load)
  }, [])

  const locations = useMemo(() => {
    const set = new Set<string>()
    units.forEach((u) => set.add(lang === 'ar' ? u.location_ar : u.location_en))
    return Array.from(set)
  }, [units, lang])

  const filtered = useMemo(() => {
    return units.filter((u) => {
      const title = lang === 'ar' ? u.title_ar : u.title_en
      const loc = lang === 'ar' ? u.location_ar : u.location_en
      if (search && !title.toLowerCase().includes(search.toLowerCase()) && !loc.toLowerCase().includes(search.toLowerCase())) return false
      if (statusFilter !== 'all' && u.status !== statusFilter) return false
      if (bedsFilter !== 'all' && u.bedrooms !== Number(bedsFilter)) return false
      return true
    })
  }, [units, search, statusFilter, bedsFilter, lang])

  return (
    <div className="pt-16 lg:pt-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-accent-500 text-white py-14 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-3">
              <Home className="w-4 h-4" />
              <span>{lang === 'ar' ? 'الوحدات الأساسية' : 'Primary Units'}</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold mb-3">{t('primary.title')}</h1>
            <p className="text-lg text-white/90">{t('primary.subtitle')}</p>
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
              <span className="text-2xl font-bold">{units.length}</span>
              <span className="text-sm text-white/90">{t('primary.total')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="bg-white border-b border-neutral-100 sticky top-16 lg:top-20 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder={t('common.search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-200 hover:border-primary-400 hover:bg-primary-50 text-sm font-medium transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t('common.filter')}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 animate-fade-in">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-primary-500 outline-none"
              >
                <option value="all">{t('common.status')}: {t('common.all')}</option>
                <option value="available">{t('common.available')}</option>
                <option value="reserved">{t('common.reserved')}</option>
                <option value="sold">{t('common.sold')}</option>
              </select>
              <select
                value={bedsFilter}
                onChange={(e) => setBedsFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-primary-500 outline-none"
              >
                <option value="all">{t('primary.filterBedrooms')}: {t('common.all')}</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </select>
              <div className="px-3 py-2 rounded-lg bg-neutral-50 text-xs text-neutral-500 flex items-center">
                {filtered.length} / {units.length}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Grid */}
      <section className="py-10 lg:py-14 bg-neutral-50 min-h-[50vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
              <Home className="w-12 h-12 mb-3" />
              <p className="text-lg">{t('common.noResults')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
              {filtered.map((u) => (
                <PropertyCard key={u.id} unit={u} to={`/primary/${u.id}`} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
