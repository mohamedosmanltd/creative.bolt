import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/context/LanguageContext'
import { Building, MapPin, CalendarDays, Chrome as Home, ArrowRight, ArrowLeft, Play, X } from 'lucide-react'
import { getResaleProject, getResaleUnitsByProject } from '@/lib/storage'
import type { ResaleProject, ResaleUnit } from '@/types'
import StatusBadge from '@/components/StatusBadge'
import Gallery from '@/components/Gallery'
import PropertyCard from '@/components/PropertyCard'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const { lang, dir } = useLanguage()
  const navigate = useNavigate()
  const [project, setProject] = useState<ResaleProject | undefined>(undefined)
  const [units, setUnits] = useState<ResaleUnit[]>([])
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const p = getResaleProject(id)
    setProject(p)
    if (p) setUnits(getResaleUnitsByProject(p.id))
    window.scrollTo(0, 0)
  }, [id])

  if (!project) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="text-neutral-500 mb-4">{t('common.noResults')}</p>
        <button onClick={() => navigate('/resale')} className="text-primary-600 font-medium">
          {t('common.back')}
        </button>
      </div>
    )
  }

  const name = lang === 'ar' ? project.name_ar : project.name_en
  const developer = lang === 'ar' ? project.developer_ar : project.developer_en
  const desc = lang === 'ar' ? project.description_ar : project.description_en
  const location = lang === 'ar' ? project.location_ar : project.location_en
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  const info = [
    { icon: Building, label: t('project.developer'), value: developer },
    { icon: MapPin, label: t('project.location'), value: location },
    { icon: CalendarDays, label: t('project.deliveryDate'), value: project.delivery_date },
    { icon: Home, label: t('project.totalUnits'), value: String(project.total_units) },
  ]

  return (
    <div className="pt-16 lg:pt-20">
      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b border-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Link to="/" className="hover:text-primary-600">{t('nav.home')}</Link>
            <span>/</span>
            <Link to="/resale" className="hover:text-primary-600">{t('nav.resale')}</Link>
            <span>/</span>
            <span className="text-neutral-700 line-clamp-1">{name}</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="relative h-[40vh] min-h-[280px] bg-neutral-900">
        <img
          src={project.image_urls[0] || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1600'}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="text-white max-w-3xl">
              <div className="mb-3">
                <StatusBadge status={project.status} size="md" />
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold drop-shadow-lg">{name}</h1>
              {developer && (
                <div className="flex items-center gap-2 mt-3 text-white/90">
                  <Building className="w-5 h-5" />
                  <span className="text-lg">{developer}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Info cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-8">
          {info.map((item, i) => {
            const Icon = item.icon
            return (
              <div key={i} className="p-4 rounded-xl bg-white border border-neutral-100 card-shadow">
                <Icon className="w-5 h-5 text-primary-600 mb-2" />
                <div className="text-xs text-neutral-500">{item.label}</div>
                <div className="font-semibold text-neutral-900 text-sm mt-0.5 line-clamp-1">{item.value || '—'}</div>
              </div>
            )
          })}
        </div>

        {/* Overview */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10 mb-12">
          <div className="lg:col-span-2">
            <h2 className="text-xl lg:text-2xl font-bold text-neutral-900 mb-3">{t('project.overview')}</h2>
            <p className="text-neutral-700 leading-relaxed whitespace-pre-line">{desc}</p>

            {/* Gallery */}
            {project.image_urls.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-neutral-900 mb-4">{t('project.gallery')}</h3>
                <Gallery images={project.image_urls} alt={name} />
              </div>
            )}

            {/* Videos */}
            {project.video_urls.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-neutral-900 mb-4">{t('project.videos')}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {project.video_urls.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveVideo(v)}
                      className="relative aspect-video rounded-xl overflow-hidden bg-neutral-900 group"
                    >
                      <img
                        src={project.image_urls[i % project.image_urls.length] || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'}
                        alt={`Video ${i + 1}`}
                        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center transition-all">
                          <Play className="w-6 h-6 text-primary-600 ltr:ml-1 rtl:mr-1" fill="currentColor" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-neutral-100 p-6 card-shadow">
              <h3 className="font-semibold text-neutral-900 mb-3">{t('resale.units')}</h3>
              <div className="text-3xl font-bold text-primary-700">{units.length}</div>
              <div className="text-sm text-neutral-500 mt-1">{t('project.totalUnits')}</div>

              <div className="my-5 h-px bg-neutral-100" />

              <Link
                to="/contact"
                className="block w-full text-center px-4 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm transition-colors"
              >
                {t('common.contactUs')}
              </Link>
            </div>
          </aside>
        </div>

        {/* Units */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-neutral-900">{t('project.units')}</h2>
            <span className="text-sm text-neutral-500">{units.length} {lang === 'ar' ? 'وحدة' : 'units'}</span>
          </div>
          {units.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-400 bg-neutral-50 rounded-2xl">
              <Home className="w-12 h-12 mb-3" />
              <p className="text-lg">{t('project.noUnits')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {units.map((u) => (
                <PropertyCard key={u.id} unit={u} to={`/resale/unit/${u.id}`} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Video modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveVideo(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            onClick={() => setActiveVideo(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={activeVideo}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Project video"
            />
          </div>
        </div>
      )}
    </div>
  )
}
