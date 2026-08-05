import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/context/LanguageContext'
import { Building2 } from 'lucide-react'
import ProjectCard from '@/components/ProjectCard'
import { getResaleProjects } from '@/lib/storage'
import type { ResaleProject } from '@/types'

export default function ResalePage() {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const [projects, setProjects] = useState<ResaleProject[]>([])

  useEffect(() => {
    const load = () => setProjects(getResaleProjects())
    load()
    window.addEventListener('cre-data-changed', load)
    return () => window.removeEventListener('cre-data-changed', load)
  }, [])

  return (
    <div className="pt-16 lg:pt-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-accent-500 text-white py-14 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-3">
              <Building2 className="w-4 h-4" />
              <span>{lang === 'ar' ? 'إعادة البيع' : 'Resale'}</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold mb-3">{t('resale.title')}</h1>
            <p className="text-lg text-white/90">{t('resale.subtitle')}</p>
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
              <span className="text-2xl font-bold">{projects.length}</span>
              <span className="text-sm text-white/90">{t('resale.projects')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-10 lg:py-14 bg-neutral-50 min-h-[50vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
              <Building2 className="w-12 h-12 mb-3" />
              <p className="text-lg">{t('resale.noProjects')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
