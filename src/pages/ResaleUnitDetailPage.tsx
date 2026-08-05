import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/context/LanguageContext'
import { Bed, Bath, Maximize, Building, MapPin, ArrowRight, ArrowLeft, Phone, Mail, CircleCheck as CheckCircle2 } from 'lucide-react'
import { getResaleUnit, getResaleProject, getResaleUnits } from '@/lib/storage'
import type { ResaleUnit, ResaleProject } from '@/types'
import StatusBadge from '@/components/StatusBadge'
import Gallery from '@/components/Gallery'
import PropertyCard from '@/components/PropertyCard'
import InquiryForm from '@/components/InquiryForm'
import { formatPrice } from '@/lib/helpers'

export default function ResaleUnitDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const { lang, dir } = useLanguage()
  const navigate = useNavigate()
  const [unit, setUnit] = useState<ResaleUnit | undefined>(undefined)
  const [project, setProject] = useState<ResaleProject | undefined>(undefined)
  const [similar, setSimilar] = useState<ResaleUnit[]>([])

  useEffect(() => {
    if (!id) return
    const u = getResaleUnit(id)
    setUnit(u)
    if (u) {
      setProject(getResaleProject(u.project_id))
      setSimilar(getResaleUnits().filter((x) => x.id !== id && x.project_id === u.project_id).slice(0, 3))
    }
    window.scrollTo(0, 0)
  }, [id])

  if (!unit) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="text-neutral-500 mb-4">{t('common.noResults')}</p>
        <button onClick={() => navigate('/resale')} className="text-primary-600 font-medium">
          {t('common.back')}
        </button>
      </div>
    )
  }

  const title = lang === 'ar' ? unit.title_ar : unit.title_en
  const desc = lang === 'ar' ? unit.description_ar : unit.description_en
  const projectName = project ? (lang === 'ar' ? project.name_ar : project.name_en) : ''
  const location = project ? (lang === 'ar' ? project.location_ar : project.location_en) : ''
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  const specs = [
    { icon: Bed, label: t('unit.bedrooms'), value: unit.bedrooms },
    { icon: Bath, label: t('unit.bathrooms'), value: unit.bathrooms },
    { icon: Maximize, label: t('unit.area'), value: `${unit.area_m2} ${lang === 'ar' ? 'م²' : 'sqm'}` },
    { icon: Building, label: t('unit.floor'), value: unit.floor },
  ]

  return (
    <div className="pt-16 lg:pt-20">
      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b border-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-neutral-500 flex-wrap">
            <Link to="/" className="hover:text-primary-600">{t('nav.home')}</Link>
            <span>/</span>
            <Link to="/resale" className="hover:text-primary-600">{t('nav.resale')}</Link>
            {project && (
              <>
                <span>/</span>
                <Link to={`/resale/${project.id}`} className="hover:text-primary-600 line-clamp-1">{projectName}</Link>
              </>
            )}
            <span>/</span>
            <span className="text-neutral-700 line-clamp-1">{title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Main */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">{title}</h1>
                <div className="flex items-center gap-1.5 mt-2 text-neutral-600">
                  <MapPin className="w-4 h-4 text-primary-500" />
                  <span className="text-sm">{location}</span>
                </div>
                {project && (
                  <Link
                    to={`/resale/${project.id}`}
                    className="inline-flex items-center gap-1.5 mt-2 text-sm text-primary-600 hover:underline"
                  >
                    <Building className="w-4 h-4" /> {projectName}
                  </Link>
                )}
              </div>
              <StatusBadge status={unit.status} size="md" />
            </div>

            <Gallery images={unit.image_urls} alt={title} />

            {/* Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              {specs.map((s, i) => {
                const Icon = s.icon
                return (
                  <div key={i} className="p-4 rounded-xl bg-neutral-50 text-center">
                    <Icon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                    <div className="text-xs text-neutral-500">{s.label}</div>
                    <div className="font-bold text-neutral-900 mt-0.5">{s.value}</div>
                  </div>
                )
              })}
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-3">{t('unit.description')}</h2>
              <p className="text-neutral-700 leading-relaxed whitespace-pre-line">{desc}</p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-5">
              <div className="bg-white rounded-2xl border border-neutral-100 p-6 card-shadow">
                <div className="text-sm text-neutral-500 mb-1">{t('unit.price')}</div>
                <div className="text-3xl font-bold text-primary-700">
                  {formatPrice(unit.price_eur, 'eur')}
                </div>
                <div className="text-lg text-neutral-600 mt-1">
                  {formatPrice(unit.price_egp, 'egp')}
                </div>

                <div className="my-5 h-px bg-neutral-100" />

                <h3 className="font-semibold text-neutral-900 mb-3">{t('unit.contactAbout')}</h3>
                <InquiryForm unitId={unit.id} unitType="resale" compact />

                <div className="mt-4 pt-4 border-t border-neutral-100 grid grid-cols-2 gap-2">
                  <a
                    href="tel:+201001234567"
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium hover:bg-primary-100 transition-colors"
                  >
                    <Phone className="w-4 h-4" /> {t('contact.phone')}
                  </a>
                  <a
                    href="mailto:info@creative-realestate.com"
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium hover:bg-primary-100 transition-colors"
                  >
                    <Mail className="w-4 h-4" /> {t('contact.email')}
                  </a>
                </div>
              </div>

              <div className="bg-primary-50 rounded-2xl p-5">
                <h3 className="font-semibold text-primary-800 mb-3 text-sm">
                  {lang === 'ar' ? 'لماذا تشتري معنا؟' : 'Why buy with us?'}
                </h3>
                <ul className="space-y-2">
                  {(lang === 'ar'
                    ? ['استشارة مجانية', 'خطط سداد مرنة', 'متابعة كاملة حتى التسليم']
                    : ['Free consultation', 'Flexible payment plans', 'Full support until delivery']
                  ).map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-primary-800">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-14 lg:mt-20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-neutral-900">{t('unit.similarTitle')}</h2>
              {project && (
                <Link to={`/resale/${project.id}`} className="text-primary-600 text-sm font-medium flex items-center gap-1">
                  {t('common.viewAll')} <Arrow className="w-4 h-4" />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {similar.map((u) => (
                <PropertyCard key={u.id} unit={u} to={`/resale/unit/${u.id}`} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
