import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/context/LanguageContext'
import { ArrowRight, ArrowLeft, ShieldCheck, Layers, Users, BadgeDollarSign, Building2, Chrome as Home, Phone } from 'lucide-react'
import HeroCarousel from '@/components/HeroCarousel'
import PropertyCard from '@/components/PropertyCard'
import ProjectCard from '@/components/ProjectCard'
import { getPrimaryUnits, getResaleProjects } from '@/lib/storage'
import type { PrimaryUnit, ResaleProject } from '@/types'

export default function HomePage() {
  const { t } = useTranslation()
  const { lang, dir } = useLanguage()
  const [featuredUnits, setFeaturedUnits] = useState<PrimaryUnit[]>([])
  const [projects, setProjects] = useState<ResaleProject[]>([])

  useEffect(() => {
    const u = getPrimaryUnits().filter((u) => u.is_featured).slice(0, 6)
    setFeaturedUnits(u.length >= 3 ? u : getPrimaryUnits().slice(0, 6))
    setProjects(getResaleProjects().filter((p) => p.is_featured).slice(0, 3))
    const handler = () => {
      const uu = getPrimaryUnits().filter((u) => u.is_featured).slice(0, 6)
      setFeaturedUnits(uu.length >= 3 ? uu : getPrimaryUnits().slice(0, 6))
      setProjects(getResaleProjects().filter((p) => p.is_featured).slice(0, 3))
    }
    window.addEventListener('cre-data-changed', handler)
    return () => window.removeEventListener('cre-data-changed', handler)
  }, [])

  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  const stats = [
    { value: '20', label: t('home.statsUnits'), icon: Home },
    { value: '4+', label: t('home.statsProjects'), icon: Building2 },
    { value: '500+', label: t('home.statsClients'), icon: Users },
    { value: '10+', label: t('home.statsYears'), icon: ShieldCheck },
  ]

  const whyUs = [
    { icon: ShieldCheck, title: t('home.why1Title'), desc: t('home.why1Desc') },
    { icon: Layers, title: t('home.why2Title'), desc: t('home.why2Desc') },
    { icon: Users, title: t('home.why3Title'), desc: t('home.why3Desc') },
    { icon: BadgeDollarSign, title: t('home.why4Title'), desc: t('home.why4Desc') },
  ]

  return (
    <div>
      <HeroCarousel />

      {/* Stats bar */}
      <section className="bg-white border-b border-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-2xl lg:text-3xl font-bold text-neutral-900">{s.value}</div>
                    <div className="text-xs lg:text-sm text-neutral-500">{s.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Units */}
      <section className="py-14 lg:py-20 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 lg:mb-10">
            <div>
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
                {lang === 'ar' ? 'مختاراتنا' : 'Our Picks'}
              </span>
              <h2 className="text-2xl lg:text-4xl font-bold text-neutral-900 mt-1">
                {t('home.featuredTitle')}
              </h2>
              <p className="text-neutral-600 mt-2">{t('home.featuredSubtitle')}</p>
            </div>
            <Link
              to="/primary"
              className="inline-flex items-center gap-2 text-primary-600 font-medium hover:gap-3 transition-all"
            >
              {t('common.viewAll')} <Arrow className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {featuredUnits.map((u) => (
              <PropertyCard key={u.id} unit={u} to={`/primary/${u.id}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Primary section CTA */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt={t('home.primaryTitle')}
                className="rounded-2xl shadow-xl w-full aspect-[4/3] object-cover"
              />
              <div className="absolute -bottom-6 ltr:-right-6 rtl:-left-6 bg-primary-600 text-white rounded-2xl px-6 py-4 shadow-xl hidden sm:block">
                <div className="text-3xl font-bold">20</div>
                <div className="text-sm text-white/90">{t('home.statsUnits')}</div>
              </div>
            </div>
            <div>
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
                {lang === 'ar' ? 'الوحدات الأساسية' : 'Primary Market'}
              </span>
              <h2 className="text-2xl lg:text-4xl font-bold text-neutral-900 mt-1 mb-4">
                {t('home.primaryTitle')}
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-6">{t('home.primarySubtitle')}</p>
              <ul className="space-y-3 mb-8">
                {(lang === 'ar'
                  ? ['تشطيبات سوبر لوكس', 'خطط سداد حتى 7 سنوات', 'مواقع استراتيجية', 'مرافق وخدمات متكاملة']
                  : ['Super-lux finishes', 'Payment plans up to 7 years', 'Strategic locations', 'Complete facilities']
                ).map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-neutral-700">
                    <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/primary"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors shadow-md"
              >
                {t('common.viewAll')} <Arrow className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Resale projects */}
      <section className="py-14 lg:py-20 bg-gradient-to-b from-primary-50/40 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 lg:mb-10">
            <div>
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
                {lang === 'ar' ? 'إعادة البيع' : 'Resale Market'}
              </span>
              <h2 className="text-2xl lg:text-4xl font-bold text-neutral-900 mt-1">
                {t('home.resaleTitle')}
              </h2>
              <p className="text-neutral-600 mt-2">{t('home.resaleSubtitle')}</p>
            </div>
            <Link
              to="/resale"
              className="inline-flex items-center gap-2 text-primary-600 font-medium hover:gap-3 transition-all"
            >
              {t('common.viewAll')} <Arrow className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-14">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
              {lang === 'ar' ? 'لماذا نحن' : 'Why Us'}
            </span>
            <h2 className="text-2xl lg:text-4xl font-bold text-neutral-900 mt-1">{t('home.whyUs')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((w, i) => {
              const Icon = w.icon
              return (
                <div
                  key={i}
                  className="text-center p-6 rounded-2xl bg-neutral-50 hover:bg-primary-50 transition-colors group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white group-hover:bg-primary-600 flex items-center justify-center mx-auto mb-4 transition-all shadow-sm">
                    <Icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-neutral-900 mb-2">{w.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{w.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 lg:py-20 bg-gradient-to-br from-primary-700 via-primary-600 to-accent-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl lg:text-4xl font-bold mb-3">{t('home.ctaTitle')}</h2>
            <p className="text-lg text-white/90 mb-8">{t('home.ctaSubtitle')}</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-primary-700 font-semibold hover:bg-primary-50 transition-colors shadow-lg"
            >
              <Phone className="w-5 h-5" />
              {t('home.ctaButton')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
